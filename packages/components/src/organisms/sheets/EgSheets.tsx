import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../atoms/glass/glassPressHaptic.js';
import {
  resolveSheetsDetentIndex,
  sheetsDetentSpringConfig,
  sheetsDismissTimingConfig,
  sheetsFrame,
  sheetsFrameTokens,
  sheetsPresentSpringConfig,
  sheetsTopOffset,
} from '../../shared/motion/sheetsMotion.js';
import { EgEdsAnimaOverlayModal } from '../../shared/motion/overlayModal.js';
import { isIos26OrLater } from '../../shared/iosVersion.js';
import { getThemeColors, mobileTheme } from '../../theme/index.js';
import { EG_GLASS_SHEETS_BOX, EgGlass } from '../../atoms/glass/EgGlass.js';
import { GlassBlurBackdrop, GlassBlurScope } from '../../atoms/glass/GlassBlurScope.js';
import {
  GlassMaskScrollEdgeHost,
  GlassMaskScrollEdgeScope,
} from '../../atoms/glass/GlassMaskScrollEdge.js';
import { SmoothCornerView } from '../../shared/smoothCorner/SmoothCornerView.js';
import { EgBrandButton } from '../../molecules/button/brand-button/EgBrandButton.js';
import { EgNavBar } from '../tab-bar/nav-bar/EgNavBar.js';
import type { EgNavBarAction } from '../tab-bar/nav-bar/EgNavBar.types.js';
import {
  egNavBarContentHeight,
  egNavBarScrollContentReserve,
} from '../tab-bar/nav-bar/egNavBarMetrics.js';
import { useEgNavBarScroll } from '../tab-bar/nav-bar/useEgNavBarScroll.js';
import type { EgSheetsDetent, EgSheetsProps } from './EgSheets.types.js';

const DETENT_ORDER: readonly EgSheetsDetent[] = ['small', 'medium', 'adaptive', 'large'];
const DETENT_FRACTION = { small: 0.28, medium: 0.5 } as const;
const DEFAULT_DETENTS: readonly EgSheetsDetent[] = ['medium', 'large'];
/** 低于最小档继续下拉超过该比例即收起。 */
const DISMISS_DRAG_RATIO = 0.3;
const DISMISS_VELOCITY = 800;
/** 超出最高档 / 不可收起时低于最小档的橡皮筋阻尼。 */
const RUBBER_BAND = 0.25;
/** 纵向位移超过该值才激活拖拽，点按顶栏按钮不会误触发档位吸附。 */
const DRAG_ACTIVATION_PX = 8;
/** 可滚动档：内容区长按该时长后由滚动转为拖拽容器（iOS 长按手势同档）。 */
const CONTENT_LONG_PRESS_MS = 350;
/** 与最高档的距离在该值内视为已到最高档（内容区可滚动）。 */
const TOP_DETENT_EPSILON_PX = 2;
/** 超过最高档的橡皮筋余量（裁切层 / 面板固定高度预留）。 */
const RUBBER_HEADROOM_PX = 160;
/** Reduce Motion · sheets → fade（与 motion-duration-fade 同档）。 */
const REDUCED_MOTION_FADE_MS = 180;
/** EgSheets 顶栏 · 上 / 左 / 右 spacing-4，按钮距卡片边恒定。 */
const SHEETS_CHROME_PADDING = mobileTheme.spacing['spacing-4'] as number;
/** EgSheets 顶栏 · 下 spacing-2（RN 栈；iOS 26+ 原生 scroll edge 时补齐到系统栏高）。 */
const SHEETS_CHROME_PADDING_BOTTOM = mobileTheme.spacing['spacing-2'] as number;
/** 内容插槽 / 底部 action · 距卡片左右边 spacing-5（恒定，不随档位变化）。 */
const SHEETS_CONTENT_PADDING = mobileTheme.spacing['spacing-5'] as number;
/** iOS 26+ 原生 scroll edge 顶栏下，内容区上内边距额外补偿 spacing-1。 */
const SHEETS_NATIVE_EDGE_CONTENT_OFFSET = mobileTheme.spacing['spacing-1'] as number;
/** iOS 26+ 原生栈未回传栏高时，内容区最迟在该时长后显现。 */
const NATIVE_EDGE_REVEAL_TIMEOUT_MS = 600;
/** 顶栏高度 = 上边距 + 内容 + 下边距（以 onLayout 实测为准；此为首帧测量前的初值）。 */
const CHROME_HEIGHT_SEED = egNavBarScrollContentReserve(
  0,
  SHEETS_CHROME_PADDING,
  SHEETS_CHROME_PADDING_BOTTOM,
);
function normalizeDetents(detents: readonly EgSheetsDetent[] | undefined): EgSheetsDetent[] {
  const picked = DETENT_ORDER.filter((detent) => (detents ?? DEFAULT_DETENTS).includes(detent));
  return picked.length > 0 ? picked : [...DEFAULT_DETENTS];
}

