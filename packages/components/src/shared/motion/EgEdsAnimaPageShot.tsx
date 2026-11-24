import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type GestureType,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenStack,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackItem,
} from 'react-native-screens';
import { scheduleOnRN } from 'react-native-worklets';

import { GlassContainer } from '../../atoms/glass/GlassContainer.js';
import { triggerGlassPressHaptic } from '../../atoms/glass/glassPressHaptic.js';
import { shouldUseEgGlassCapsuleNativeStack } from '../../molecules/button/button-glass/EgGlassCapsule.js';
import { EgPageShotPullBridgeProvider } from './egPageShotInteraction.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../theme/index.js';
import { EgNavBar, shouldUseEgNavBarNativeStack } from '../../organisms/tab-bar/nav-bar/EgNavBar.js';
import type { EgNavBarAction, EgNavBarScrollEdgeEffect } from '../../organisms/tab-bar/nav-bar/EgNavBar.types.js';
import { EgNavBarScrollEdgeContext, type EgNavBarScrollEdgeHost } from '../../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import { EgNavBarActionView } from '../../organisms/tab-bar/nav-bar/EgNavBarActionView.js';
import {
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarScrollContentReserve,
} from '../../organisms/tab-bar/nav-bar/egNavBarMetrics.js';
import {
  egNavBarNativeScrollEdgeEffects,
  egNavBarNativeStackOptions,
} from '../../organisms/tab-bar/nav-bar/egNavBarNativeStackOptions.js';
import { EgEdsAnimaPress } from './EgEdsAnimaPress.js';
import { EgEdsAnimaOverlayModal } from './overlayModal.js';
import { PAGE_STACK_MAX_DEPTH, PageStackLayer, usePageStack } from './pageStack.js';
import {
  pageShotCloseLaunchVelocity,
  pageShotCloseSpringConfig,
  pageShotFrame,
  pageShotOpenSpringConfig,
  type PageShotRect,
} from './pageShotMotion.js';

const REDUCED_FADE_MS = 180;
const EDGE_SWIPE_WIDTH = 24;
/** 长按激活拖拽关闭（同 EgSheets 内容区长按）· 激活前移动超 10pt 即让给滚动。 */
const LONG_PRESS_DRAG_MS = 350;

/** 停顶 Pan 向下激活（轻扫）· 向上 fail 让给滚动。 */
const PULL_ACTIVE_Y = 4;
const PULL_FAIL_UP_Y = 6;
/** 停顶 Fling 下滑 · `releaseDown` 速度阈值（pt/s）。 */
const PULL_FLING_VELOCITY_Y = 520;

/** 外壳贴近触发元素尺寸时（进度低于此值）叠出触发元素外观：展开起段 / 收回末段即为触发元素本身。 */
const MORPH_PROGRESS = 0.3;

/** 触发元素几何 · 整页自此展开、收起飞回此处（卡片 / 按钮 / 列表行…动效一致）。 */
export type EgEdsAnimaPageShotSource = {
  id: string;
  rect: PageShotRect;
  radius: number;
  /** 触发元素外观（`morph` 时）· 外壳近触发尺寸时显示。 */
  morph?: ReactNode;
  /** 收起前重量触发元素 · 弹层盖住期间下层页面若位移（滚动 / 安全区变化），飞回真实位置。 */
  remeasure?: (callback: (rect: PageShotRect) => void) => void;
};

export type EgEdsAnimaPageShotRootApi = {
  /** 呈现中的触发元素（收回完成、Modal 隐藏前保持不变）。 */
  source: EgEdsAnimaPageShotSource;
  /** 弹层内推入下一页（motion-page）· 由 `renderPage` 渲染；未传 `renderPage` 时无效。 */
  push: (pageKey: string) => void;
  close: () => void;
  /** 展开后段淡入（触发元素外的正文）。 */
  bodyStyle: ReturnType<typeof useAnimatedStyle>;
  /** 顶栏底边距弹层顶（状态栏 + NavBar）· 不滚动内容的 `paddingTop`。 */
  topInset: number;
  /** 滚动内容 `contentContainerStyle.paddingTop`（iOS 26+ 为 0 · 系统自动避让栏）。 */
  scrollTopInset: number;
  /** 滚动内容 ScrollView `contentInsetAdjustmentBehavior`（iOS 26+ `automatic` · 其余 `never`）。 */
  contentInsetAdjustmentBehavior: 'automatic' | 'never';
};

export type EgEdsAnimaPageShotPageApi = {
  source: EgEdsAnimaPageShotSource;
  pageKey: string;
  /** 0 = 弹层根页之上的第一层。 */
  depth: number;
  /** 已到最大层数时为 false。 */
  canPush: boolean;
  push: (pageKey: string) => void;
  back: () => void;
  close: () => void;
  /** 同 `EgEdsAnimaPageShotRootApi` 三项。 */
  topInset: number;
  scrollTopInset: number;
  contentInsetAdjustmentBehavior: 'automatic' | 'never';
};

export type EgEdsAnimaPageShotProps = {
  mode: ThemeMode;
  /** 弹层根页底色；可按呈现中的触发元素取色。默认 `page`。 */
  background?: string | ((source: EgEdsAnimaPageShotSource) => string);
  renderRoot: (api: EgEdsAnimaPageShotRootApi) => ReactNode;
  /** 弹层内左右切换的页面（motion-page）。 */
  renderPage?: (api: EgEdsAnimaPageShotPageApi) => ReactNode;
  /**
   * NavBar 标题 · `pageKey` 为 `null` 即弹层根页。缺省无标题（仅返回 / 关闭）。
   * iOS 26+ 系统 `UINavigationBar`（系统 push / pop · 侧滑返回）；Android · iOS ≤25 `EgNavBar`。
   */
  title?: (source: EgEdsAnimaPageShotSource, pageKey: string | null) => string | undefined;
  /** iOS 26+ 系统栏 scroll edge · 缺省 `hidden`（弹层顶栏不随滚动显现材质）。 */
  scrollEdgeEffect?: EgNavBarScrollEdgeEffect;
  children: ReactNode;
};

export type EgEdsAnimaPageShotTriggerProps = {
  /** 同一 `EgEdsAnimaPageShot` 内唯一。 */
  id: string;
  /** `capsule` = 实测高度一半。 */
  radius: number | 'capsule';
  stretch?: boolean;
  /** 弹层根页顶部与触发元素外观不同（按钮 / 行）→ 外壳近触发尺寸时叠出触发元素外观。卡片类（根页即卡片放大）无需。 */
  morph?: boolean;
  accessibilityLabel?: string;
  children: ReactNode;
};

type PageShotContextValue = {
  open: (source: EgEdsAnimaPageShotSource) => void;
  /** 弹层盖住页面期间隐藏的触发元素。 */
  hiddenId: string | null;
};

const PageShotContext = createContext<PageShotContextValue | null>(null);

type MeasurableNode = {
  measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void;
};

/**
 * 触发元素 frame → 弹层坐标：Android `measureInWindow` 扣除窗口可见区顶（状态栏），
 * 弹层 Modal `statusBarTranslucent` 以屏幕顶为原点，须补回状态栏高。
 */
function measureShotRect(node: MeasurableNode | null, callback: (rect: PageShotRect) => void) {
  const offsetY =
    Platform.OS === 'android' ? ((StatusBar as unknown as { currentHeight?: number }).currentHeight ?? 0) : 0;
  node?.measureInWindow((x, y, width, height) => callback({ x, y: y + offsetY, width, height }));
}

/**
 * page-shot 触发元素 · 量不缩放的外层（press 回弹中 frame 偏小）；弹层呈现期间隐藏自身。
 * 须置于 `EgEdsAnimaPageShot` 内。
 */
export function EgEdsAnimaPageShotTrigger({
  id,
  radius,
  stretch = false,
  morph = false,
  accessibilityLabel,
  children,
}: EgEdsAnimaPageShotTriggerProps) {
  const context = useContext(PageShotContext);
  if (!context) throw new Error('EgEdsAnimaPageShotTrigger must be rendered inside EgEdsAnimaPageShot');
  const ref = useRef<MeasurableNode | null>(null);
  return (
    <View
      ref={(node) => {
        ref.current = node as unknown as MeasurableNode | null;
      }}
      collapsable={false}
      style={{ alignSelf: stretch ? 'stretch' : 'center', opacity: context.hiddenId === id ? 0 : 1 }}
    >
      <EgEdsAnimaPress
        pressScaleDirection="down"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={() =>
          measureShotRect(ref.current, (rect) =>
            context.open({
              id,
              rect,
              radius: radius === 'capsule' ? rect.height / 2 : radius,
              morph: morph ? children : undefined,
              remeasure: (callback) => measureShotRect(ref.current, callback),
            }),
          )
        }
      >
        {children}
      </EgEdsAnimaPress>
    </View>
  );
}

/**
 * motion-page-shot · EdsSemanticAnima('page-shot')
 * 自触发元素（`EgEdsAnimaPageShotTrigger`）frame 展开整页 · 圆角 → 0 · 背后压暗 · 正文后段淡入；弹层内嵌 motion-page 页面栈；
 * 关闭 / 下拉 / 根页左缘侧滑跟手缩小，松手飞回触发元素（recipe page-shot-dismiss）；
 * 当前页滚动区停在顶部时，长按任意处即可下拉关闭（滚动区经 `useEgNavBarScroll().onScroll` 上报位置）。
 */
export function EgEdsAnimaPageShot({
  mode,
  background,
  renderRoot,
  renderPage,
  title,
  scrollEdgeEffect,
  children,
}: EgEdsAnimaPageShotProps) {
  const [source, setSource] = useState<EgEdsAnimaPageShotSource | null>(null);
  const [covering, setCovering] = useState(false);
  const context = useMemo<PageShotContextValue>(
    () => ({ open: setSource, hiddenId: covering ? (source?.id ?? null) : null }),
    [covering, source],
  );
  return (
    <PageShotContext.Provider value={context}>
      {children}
      <PageShotLayer
        mode={mode}
        source={source}
        background={background}
        onCoveringChange={setCovering}
        onClosed={() => setSource(null)}
        renderRoot={renderRoot}
        renderPage={renderPage}
        title={title}
        scrollEdgeEffect={scrollEdgeEffect}
      />
    </PageShotContext.Provider>
  );
}