/**
 * Sheets · EdsSemanticAnima('sheets') — iOS 27 Sheet：
 * 自底部滑入 → 部分档悬浮卡片（四周 inset · 四角圆角）→ large 档贴边（顶边距系统条 motion-offset-sheets-top）；
 * 卡片 `EgGlass` · `glass-sheets-box`；背后遮罩小中 `effect-sheets-background`、大档 `material-base-tertiary`；
 * 顶部 EgNavBar 悬浮于内容之上，`background="auto"`（内容滚入栏下才显现背景）。
 * 小 / 中档内容区不滚动、整张可拖拽；最高档内容区滚动，顶栏拖拽或长按内容区拖拽。
 * 顶栏按钮由 EDS 锁定，业务侧禁止修改 / 替换，仅可显隐：左侧返回（默认隐藏）· 右侧关闭（默认显示）。
 * 顶栏按钮 / 内容插槽 / action 距卡片边恒定，不随档位变化。
 */
export function EgSheets({
  visible,
  onDismiss,
  detents: detentsProp,
  initialDetent,
  detent,
  onDetentChange,
  title,
  showTitle = true,
  showLeft = false,
  onBack,
  showRight = true,
  dismissible = true,
  scrollEdgeEffect = 'soft',
  mode = 'light',
  contentStyle,
  children,
  actions,
  showActions = true,
  testID,
}: EgSheetsProps) {
  const colors = getThemeColors(mode);
  const reduceMotion = useReducedMotion();
  const safeArea = useSafeAreaInsets();
  const [containerHeight, setContainerHeight] = useState(() => Dimensions.get('window').height);
  const [containerWidth, setContainerWidth] = useState(() => Dimensions.get('window').width);

  const detentKey = normalizeDetents(detentsProp).join(',');
  const detentNames = useMemo(() => detentKey.split(',') as EgSheetsDetent[], [detentKey]);
  const largeHeight = Math.round(containerHeight - safeArea.top - sheetsTopOffset);
  const mediumHeight = Math.round(containerHeight * DETENT_FRACTION.medium);
  const [measuredContentHeight, setMeasuredContentHeight] = useState(0);
  const hasActions = showActions;
  const [actionsHeight, setActionsHeight] = useState(0);
  const actionsHeightSV = useSharedValue(0);
  useEffect(() => {
    if (!hasActions) {
      setActionsHeight(0);
      actionsHeightSV.value = 0;
    }
  }, [actionsHeightSV, hasActions]);
  const onActionsLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = Math.round(event.nativeEvent.layout.height);
      actionsHeightSV.value = height;
      setActionsHeight((prev) => (prev === height ? prev : height));
    },
    [actionsHeightSV],
  );
  const [chromeHeight, setChromeHeight] = useState(CHROME_HEIGHT_SEED);
  /** iOS 26+ 系统 scroll edge 实测高度；>0 时顶栏下边距补齐到该高度（系统栏不可改高）。 */
  const [nativeEdgeHeight, setNativeEdgeHeight] = useState(0);
  /**
   * iOS 26+ · RNS 在原生栈挂载时会把首个 ScrollView 的 `never` 改成 `automatic`
   * （外层为 TabsScreen 时），系统栏显隐随之增减内容 inset，打开时内容上下跳动。
   * 每次呈现先以 `automatic` 挂载（RNS 仅改写 `never`），原生栈回传栏高后切回 `never`，
   * 切换并归零滚动前内容区透明。
   */
  const [nativeScrollInsetLocked, setNativeScrollInsetLocked] = useState(
    () => !isIos26OrLater(),
  );
  const [contentRevealed, setContentRevealed] = useState(() => !isIos26OrLater());
  const onNativeEdgeHeight = useCallback((height: number) => {
    setNativeEdgeHeight((prev) => (prev === height ? prev : height));
    setNativeScrollInsetLocked(true);
  }, []);
  const chromePaddingBottom =
    nativeEdgeHeight > 0
      ? Math.max(0, nativeEdgeHeight - egNavBarContentHeight(SHEETS_CHROME_PADDING, 0))
      : SHEETS_CHROME_PADDING_BOTTOM;
  const onChromeLayout = useCallback((event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height);
    setChromeHeight((prev) => (prev === height ? prev : height));
  }, []);
  const contentTopInset =
    chromeHeight + (nativeEdgeHeight > 0 ? SHEETS_NATIVE_EDGE_CONTENT_OFFSET : 0);
  const resolveAdaptiveHeight = useCallback(
    (contentHeight: number) => {
      const scrollPadBottom = mobileTheme.spacing['spacing-5'] as number;
      const body = Math.max(
        contentTopInset + scrollPadBottom,
        contentTopInset + contentHeight,
      );
      return Math.min(largeHeight, Math.round(body));
    },
    [contentTopInset, largeHeight],
  );

  const detentHeightsKey = detentNames
    .map((name) => {
      if (name === 'large') {
        return largeHeight;
      }
      if (name === 'adaptive') {
        return resolveAdaptiveHeight(measuredContentHeight);
      }
      return Math.round(containerHeight * DETENT_FRACTION[name]);
    })
    .join(',');
  /**
   * 仅档位数值变化才换引用 — Action / 内容高度变化（贴边时折行）不改中 / 大档，
   * 不得据此重新落位，否则会打断进行中的档位弹簧与拖拽手势。
   */
  const detentHeights = useMemo(
    () => detentHeightsKey.split(',').map(Number),
    [detentHeightsKey],
  );
  const minHeight = Math.min(...detentHeights);
  const maxHeight = Math.max(...detentHeights);
  const floatingHeights = detentHeights.filter((_, index) => detentNames[index] !== 'large');
  const attachFrom = floatingHeights.length > 0 ? Math.max(...floatingHeights) : mediumHeight;
  const hiddenOffset = maxHeight + sheetsFrameTokens.inset + safeArea.bottom;
  const initialDetentName = detent ?? initialDetent ?? 'medium';
  const initialIndex = Math.max(0, detentNames.indexOf(initialDetentName));
  const topIndex = useMemo(() => {
    let best = 0;
    let bestHeight = 0;
    for (let i = 0; i < detentHeights.length; i += 1) {
      const height = detentHeights[i]!;
      const isLarge = detentNames[i] === 'large';
      if (height > bestHeight || (height === bestHeight && isLarge)) {
        bestHeight = height;
        best = i;
      }
    }
    return best;
  }, [detentHeights, detentNames]);

  const [mounted, setMounted] = useState(visible);
  const [contentScrollEnabled, setContentScrollEnabled] = useState(initialIndex === topIndex);
  /** 顶栏背景 `auto`：内容滚入栏下时显现（同 EgNavBar 页面态）。 */
  const navScroll = useEgNavBarScroll({ nativeScrollEdge: false });
  /** 内容滚入顶栏下才显示 iOS 26+ scroll edge（同 RN mask `background="auto"`）。 */
  const [scrollEdgeActive, setScrollEdgeActive] = useState(false);
  useAnimatedReaction(
    () => navScroll.scrollOffset.value > 0,
    (under, prev) => {
      if (under !== prev) scheduleOnRN(setScrollEdgeActive, under);
    },
  );
  useEffect(() => {
    if (!contentScrollEnabled) {
      setScrollEdgeActive(false);
      navScroll.scrollOffset.value = 0;
    }
  }, [contentScrollEnabled, navScroll.scrollOffset]);
  /** 可滚动档长按内容区拖拽容器期间暂停滚动。 */
  const [contentDragLocked, setContentDragLocked] = useState(false);
  const scrollRef = useRef<{ scrollTo: (options: { y: number; animated?: boolean }) => void } | null>(
    null,
  );
  const closingRef = useRef(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const onDetentChangeRef = useRef(onDetentChange);
  onDetentChangeRef.current = onDetentChange;

  const sheetHeight = useSharedValue(detentHeights[initialIndex]!);
  /** 纵向位移：呈现 / 收起滑动 · 低于最小档继续下拉。 */
  const offsetY = useSharedValue(hiddenOffset);
  /** 收起终点 = 当前可视高度（刚好出屏，先快后慢的慢段落在屏内）；遮罩从起点值连续淡到 0。 */
  const exitDistance = useSharedValue(hiddenOffset);
  const exitFrom = useSharedValue(0);
  const exitDimFrom = useSharedValue(1);
  /** 透明度 · 仅 Reduce Motion 下 fade 呈现 / 收起。 */
  const presence = useSharedValue(1);
  const dragStartVisible = useSharedValue(0);
  const currentIndex = useSharedValue(initialIndex);
  /** 1 = 收起动画进行中：手势与档位吸附不得覆盖 offsetY 的收起弹簧。 */
  const closing = useSharedValue(0);
  /** 拖拽进行中冻结滚动态：避免跨档时重建内容区手势而中断当前拖拽。 */
  const dragging = useSharedValue(false);

  const onRootLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.height);
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setContainerHeight((prev) => (prev === next || next <= 0 ? prev : next));
    setContainerWidth((prev) => (prev === nextWidth || nextWidth <= 0 ? prev : nextWidth));
  }, []);

  const finishClose = useCallback(() => {
    closingRef.current = false;
    setMounted(false);
    onDismissRef.current();
  }, []);

  const markClosing = useCallback(() => {
    closingRef.current = true;
  }, []);

  const onDetentSettled = useCallback(
    (index: number) => {
      triggerGlassPressHaptic();
      onDetentChangeRef.current?.(detentNames[index]!);
    },
    [detentNames],
  );

  const applyScrollEnabled = useCallback((enabled: boolean) => {
    setContentScrollEnabled(enabled);
    if (!enabled) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      navScroll.scrollOffset.value = 0;
    }
  }, [navScroll.scrollOffset]);

  useAnimatedReaction(
    () => {
      if (dragging.value) {
        return -1;
      }
      return sheetHeight.value >= maxHeight - TOP_DETENT_EPSILON_PX ? 1 : 0;
    },
    (state, prev) => {
      if (state !== -1 && state !== prev) {
        scheduleOnRN(applyScrollEnabled, state === 1);
      }
    },
    [maxHeight],
  );

  const animateOut = useCallback(() => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;
    closing.value = 1;
    const done = (finished?: boolean) => {
      'worklet';
      if (finished) {
        scheduleOnRN(finishClose);
      }
    };
    const target = sheetHeight.value + sheetsFrameTokens.inset;
    exitFrom.value = offsetY.value;
    exitDimFrom.value = 1;
    exitDistance.value = target;
    if (reduceMotion) {
      presence.value = withTiming(0, { duration: REDUCED_MOTION_FADE_MS }, done);
      return;
    }
    offsetY.value = withTiming(target, sheetsDismissTimingConfig, done);
  }, [
    closing,
    exitDimFrom,
    exitDistance,
    exitFrom,
    finishClose,
    offsetY,
    presence,
    reduceMotion,
    sheetHeight,
  ]);

  useEffect(() => {
    if (!visible) {
      if (mounted) {
        animateOut();
      }
      return;
    }
    closingRef.current = false;
    closing.value = 0;
    sheetHeight.value = detentHeights[initialIndex]!;
    currentIndex.value = initialIndex;
    applyScrollEnabled(initialIndex === topIndex);
    navScroll.scrollOffset.value = 0;
    if (isIos26OrLater()) {
      setNativeScrollInsetLocked(false);
      setContentRevealed(false);
    }
    setMounted(true);
    if (reduceMotion) {
      offsetY.value = 0;
      presence.value = 0;
      presence.value = withTiming(1, { duration: REDUCED_MOTION_FADE_MS });
      return;
    }
    presence.value = 1;
    offsetY.value = hiddenOffset;
    offsetY.value = withSpring(0, sheetsPresentSpringConfig);
    // 仅在 visible 切换时呈现 / 收起。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  useEffect(() => {
    if (!mounted || contentRevealed) {
      return;
    }
    if (!nativeScrollInsetLocked) {
      /** 原生栈未回传栏高时兜底，避免内容区一直透明。 */
      const timer = setTimeout(() => setNativeScrollInsetLocked(true), NATIVE_EDGE_REVEAL_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
    /** 等 `never` 生效、顶栏按栏高重排后归零滚动再显现。 */
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
        setContentRevealed(true);
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [contentRevealed, mounted, nativeScrollInsetLocked]);

  useEffect(() => {
    if (!detent || !mounted || closingRef.current) {
      return;
    }
    const index = detentNames.indexOf(detent);
    if (index < 0 || index === currentIndex.value) {
      return;
    }
    currentIndex.value = index;
    sheetHeight.value = withSpring(detentHeights[index]!, sheetsDetentSpringConfig);
    offsetY.value = withSpring(0, sheetsDetentSpringConfig);
    // 仅响应受控档位变化。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detent]);

  useEffect(() => {
    if (!mounted || closingRef.current) {
      return;
    }
    const index = Math.min(currentIndex.value, topIndex);
    sheetHeight.value = detentHeights[index]!;
    // 容器尺寸（旋转 / Android 沉浸）变化后重新落位当前档。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detentHeights]);

  useEffect(() => {
    if (!mounted || closingRef.current) {
      return;
    }
    if (detentNames[currentIndex.value] !== 'adaptive') {
      return;
    }
    const next = detentHeights[currentIndex.value];
    if (next == null) {
      return;
    }
    sheetHeight.value = withSpring(next, sheetsDetentSpringConfig);
    // 自适应档：内容高度变化时更新 Sheet 高度。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measuredContentHeight, detentHeights]);

  const requestDismiss = useCallback(() => {
    if (dismissible) {
      animateOut();
    }
  }, [animateOut, dismissible]);

  const beginLongPressDrag = useCallback(() => {
    triggerGlassPressHaptic();
    setContentDragLocked(true);
  }, []);

  const endLongPressDrag = useCallback(() => {
    setContentDragLocked(false);
  }, []);

  const buildPan = useCallback(
    (longPress: boolean) => {
      const pan = Gesture.Pan();
      if (longPress) {
        pan.activateAfterLongPress(CONTENT_LONG_PRESS_MS);
      } else {
        pan.activeOffsetY([-DRAG_ACTIVATION_PX, DRAG_ACTIVATION_PX]);
      }
      return pan
        .onStart(() => {
          'worklet';
          dragging.value = true;
          dragStartVisible.value = sheetHeight.value - offsetY.value;
          if (longPress) {
            scheduleOnRN(beginLongPressDrag);
          }
        })
        .onFinalize(() => {
          'worklet';
          dragging.value = false;
          if (longPress) {
            scheduleOnRN(endLongPressDrag);
          }
        })
        .onUpdate((event) => {
          'worklet';
          if (closing.value) {
            return;
          }
          const shown = dragStartVisible.value - event.translationY;
          if (shown >= minHeight) {
            offsetY.value = 0;
            sheetHeight.value = shown > maxHeight ? maxHeight + (shown - maxHeight) * RUBBER_BAND : shown;
            return;
          }
          sheetHeight.value = minHeight;
          offsetY.value = (minHeight - shown) * (dismissible ? 1 : RUBBER_BAND);
        })
        .onEnd((event) => {
          'worklet';
          if (closing.value) {
            return;
          }
          const pulledBelowMin = offsetY.value;
          if (
            dismissible &&
            (pulledBelowMin > minHeight * DISMISS_DRAG_RATIO ||
              (pulledBelowMin > 0 && event.velocityY > DISMISS_VELOCITY))
          ) {
            closing.value = 1;
            scheduleOnRN(markClosing);
            const target = Math.max(offsetY.value, sheetHeight.value + sheetsFrameTokens.inset);
            exitFrom.value = offsetY.value;
            exitDimFrom.value = 1 - Math.min(1, Math.max(0, offsetY.value / hiddenOffset));
            exitDistance.value = target;
            offsetY.value = withTiming(
              target,
              sheetsDismissTimingConfig,
              (finished?: boolean) => {
                'worklet';
                if (finished) {
                  scheduleOnRN(finishClose);
                }
              },
            );
            return;
          }
          const index = resolveSheetsDetentIndex(sheetHeight.value, event.velocityY, detentHeights);
          sheetHeight.value = withSpring(detentHeights[index]!, {
            ...sheetsDetentSpringConfig,
            velocity: -event.velocityY,
          });
          offsetY.value = withSpring(0, sheetsDetentSpringConfig);
          if (index !== currentIndex.value) {
            currentIndex.value = index;
            scheduleOnRN(onDetentSettled, index);
          }
        });
    },
    [
      beginLongPressDrag,
      closing,
      currentIndex,
      detentHeights,
      dismissible,
      dragStartVisible,
      dragging,
      endLongPressDrag,
      exitDimFrom,
      exitDistance,
      exitFrom,
      finishClose,
      markClosing,
      maxHeight,
      minHeight,
      offsetY,
      onDetentSettled,
      sheetHeight,
    ],
  );

  const chromePan = useMemo(() => buildPan(false), [buildPan]);
  const actionsPan = useMemo(() => buildPan(false), [buildPan]);

  const dimPresence = (dragOffset: number, progress: number) => {
    'worklet';
    const dragged =
      closing.value === 1
        ? exitDimFrom.value *
          (1 -
            Math.min(
              1,
              Math.max(0, (dragOffset - exitFrom.value) / Math.max(1, exitDistance.value - exitFrom.value)),
            ))
        : 1 - Math.min(1, Math.max(0, dragOffset / hiddenOffset));
    return dragged * Math.min(1, Math.max(0, progress));
  };

  /** 最高档可视高度 · 内容视口固定为此值，档位切换不改布局。 */
  const viewportHeight = Math.round(maxHeight);
  /** 裁切层固定高度 · 含橡皮筋余量与一个圆角，避免超拉时顶角被裁、各层多余圆角切入可视区。 */
  const clipHeight =
    viewportHeight +
    sheetsFrameTokens.inset +
    RUBBER_HEADROOM_PX +
    Math.max(sheetsFrameTokens.floatingRadius, sheetsFrameTokens.attachedRadius);
  const clipSize = useMemo(
    () => ({ width: containerWidth, height: clipHeight }),
    [clipHeight, containerWidth],
  );
  /** 最高档且插槽内容超出视口才滚动；未溢出时内容区与小 / 中档一样直接拖拽容器。 */
  const contentScrollable =
    contentScrollEnabled && measuredContentHeight > viewportHeight + TOP_DETENT_EPSILON_PX;
  const contentPan = useMemo(
    () => buildPan(contentScrollable),
    [buildPan, contentScrollable],
  );

  /*
   * 卡片外形 = 四层全宽裁切的交集，每层只负责一个角，全部 transform（无布局属性）：
   * 左下（底边 · 左边）→ 右下（右边）→ 左上（顶边 · 左边）→ 右上（右边 · 底色）。
   * 每层四角同半径：iOS 仅在四角一致时 `borderCurve: continuous` 生效；其余三角错位落在可视区外。
   * Android 13+ 由每层内的 `SmoothCornerView` 跟随该层动画圆角做 squircle 裁切。
   * 浮动 ↔ 贴边的左右 inset 变化不触发重排，内容宽度固定为浮动卡片宽。
   */
  const clipBottomLeftStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    const bottomEdge = frame.inset;
    return {
      borderRadius: frame.bottomRadius,
      opacity: presence.value,
      transform: [{ translateX: frame.inset }, { translateY: offsetY.value - bottomEdge }],
    };
  });

  const clipBottomRightStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return {
      borderRadius: frame.bottomRadius,
      transform: [{ translateX: -2 * frame.inset }],
    };
  });

  /** 顶边随档位高度移动。 */
  const clipTopLeftStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    const visible = sheetHeight.value;
    return {
      borderRadius: frame.topRadius,
      transform: [{ translateX: 2 * frame.inset }, { translateY: clipHeight - visible }],
    };
  });

  const clipTopRightStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return {
      borderRadius: frame.topRadius,
      transform: [{ translateX: -2 * frame.inset }],
    };
  });

  /** 内容层回到屏幕原点（全宽）。 */
  const sheetFrameBodyStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return { transform: [{ translateX: frame.inset }] };
  });

  /*
   * 内容插槽 / action 与顶栏按钮同一逻辑：始终距卡片边固定（spacing-5）。
   * 卡片宽度在浮动 ↔ 贴边间变化 16px，内容宽度随之逐帧变化（同 iOS 原生 sheet）。
   */
  const contentFrameStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return { marginHorizontal: frame.inset };
  });

  /*
   * 收边过渡中内容高度会连续回报；暂存，待贴边 / 浮动稳定后一次性提交，避免每帧 JS 重渲染。
   */
  const pendingContentHeightRef = useRef<number | null>(null);
  const attachSettledSV = useSharedValue(1);
  const commitContentHeight = useCallback((height: number) => {
    setMeasuredContentHeight((prev) => (prev === height ? prev : height));
  }, []);
  const flushContentHeight = useCallback(() => {
    const pending = pendingContentHeightRef.current;
    pendingContentHeightRef.current = null;
    if (pending != null) {
      commitContentHeight(pending);
    }
  }, [commitContentHeight]);
  useAnimatedReaction(
    () => {
      const attach = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens).attach;
      return attach <= 0 || attach >= 1 ? 1 : 0;
    },
    (settled, prev) => {
      attachSettledSV.value = settled;
      if (settled === 1 && prev === 0) {
        scheduleOnRN(flushContentHeight);
      }
    },
    [attachFrom, largeHeight],
  );
  const onContentSizeChange = useCallback(
    (_: number, height: number) => {
      const next = Math.round(height);
      if (attachSettledSV.value === 1) {
        pendingContentHeightRef.current = null;
        commitContentHeight(next);
      } else {
        pendingContentHeightRef.current = next;
      }
    },
    [attachSettledSV, commitContentHeight],
  );

  /** 顶栏左右按钮随贴边外扩，始终距卡片边固定（仅 transform）。 */
  const chromeEdgeShift = useDerivedValue(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return sheetsFrameTokens.inset - frame.inset;
  });

  /** 底部 action：底边贴当前档位可视底（不补安全区）；左右下距卡片边 spacing-5 · 上 spacing-3。 */
  const actionsStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return {
      paddingHorizontal: SHEETS_CONTENT_PADDING + frame.inset,
      transform: [{ translateY: sheetHeight.value - actionsHeightSV.value }],
    };
  });
  const dimFloatingStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return { opacity: (1 - frame.attach) * dimPresence(offsetY.value, presence.value) };
  });

  const dimAttachedStyle = useAnimatedStyle(() => {
    const frame = sheetsFrame(sheetHeight.value, attachFrom, largeHeight, sheetsFrameTokens);
    return { opacity: frame.attach * dimPresence(offsetY.value, presence.value) };
  });

  const backAction: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: onBack,
  };
  const closeAction: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-close',
    accessibilityLabel: '关闭',
    onPress: animateOut,
  };

  const onScrollContent = useCallback(
    (event: Parameters<typeof navScroll.onScroll>[0]) => {
      if (!contentScrollable) {
        navScroll.scrollOffset.value = 0;
        return;
      }
      navScroll.onScroll(event);
    },
    [contentScrollable, navScroll],
  );

  const scrollBody = (
    <GestureDetector gesture={contentPan}>
      <Animated.View style={styles.scroll}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={StyleSheet.flatten([
            styles.scrollContent,
            { paddingTop: contentTopInset },
            contentStyle,
          ])}
          contentInsetAdjustmentBehavior={nativeScrollInsetLocked ? 'never' : 'automatic'}
          scrollEnabled={contentScrollable && !contentDragLocked}
          showsVerticalScrollIndicator={contentScrollable}
          scrollIndicatorInsets={{ top: contentTopInset }}
          bounces={contentScrollable}
          onScroll={onScrollContent}
          scrollEventThrottle={navScroll.scrollEventThrottle}
          onContentSizeChange={onContentSizeChange}
        >
          <View style={{ paddingBottom: actionsHeight, opacity: contentRevealed ? 1 : 0 }}>
            {children}
          </View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );

  return (
    <SheetsModalHost visible={mounted} onRequestClose={requestDismiss}>
      <GestureHandlerRootView style={styles.root} onLayout={onRootLayout}>
        {Platform.OS === 'android' ? (
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          />
        ) : null}
        <View style={styles.dim}>
          <Animated.View
            style={[
              styles.dimLayer,
              { backgroundColor: colors['effect-sheets-background'] as string },
              dimFloatingStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.dimLayer,
              { backgroundColor: colors['material-base-tertiary'] as string },
              dimAttachedStyle,
            ]}
          />
          <Pressable style={StyleSheet.absoluteFill} onPress={requestDismiss} accessibilityLabel="关闭" />
        </View>
        <Animated.View
          style={[styles.sheetClip, clipSize, clipBottomLeftStyle]}
          pointerEvents="box-none"
          testID={testID}
        >
        <SmoothCornerView style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View
          style={[styles.clipLayer, clipSize, clipBottomRightStyle]}
          pointerEvents="box-none"
        >
        <SmoothCornerView style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View style={[styles.clipLayer, clipSize, clipTopLeftStyle]}>
        <SmoothCornerView style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View style={[styles.clipLayer, clipSize, clipTopRightStyle]}>
          <SmoothCornerView style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <EgGlass box={EG_GLASS_SHEETS_BOX} mode={mode} style={StyleSheet.absoluteFill} />
          </View>
          <Animated.View style={[styles.frameBody, clipSize, sheetFrameBodyStyle]}>
          <GlassBlurScope>
            <GlassMaskScrollEdgeScope>
            <View style={[styles.sheetBody, { height: viewportHeight }]}>
              <GlassBlurBackdrop style={styles.sheetBlurBackdrop}>
                <Animated.View style={[styles.scroll, contentFrameStyle]}>
                  <GlassMaskScrollEdgeHost
                    mode={mode}
                    edgeEffect={scrollEdgeEffect}
                    active={contentScrollable && scrollEdgeActive}
                    onEdgeHeightChange={onNativeEdgeHeight}
                  >
                    {scrollBody}
                  </GlassMaskScrollEdgeHost>
                </Animated.View>
              </GlassBlurBackdrop>
              <GestureDetector gesture={chromePan}>
                <View style={styles.sheetChrome} onLayout={onChromeLayout}>
                  <EgNavBar
                    chromeContext="overlay"
                    mode={mode}
                    title={title}
                    showTitle={showTitle}
                    titleAlign="leading"
                    leadingTitleInset={mobileTheme.spacing['spacing-1'] as number}
                    leadingTitleGap={mobileTheme.spacing['spacing-3'] as number}
                    contentPaddingHorizontal={SHEETS_CHROME_PADDING + sheetsFrameTokens.inset}
                    edgeShift={chromeEdgeShift}
                    contentPaddingTop={SHEETS_CHROME_PADDING}
                    contentPaddingBottom={chromePaddingBottom}
                    left={backAction}
                    right={closeAction}
                    showLeft={showLeft}
                    showRight={showRight}
                    background="auto"
                    scrollOffset={navScroll.scrollOffset}
                    topInset={0}
                    manageStatusBar={false}
                    style={styles.navBar}
                  />
                </View>
              </GestureDetector>
            </View>
            </GlassMaskScrollEdgeScope>
            {hasActions ? (
              <GestureDetector gesture={actionsPan}>
                <Animated.View
                  onLayout={onActionsLayout}
                  style={[
                    styles.actions,
                    { backgroundColor: colors['box-flotation'] as string },
                    actionsStyle,
                  ]}
                >
                  {actions ?? (
                    <EgBrandButton
                      label="确认"
                      mode={mode}
                      style={styles.defaultAction}
                      onPress={animateOut}
                    />
                  )}
                </Animated.View>
              </GestureDetector>
            ) : null}
          </GlassBlurScope>
          </Animated.View>
          </SmoothCornerView>
          </Animated.View>
        </SmoothCornerView>
        </Animated.View>
        </SmoothCornerView>
        </Animated.View>
        </SmoothCornerView>
        </Animated.View>
      </GestureHandlerRootView>
    </SheetsModalHost>
  );
}

/**
 * iOS 26+ 内含原生 scroll edge 栈 — 须由 react-native-screens `transparentModal` 承载：
 * 原生栈在 RN `Modal` 内会重复挂载 RN 触摸处理器，Sheet 内容点按全部失效。
 */
function SheetsModalHost({
  visible,
  onRequestClose,
  children,
}: {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}) {
  if (isIos26OrLater()) {
    return <EgEdsAnimaOverlayModal visible={visible}>{children}</EgEdsAnimaOverlayModal>;
  }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  dim: {
    ...StyleSheet.absoluteFill,
  },
  dimLayer: {
    ...StyleSheet.absoluteFill,
  },
  sheetClip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  clipLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  frameBody: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sheetBody: {},
  actions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    gap: mobileTheme.spacing['spacing-3'] as number,
    paddingTop: mobileTheme.spacing['spacing-3'] as number,
    paddingBottom: SHEETS_CONTENT_PADDING,
  },
  defaultAction: {
    alignSelf: 'stretch',
  },
  sheetBlurBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navBar: {
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SHEETS_CONTENT_PADDING,
    paddingBottom: mobileTheme.spacing['spacing-5'] as number,
  },
});