function PageShotLayer({
  mode,
  source,
  background,
  onCoveringChange,
  onClosed,
  renderRoot,
  renderPage,
  title,
  scrollEdgeEffect,
}: {
  mode: ThemeMode;
  source: EgEdsAnimaPageShotSource | null;
  background: EgEdsAnimaPageShotProps['background'];
  onCoveringChange: (covering: boolean) => void;
  onClosed: () => void;
  renderRoot: EgEdsAnimaPageShotProps['renderRoot'];
  renderPage: EgEdsAnimaPageShotProps['renderPage'];
  title: EgEdsAnimaPageShotProps['title'];
  scrollEdgeEffect: EgEdsAnimaPageShotProps['scrollEdgeEffect'];
}) {
  const colors = getThemeColors(mode);
  const native = shouldUseEgNavBarNativeStack();
  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  /** 弹层宿主实测尺寸优先 · Android `window` 不含导航栏，外壳会短一截。 */
  const [hostSize, setHostSize] = useState<{ width: number; height: number } | null>(null);
  const pendingHostSizeRef = useRef<{ width: number; height: number } | null>(null);
  const fallbackSize = Dimensions.get(Platform.OS === 'android' ? 'screen' : 'window');
  const pageWidth = hostSize?.width ?? fallbackSize.width;
  const pageHeight = hostSize?.height ?? fallbackSize.height;
  /** 展开 spring 中勿 React 重排 · 几何走 shared value（iOS 26+ 不测 host，故更平滑）。 */
  const pageWidthSv = useSharedValue(fallbackSize.width);
  const pageHeightSv = useSharedValue(fallbackSize.height);
  const sourceRectSv = useSharedValue<PageShotRect>({ x: 0, y: 0, width: 0, height: 0 });
  const sourceRadiusSv = useSharedValue(0);
  const progress = useSharedValue(0);
  const drag = useSharedValue(0);
  const fade = useSharedValue(1);
  const scrollOffsetYSv = useSharedValue(0);
  const closeScrollStartYSv = useSharedValue(0);
  const closeProgressStartSv = useSharedValue(1);
  const closeScrollArmedSv = useSharedValue(false);
  const pages = usePageStack(reduceMotion);
  /** iOS 26+ 系统栈页（push / pop 动画由 UINavigationController 承担）。 */
  const [nativeStack, setNativeStack] = useState<string[]>([]);
  /** 无标题根页 floating · 仅在有 push 后才挂 `PageShotNativeStack`，避免每次展开落位根树互换导致浮层关闭钮玻璃态不一致。 */
  const [nativeStackEngaged, setNativeStackEngaged] = useState(false);
  const stack = native ? nativeStack : pages.stack;
  const [nativeBarHeight, setNativeBarHeight] = useState(0);
  const measureHost = (event: LayoutChangeEvent) => {
    if (native) return;
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    pageWidthSv.value = width;
    pageHeightSv.value = height;
    pendingHostSizeRef.current = { width, height };
    if (openSettledSv.value) {
      setHostSize((prev) => (prev?.width === width && prev?.height === height ? prev : { width, height }));
    }
  };
  /** 展开 spring 落位前 · 避免原生栏高 / inset 在入场中重排。 */
  const [openSettled, setOpenSettled] = useState(false);
  const openSettledSv = useSharedValue(false);
  /** 收回飞行中 · 顶栏关闭钮立刻撤下（不等落回触发元素）。 */
  const [closing, setClosing] = useState(false);
  const closingSv = useSharedValue(false);
  /** 各页滚动区是否停在顶部（键 -1 = 根页）· 未上报视为顶部。 */
  const [atTopByPage, setAtTopByPage] = useState<Record<number, boolean>>({});
  const topInset = native && nativeBarHeight > 0 ? nativeBarHeight : egNavBarScrollContentReserve(insets.top);
  /** 呈现中的触发元素 — 收回完成后仍保留到 Modal 隐藏，避免末帧几何 / 内容回退。 */
  const [shown, setShown] = useState<EgEdsAnimaPageShotSource | null>(source);
  /** 收回落位已交还触发元素：`morph` 外观与原位触发元素同一次提交切换，不叠帧（半透明触发元素叠两层会闪）。 */
  const [handedOff, setHandedOff] = useState(false);
  /** 收起前重量的触发元素 frame（覆盖 `shown.rect`）。 */
  const [landRect, setLandRect] = useState<PageShotRect | null>(null);
  const [chromeSession, setChromeSession] = useState(0);
  /** 与 `chromeSession` 同轨 · 展开 spring 回调只认当前场次，避免关页后陈旧回调把 `openSettled` 顶真。 */
  const chromeSessionSv = useSharedValue(0);
  if (source && source !== shown) {
    setShown(source);
    setHandedOff(false);
    setLandRect(null);
    setClosing(false);
    closingSv.value = false;
    scrollOffsetYSv.value = 0;
    closeScrollArmedSv.value = false;
    closeScrollStartYSv.value = 0;
    const nextChromeSession = chromeSession + 1;
    chromeSessionSv.value = nextChromeSession;
    setChromeSession(nextChromeSession);
    setOpenSettled(false);
    openSettledSv.value = false;
    setNativeBarHeight(0);
    setNativeStack([]);
    setNativeStackEngaged(false);
    progress.value = 0;
    fade.value = 1;
    drag.value = 0;
  }

  useEffect(() => {
    if (openSettled && pendingHostSizeRef.current && !native) {
      const { width, height } = pendingHostSizeRef.current;
      setHostSize((prev) => (prev?.width === width && prev?.height === height ? prev : { width, height }));
    }
  }, [native, openSettled]);

  useEffect(() => {
    if (!source) {
      setOpenSettled(false);
      openSettledSv.value = false;
      setClosing(false);
      closingSv.value = false;
      setNativeBarHeight(0);
      drag.value = 0;
      progress.value = 0;
      return;
    }
    setClosing(false);
    closingSv.value = false;
    closeScrollArmedSv.value = false;
    closeScrollStartYSv.value = 0;
    scrollOffsetYSv.value = 0;
    pageWidthSv.value = hostSize?.width ?? fallbackSize.width;
    pageHeightSv.value = hostSize?.height ?? fallbackSize.height;
    drag.value = 0;
    if (reduceMotion) {
      progress.value = 1;
      fade.value = 0;
      fade.value = withTiming(1, { duration: REDUCED_FADE_MS });
      setOpenSettled(true);
      openSettledSv.value = true;
      return;
    }
    fade.value = 1;
    progress.value = 0;
    setOpenSettled(false);
    openSettledSv.value = false;
    const sessionAtOpen = chromeSession;
    chromeSessionSv.value = chromeSession;
    progress.value = withSpring(1, pageShotOpenSpringConfig, (finished) => {
      'worklet';
      if (finished && chromeSessionSv.value === sessionAtOpen) {
        openSettledSv.value = true;
        scheduleOnRN(setOpenSettled, true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, chromeSession]);

  useEffect(() => {
    if (nativeStack.length > 0) setNativeStackEngaged(true);
  }, [nativeStack.length]);

  /**
   * 先恢复原位触发元素（外壳此刻与其重合），同一次提交撤下 `morph` 外观；隔两帧再撤 Modal，避免中间帧空缺 / 回退。
   */
  const finishClose = () => {
    onCoveringChange(false);
    setHandedOff(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        pages.reset();
        setNativeStack([]);
        setAtTopByPage({});
        drag.value = 0;
        closeScrollArmedSv.value = false;
        closeScrollStartYSv.value = 0;
        scrollOffsetYSv.value = 0;
        setOpenSettled(false);
        openSettledSv.value = false;
        setNativeStackEngaged(false);
        setShown(null);
        onClosed();
        requestAnimationFrame(() => {
          setClosing(false);
          closingSv.value = false;
        });
      }),
    );
  };

  const armCloseScrollSync = () => {
    const y = scrollOffsetYSv.value;
    if (y > 0.5) {
      closeScrollStartYSv.value = y;
      closeProgressStartSv.value = Math.max(1e-4, progress.value);
      closeScrollArmedSv.value = true;
    } else {
      closeScrollArmedSv.value = false;
    }
  };

  const close = (velocity = 0) => {
    armCloseScrollSync();
    drag.value = 0;
    closingSv.value = true;
    setClosing(true);
    const done = (finished?: boolean) => {
      'worklet';
      if (finished) scheduleOnRN(finishClose);
    };
    if (reduceMotion) {
      fade.value = withTiming(0, { duration: REDUCED_FADE_MS }, done);
      return;
    }
    const flyBack = () => {
      progress.value = withSpring(
        0,
        { ...pageShotCloseSpringConfig, velocity: Math.min(velocity, -pageShotCloseLaunchVelocity) },
        done,
      );
    };
    if (!shown?.remeasure) {
      flyBack();
      return;
    }
    shown.remeasure((next) => {
      if (next.width > 0 && next.height > 0) setLandRect(next);
      flyBack();
    });
  };

  const push = (pageKey: string) => {
    if (!renderPage) return;
    if (!native) {
      pages.push(pageKey);
      return;
    }
    setNativeStack((prev) => (prev.length >= PAGE_STACK_MAX_DEPTH ? prev : [...prev, pageKey]));
  };
  const back = () => (native ? setNativeStack((prev) => prev.slice(0, -1)) : pages.back());

  const depth = stack.length;
  useEffect(() => {
    setAtTopByPage((prev) => {
      const kept = Object.entries(prev).filter(([key]) => Number(key) < depth);
      return kept.length === Object.keys(prev).length ? prev : Object.fromEntries(kept);
    });
  }, [depth]);
  const topScrollIndex = stack.length === 0 ? -1 : stack.length - 1;
  const scrollAtTopSv = useSharedValue(true);
  const topScrollIndexRef = useRef(topScrollIndex);
  topScrollIndexRef.current = topScrollIndex;
  const setAtTop = useCallback(
    (index: number, atTop: boolean) => {
      if (index === topScrollIndexRef.current) {
        scrollAtTopSv.value = atTop;
      }
      setAtTopByPage((prev) => (prev[index] === atTop ? prev : { ...prev, [index]: atTop }));
    },
    [scrollAtTopSv],
  );
  useEffect(() => {
    scrollAtTopSv.value = atTopByPage[topScrollIndex] ?? true;
  }, [atTopByPage, topScrollIndex, scrollAtTopSv]);
  const hostOf = (index: number, settled = true): EgNavBarScrollEdgeHost => ({
    setEdge: () => {},
    setAtTop: (atTop) => setAtTop(index, atTop),
    settled,
  });

  const enabled = shown !== null && !reduceMotion;
  const scrollNative = useMemo(() => Gesture.Native(), []);
  const dragRange = pageHeight * 0.35;
  const dismissDistance = pageHeight * 0.15;

  const followDown = (translationY: number) => {
    'worklet';
    drag.value = Math.min(1, Math.max(0, translationY / dragRange));
  };
  const releaseDown = (translationY: number, velocityY: number) => {
    'worklet';
    const shouldDismiss =
      translationY + velocityY * 0.32 > dismissDistance || velocityY > PULL_FLING_VELOCITY_Y;
    if (shouldDismiss) {
      scheduleOnRN(close, -velocityY / pageHeight);
    } else {
      drag.value = withSpring(0, pageShotOpenSpringConfig);
    }
  };

  const onFlingDismissAtTop = useCallback(
    (velocityY: number) => {
      if (stack.length > 0) return;
      if (!openSettled || velocityY <= PULL_FLING_VELOCITY_Y) return;
      close(-velocityY / pageHeight);
    },
    [close, openSettled, pageHeight, stack.length],
  );

  const buildDismissDown = useCallback(
    (scrollGesture: GestureType, allowPageShotDismiss: boolean, withLongPress: boolean) => {
      const pullDown = Gesture.Pan()
        .enabled(enabled && allowPageShotDismiss)
        .activeOffsetY(PULL_ACTIVE_Y)
        .failOffsetY(-PULL_FAIL_UP_Y)
        .failOffsetX([-24, 24])
        .simultaneousWithExternalGesture(scrollGesture)
        .onUpdate((event) => {
          'worklet';
          if (!openSettledSv.value || !scrollAtTopSv.value || event.translationY <= 0) return;
          followDown(event.translationY);
        })
        .onEnd((event) => {
          'worklet';
          if (!openSettledSv.value || !scrollAtTopSv.value) return;
          releaseDown(event.translationY, event.velocityY);
        });

      /** 全屏 / 任意滚动位置 · 长按后下滑关页（不要求停顶）；轻扫下拉仍仅停顶。 */
      const longPressDrag = Gesture.Pan()
        .enabled(enabled && allowPageShotDismiss)
        .activateAfterLongPress(LONG_PRESS_DRAG_MS)
        .failOffsetY(-PULL_FAIL_UP_Y)
        .simultaneousWithExternalGesture(scrollGesture)
        .onStart(() => {
          'worklet';
          if (!openSettledSv.value) return;
          scheduleOnRN(triggerGlassPressHaptic);
        })
        .onUpdate((event: { translationY: number }) => {
          'worklet';
          if (!openSettledSv.value) return;
          followDown(event.translationY);
        })
        .onEnd((event: { translationY: number; velocityY: number }) => {
          'worklet';
          if (!openSettledSv.value) return;
          releaseDown(event.translationY, event.velocityY);
        });

      return (withLongPress ? Gesture.Exclusive(longPressDrag, pullDown) : pullDown) as unknown as GestureType;
    },
    // `followDown` / `releaseDown` / `close` 有意每帧闭包 · 与展开前实现一致。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, openSettledSv, scrollAtTopSv],
  );

  const allowPageShotDismiss = stack.length === 0;
  /** 非 Scroll 区（Hero / 栏空白）· 与内容区同套长按，不并联 scrollNative。 */
  const longPressDismissShell = useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(enabled && allowPageShotDismiss)
      .activateAfterLongPress(LONG_PRESS_DRAG_MS)
      .failOffsetX([-24, 24])
      .onStart(() => {
        'worklet';
        if (!openSettledSv.value) return;
        scheduleOnRN(triggerGlassPressHaptic);
      })
      .onUpdate((event: { translationY: number }) => {
        'worklet';
        if (!openSettledSv.value) return;
        followDown(event.translationY);
      })
      .onEnd((event: { translationY: number; velocityY: number }) => {
        'worklet';
        if (!openSettledSv.value) return;
        releaseDown(event.translationY, event.velocityY);
      });
    return pan;
  }, [allowPageShotDismiss, enabled, openSettledSv]);
  const dismissDownShell = useMemo(
    () => buildDismissDown(scrollNative, allowPageShotDismiss, false),
    [allowPageShotDismiss, buildDismissDown, scrollNative],
  );
  const dismissDownScroll = useMemo(
    () => buildDismissDown(scrollNative, allowPageShotDismiss, true),
    [allowPageShotDismiss, buildDismissDown, scrollNative],
  );

  const rootEdgeSwipe = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled && stack.length === 0)
        .hitSlop({ left: 0, width: EDGE_SWIPE_WIDTH })
        .activeOffsetX(10)
        .failOffsetY([-12, 12])
        .onUpdate((event) => {
          'worklet';
          if (!openSettledSv.value) return;
          drag.value = Math.min(1, Math.max(0, event.translationX / (pageWidth * 0.5)));
        })
        .onEnd((event) => {
          'worklet';
          if (!openSettledSv.value) return;
          if (event.translationX + event.velocityX * 0.2 > pageWidth * 0.25) {
            scheduleOnRN(close, -event.velocityX / pageWidth);
          } else {
            drag.value = withSpring(0, pageShotOpenSpringConfig);
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, openSettledSv, pageWidth, stack.length],
  );

  /** 壳层手势常挂 · 展开阶段在 worklet 内读 `openSettledSv`，避免 React `openSettled` 未提交时误用 `Gesture.Native()`。 */
  const shotShellGestures = useMemo(
    () =>
      allowPageShotDismiss && enabled
        ? Gesture.Simultaneous(longPressDismissShell, dismissDownShell, rootEdgeSwipe)
        : Gesture.Native(),
    [allowPageShotDismiss, dismissDownShell, enabled, longPressDismissShell, rootEdgeSwipe],
  );

  const rect = landRect ?? shown?.rect ?? { x: 0, y: 0, width: pageWidth, height: pageHeight };
  const radius = shown?.radius ?? 0;
  useEffect(() => {
    sourceRectSv.value = rect;
    sourceRadiusSv.value = radius;
  }, [rect, radius, sourceRadiusSv, sourceRectSv]);
  const hasMorph = shown?.morph != null;
  const shotFrame = useDerivedValue(() =>
    pageShotFrame(
      progress.value,
      drag.value,
      sourceRectSv.value,
      pageWidthSv.value,
      pageHeightSv.value,
      sourceRadiusSv.value,
    ),
  );
  const shotFrameAtProgress = useDerivedValue(() =>
    pageShotFrame(
      progress.value,
      0,
      sourceRectSv.value,
      pageWidthSv.value,
      pageHeightSv.value,
      sourceRadiusSv.value,
    ),
  );
  const pageColor = colors.page as string;
  const shellBackground =
    typeof background === 'function'
      ? shown
        ? background(shown)
        : 'transparent'
      : (background ?? pageColor);

  const frameStyle = useAnimatedStyle(() => {
    const frame = shotFrame.value;
    return {
      left: frame.left,
      top: frame.top,
      width: frame.width,
      height: frame.height,
      borderRadius: frame.borderRadius,
      opacity: fade.value,
      transform: [{ scale: frame.scale }],
    };
  });
  const contentStyle = useAnimatedStyle(() => {
    const scale = shotFrameAtProgress.value.contentScale;
    const pw = pageWidthSv.value;
    const ph = pageHeightSv.value;
    return {
      transform: [
        { translateX: (-pw * (1 - scale)) / 2 },
        { translateY: (-ph * (1 - scale)) / 2 },
        { scale },
      ],
    };
  });
  const bodyStyle = useAnimatedStyle(() => ({
    opacity: shotFrameAtProgress.value.bodyOpacity,
  }));
  /** 触发元素外观按触发元素原尺寸排版、居中于外壳，只做 transform · 飞行中不随外壳宽高逐帧重排。 */
  const morphStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, Math.max(0, progress.value / MORPH_PROGRESS)),
    transform: [{ scale: shotFrameAtProgress.value.land }],
  }));
  /** 有 morph 时外壳底色 + 页面内容与触发元素外观交叉淡化：进度 0 时外壳即触发元素本身。 */
  const pageLayerStyle = useAnimatedStyle(() => ({
    opacity: hasMorph ? Math.min(1, Math.max(0, progress.value / MORPH_PROGRESS)) : 1,
  }));
  const dimStyle = useAnimatedStyle(() => ({
    opacity: shotFrameAtProgress.value.dim * fade.value,
  }));

  const dimColor = colors['material-same-black'] as string;

  const closeAction: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-close',
    accessibilityLabel: '关闭',
    onPress: () => close(),
    size: 'md',
  };
  const backAction: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: back,
    size: 'md',
  };
  const titleOf = (pageKey: string | null) => (shown && title ? title(shown, pageKey) : undefined);
  const rootTitle = titleOf(null)?.trim();
  /** iOS 26+ 根页一律浮层 NavBar（无标题：玻璃关闭钮；有标题：EgNavBar + 关闭）。系统栈仅在有 push 后接管子页。 */
  const rootUsesOverlayBar = native;
  const resolvedTopInset =
    rootUsesOverlayBar || !native ? egNavBarScrollContentReserve(insets.top) : topInset;
  const insetApi = {
    topInset: resolvedTopInset,
    scrollTopInset: 0,
    contentInsetAdjustmentBehavior: 'never' as const,
  };
  const pullBridge = useMemo(
    () => ({
      pageShotProgressSv: progress,
      scrollOffsetYSv,
      closeScrollStartYSv,
      closeProgressStartSv,
      closeScrollArmedSv,
      scrollAtTopSv,
      openSettledSv,
      scrollNative,
      scrollDismissDown: dismissDownScroll as unknown as GestureType,
      onFlingDismissAtTop,
      closingSv,
      chromeSession,
    }),
    [
      chromeSession,
      dismissDownScroll,
      onFlingDismissAtTop,
      closeProgressStartSv,
      closeScrollArmedSv,
      closeScrollStartYSv,
      progress,
      scrollAtTopSv,
      scrollNative,
      scrollOffsetYSv,
      closingSv,
      openSettledSv,
    ],
  );
  const rootApi = (current: EgEdsAnimaPageShotSource): EgEdsAnimaPageShotRootApi => ({
    source: current,
    push,
    close: () => close(),
    bodyStyle,
    ...insetApi,
  });
  const pageApi = (current: EgEdsAnimaPageShotSource, pageKey: string, index: number): EgEdsAnimaPageShotPageApi => ({
    source: current,
    pageKey,
    depth: index,
    canPush: stack.length < PAGE_STACK_MAX_DEPTH,
    push,
    back,
    close: () => close(),
    ...insetApi,
  });
  const rnBar = (pageKey: string | null) => (
    <EgNavBar
      key={`page-shot-eg-nav-bar-${chromeSession}-${pageKey ?? 'root'}`}
      title={titleOf(pageKey)}
      showLeft={pageKey !== null}
      left={backAction}
      showRight={pageKey === null}
      right={pageKey === null ? closeAction : undefined}
      background={pageKey === null ? 'hidden' : 'auto'}
      scrollEdgeEffect={pageKey === null ? (scrollEdgeEffect ?? 'hidden') : 'automatic'}
      topInset={insets.top}
      manageStatusBar={false}
      mode={mode}
      chromeContext="overlay"
    />
  );

  const useNativeGlassRootOverlay =
    native && !rootTitle && shouldUseEgGlassCapsuleNativeStack();
  const showNativeStack = native && openSettled && nativeStackEngaged;
  /** 浮于 `contentStyle` 变换之外 · 原生 GlassView 不可挂在 scale/opacity 动画子树内。 */
  const floatingRootBarChrome =
    shown && !closing && stack.length === 0 && (rootUsesOverlayBar || !native) ? (
      useNativeGlassRootOverlay ? (
        <Animated.View
          key={`page-shot-native-glass-bar-${chromeSession}`}
          pointerEvents="box-none"
          style={[
            styles.bar,
            bodyStyle,
            {
              paddingTop: insets.top + EG_NAV_BAR_PADDING_TOP,
              paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
              paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
            },
          ]}
        >
          <View style={styles.barActionsRow}>
            <GlassContainer morph={false}>
              <EgNavBarActionView
                key={`page-shot-close-glass-${chromeSession}`}
                action={closeAction}
                mode={mode}
              />
            </GlassContainer>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          key={`page-shot-root-bar-${chromeSession}`}
          pointerEvents="box-none"
          style={[styles.bar, bodyStyle]}
        >
          {rnBar(null)}
        </Animated.View>
      )
    ) : null;

  return (
    <EgEdsAnimaOverlayModal
      visible={shown !== null}
      presentationKey={chromeSession}
      onRequestClose={() => (stack.length > 0 ? back() : close())}
      onShow={() => onCoveringChange(true)}
    >
      <GestureHandlerRootView style={styles.fill}>
        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          onLayout={measureHost}
        />
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: dimColor }, dimStyle]}
        />
        <EgPageShotPullBridgeProvider value={pullBridge}>
          <GestureDetector gesture={shotShellGestures}>
            <Animated.View style={[styles.shot, frameStyle]}>
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: shellBackground }, pageLayerStyle]}
            />
            <Animated.View style={[{ width: pageWidth, height: pageHeight }, contentStyle, pageLayerStyle]}>
              {showNativeStack ? (
                <PageShotNativeStack
                  key={`page-shot-native-stack-${chromeSession}`}
                  mode={mode}
                  pageKeys={shown ? stack : []}
                  rootBackground={shellBackground}
                  pageBackground={pageColor}
                  titleOf={titleOf}
                  backAction={backAction}
                  closeAction={closeAction}
                  onDismissed={(count) => setNativeStack((prev) => prev.slice(0, Math.max(0, prev.length - count)))}
                  onBarHeight={(height) => setNativeBarHeight((prev) => Math.max(prev, height))}
                  rootSettled={openSettled}
                  closing={closing}
                  chromeSession={chromeSession}
                  floatingRoot={rootUsesOverlayBar}
                  scrollEdgeEffect={scrollEdgeEffect}
                  hostOf={hostOf}
                  renderRoot={() => (shown ? renderRoot(rootApi(shown)) : null)}
                  renderPage={(pageKey, index) =>
                    shown && renderPage ? renderPage(pageApi(shown, pageKey, index)) : null
                  }
                />
              ) : (
                <>
                  <View style={styles.fill}>
                    <EgNavBarScrollEdgeContext.Provider value={hostOf(-1, openSettled)}>
                      {shown ? renderRoot(rootApi(shown)) : null}
                    </EgNavBarScrollEdgeContext.Provider>
                  </View>
                  {shown && renderPage
                    ? pages.stack.map((pageKey, index) => (
                        <PageStackLayer
                          key={index}
                          enter={pages.enters[index]!}
                          cover={pages.coverOf(index)}
                          coverLeaving={pages.coverLeavingOf(index)}
                          leaving={pages.leaves[index]!}
                          width={pageWidth}
                          isTop={index === pages.stack.length - 1}
                          edgeSwipe
                          reduceMotion={reduceMotion}
                          background={pageColor}
                          dimColor={dimColor}
                          onSwipeEnd={pages.finishSwipe}
                        >
                          <EgNavBarScrollEdgeContext.Provider value={hostOf(index)}>
                            {renderPage(pageApi(shown, pageKey, index))}
                          </EgNavBarScrollEdgeContext.Provider>
                          {!closing ? (
                            <View
                              key={`page-shot-stack-bar-${chromeSession}-${pageKey}`}
                              pointerEvents="box-none"
                              style={styles.bar}
                            >
                              {rnBar(pageKey)}
                            </View>
                          ) : null}
                        </PageStackLayer>
                      ))
                    : null}
                </>
              )}
            </Animated.View>
            {floatingRootBarChrome}
            {shown?.morph && !handedOff ? (
              <View pointerEvents="none" style={styles.morph}>
                <Animated.View style={[{ width: rect.width, height: rect.height }, morphStyle]}>
                  {shown.morph}
                </Animated.View>
              </View>
            ) : null}
            </Animated.View>
          </GestureDetector>
        </EgPageShotPullBridgeProvider>
      </GestureHandlerRootView>
    </EgEdsAnimaOverlayModal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  shot: {
    position: 'absolute',
    overflow: 'hidden',
    borderCurve: 'continuous',
    ...(Platform.OS === 'android' ? { renderToHardwareTextureAndroid: true, collapsable: false } : null),
  },
  morph: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  barActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
});

/**
 * iOS 26+ · 弹层内页面栈交给系统 `UINavigationController`：系统 `UINavigationBar`（Liquid Glass · scroll edge）、
 * 系统 push / pop 与侧滑返回；栏项为 EDS 玻璃钮（同 `egNavBarNativeStackScreenOptions`）。
 */
function PageShotNativeStack({
  mode,
  pageKeys,
  rootBackground,
  pageBackground,
  titleOf,
  backAction,
  closeAction,
  onDismissed,
  onBarHeight,
  rootSettled,
  closing,
  chromeSession,
  floatingRoot,
  scrollEdgeEffect,
  hostOf: layerHostOf,
  renderRoot,
  renderPage,
}: {
  mode: ThemeMode;
  pageKeys: string[];
  rootBackground: string;
  pageBackground: string;
  titleOf: (pageKey: string | null) => string | undefined;
  backAction: EgNavBarAction;
  closeAction: EgNavBarAction;
  onDismissed: (count: number) => void;
  onBarHeight: (height: number) => void;
  /** 根页展开已落位（飞行中滚动区为临时留白，scroll edge 暂不跟随）。 */
  rootSettled: boolean;
  /** 收回中 · 系统栏关闭钮不绘制。 */
  closing: boolean;
  /** 与 `PageShotLayer` `chromeSession` 同步 · 系统栏钮 key。 */
  chromeSession: number;
  /** 卡片等无系统标题根页 · 内容顶满、仅 RN 浮栏，不走根 `ScreenStackItem`（避免 iOS 26+ 栏把内容顶下去）。 */
  floatingRoot: boolean;
  scrollEdgeEffect: EgNavBarScrollEdgeEffect | undefined;
  /** 层级宿主（上报滚动区是否在顶部）· 本栈补上 scroll edge 切换。 */
  hostOf: (index: number, settled?: boolean) => EgNavBarScrollEdgeHost;
  renderRoot: () => ReactNode;
  renderPage: (pageKey: string, index: number) => ReactNode;
}) {
  const header = (pageKey: string | null) => {
    const title = titleOf(pageKey);
    if (!title?.trim()) {
      return {
        hidden: true,
        title: ' ',
        titleColor: 'transparent',
        backgroundColor: 'transparent',
        translucent: true,
        hideShadow: true,
        hideBackButton: true,
        disableBackButtonMenu: true,
        disableTopInsetApplication: true,
        experimental_userInterfaceStyle: mode === 'dark' ? ('dark' as const) : ('light' as const),
      };
    }
    const isStackPage = pageKey !== null;
    const options = egNavBarNativeStackOptions({
      title,
      mode,
      showTitle: true,
      showLeft: isStackPage,
      left: isStackPage ? backAction : undefined,
      showRight: false,
      background: isStackPage ? 'auto' : 'hidden',
      scrollEdgeEffect: isStackPage ? 'automatic' : scrollEdgeEffect ?? 'hidden',
      deferScrollEdgeToScrollHandler: isStackPage,
    });
    return {
      title: options.title,
      titleColor: options.headerTitleStyle.color,
      titleFontFamily: options.headerTitleStyle.fontFamily,
      titleFontSize: options.headerTitleStyle.fontSize,
      titleFontWeight: '600',
      backgroundColor: 'transparent',
      translucent: true,
      hideShadow: true,
      hideBackButton: true,
      disableBackButtonMenu: true,
      experimental_userInterfaceStyle: mode === 'dark' ? ('dark' as const) : ('light' as const),
      children: (
        <>
          {pageKey !== null ? (
            <ScreenStackHeaderLeftView hidesSharedBackground>
              <EgNavBarActionView action={backAction} mode={mode} />
            </ScreenStackHeaderLeftView>
          ) : null}
          {pageKey === null && !closing ? (
            <ScreenStackHeaderRightView key={`page-shot-native-close-${chromeSession}`} hidesSharedBackground>
              {shouldUseEgGlassCapsuleNativeStack() ? (
                <GlassContainer morph={false}>
                  <EgNavBarActionView action={closeAction} mode={mode} />
                </GlassContainer>
              ) : (
                <EgNavBarActionView action={closeAction} mode={mode} />
              )}
            </ScreenStackHeaderRightView>
          ) : null}
        </>
      ),
    };
  };
  const barScrollEdge = scrollEdgeEffect ?? 'hidden';
  const edgesOf = (pageKey: string | null) =>
    pageKey !== null
      ? egNavBarNativeScrollEdgeEffects('hidden')
      : ({ top: barScrollEdge, bottom: 'hidden', left: 'hidden', right: 'hidden' } as const);
  const hostOf = (index: number, settled: boolean): EgNavBarScrollEdgeHost => ({
    ...layerHostOf(index, settled),
    setEdge: () => {},
  });

  const useFloatingRoot = floatingRoot || !titleOf(null)?.trim();
  const pushedScreens = (
    <>
      {pageKeys.map((pageKey, index) => (
        <ScreenStackItem
          key={`${chromeSession}-${pageKey}-${index}`}
          screenId={`eg-page-shot-${chromeSession}-${index}`}
          activityState={index === pageKeys.length - 1 ? 2 : 0}
          style={StyleSheet.absoluteFill}
          contentStyle={{ backgroundColor: pageBackground }}
          gestureEnabled
          scrollEdgeEffects={edgesOf(pageKey)}
          onDismissed={(event) => onDismissed(event.nativeEvent.dismissCount)}
          headerConfig={header(pageKey)}
        >
          <EgNavBarScrollEdgeContext.Provider value={hostOf(index, true)}>
            {renderPage(pageKey, index)}
          </EgNavBarScrollEdgeContext.Provider>
        </ScreenStackItem>
      ))}
    </>
  );

  if (useFloatingRoot) {
    return (
      <View style={styles.fill}>
        <View style={[styles.fill, { backgroundColor: rootBackground }]}>
          <EgNavBarScrollEdgeContext.Provider value={hostOf(-1, rootSettled)}>
            {renderRoot()}
          </EgNavBarScrollEdgeContext.Provider>
        </View>
        {pageKeys.length > 0 ? (
          <ScreenStack style={StyleSheet.absoluteFill} nativeContainerStyle={styles.transparent}>
            {pushedScreens}
          </ScreenStack>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <ScreenStack style={styles.fill} nativeContainerStyle={styles.transparent}>
        <ScreenStackItem
          key={`eg-page-shot-root-${chromeSession}`}
          screenId={`eg-page-shot-root-${chromeSession}`}
          activityState={2}
          style={StyleSheet.absoluteFill}
          contentStyle={{ backgroundColor: rootBackground }}
          gestureEnabled={false}
          scrollEdgeEffects={edgesOf(null)}
          onHeaderHeightChange={(event) => {
            const height = Math.round(event.nativeEvent.headerHeight);
            if (height > 0) onBarHeight(height);
          }}
          headerConfig={header(null)}
        >
          <EgNavBarScrollEdgeContext.Provider value={hostOf(-1, rootSettled)}>{renderRoot()}</EgNavBarScrollEdgeContext.Provider>
        </ScreenStackItem>
        {pushedScreens}
      </ScreenStack>
    </View>
  );
}
