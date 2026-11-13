import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenStack,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackItem,
} from 'react-native-screens';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../atoms/glass/glassPressHaptic.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../theme/index.js';
import { EgNavBar, shouldUseEgNavBarNativeStack } from '../../organisms/tab-bar/nav-bar/EgNavBar.js';
import type { EgNavBarAction, EgNavBarScrollEdgeEffect } from '../../organisms/tab-bar/nav-bar/EgNavBar.types.js';
import { EgNavBarScrollEdgeContext, type EgNavBarScrollEdgeHost } from '../../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import { EgNavBarActionView } from '../../organisms/tab-bar/nav-bar/EgNavBarActionView.js';
import { egNavBarScrollContentReserve } from '../../organisms/tab-bar/nav-bar/egNavBarMetrics.js';
import { egNavBarNativeStackOptions } from '../../organisms/tab-bar/nav-bar/egNavBarNativeStackOptions.js';
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
  /** iOS 26+ 系统栏 scroll edge 固定值（如 `'automatic'` 交系统决定）。缺省同 EgNavBar：静止 `hidden` · 滚入栏下 `soft`（`useEgNavBarScroll`）。 */
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
  const fallbackSize = Dimensions.get(Platform.OS === 'android' ? 'screen' : 'window');
  const pageWidth = hostSize?.width ?? fallbackSize.width;
  const pageHeight = hostSize?.height ?? fallbackSize.height;
  const progress = useSharedValue(0);
  const drag = useSharedValue(0);
  const fade = useSharedValue(1);
  const pages = usePageStack(reduceMotion);
  /** iOS 26+ 系统栈页（push / pop 动画由 UINavigationController 承担）。 */
  const [nativeStack, setNativeStack] = useState<string[]>([]);
  const stack = native ? nativeStack : pages.stack;
  const [nativeBarHeight, setNativeBarHeight] = useState(0);
  const measureHost = (event: LayoutChangeEvent) => {
    if (native) return;
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setHostSize((prev) => (prev?.width === width && prev?.height === height ? prev : { width, height }));
    }
  };
  /** iOS 26+ 展开飞行中：系统栏高随外壳窗口位置变（安全区按窗口算），滚动区改固定留白，内容随外壳刚性缩放、不随栏高跳动。 */
  const [flight, setFlight] = useState(false);
  /** 各页滚动区是否停在顶部（键 -1 = 根页）· 未上报视为顶部。 */
  const [atTopByPage, setAtTopByPage] = useState<Record<number, boolean>>({});
  const setAtTop = (index: number, atTop: boolean) =>
    setAtTopByPage((prev) => (prev[index] === atTop ? prev : { ...prev, [index]: atTop }));
  const topInset = native && nativeBarHeight > 0 ? nativeBarHeight : egNavBarScrollContentReserve(insets.top);
  /** 呈现中的触发元素 — 收回完成后仍保留到 Modal 隐藏，避免末帧几何 / 内容回退。 */
  const [shown, setShown] = useState<EgEdsAnimaPageShotSource | null>(source);
  /** 收回落位已交还触发元素：`morph` 外观与原位触发元素同一次提交切换，不叠帧（半透明触发元素叠两层会闪）。 */
  const [handedOff, setHandedOff] = useState(false);
  /** 收起前重量的触发元素 frame（覆盖 `shown.rect`）。 */
  const [landRect, setLandRect] = useState<PageShotRect | null>(null);
  if (source && source !== shown) {
    setShown(source);
    setHandedOff(false);
    setLandRect(null);
  }

  useEffect(() => {
    if (!source) return;
    drag.value = 0;
    if (reduceMotion) {
      progress.value = 1;
      fade.value = 0;
      fade.value = withTiming(1, { duration: REDUCED_FADE_MS });
      return;
    }
    fade.value = 1;
    progress.value = 0;
    setFlight(false);
    progress.value = withSpring(1, pageShotOpenSpringConfig, (finished) => {
      'worklet';
      if (finished) scheduleOnRN(setFlight, false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

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
        setShown(null);
        onClosed();
      }),
    );
  };

  const close = (velocity = 0) => {
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
  const scrollAtTop = atTopByPage[depth - 1] ?? true;
  const hostOf = (index: number, settled = true): EgNavBarScrollEdgeHost => ({
    setEdge: () => {},
    setAtTop: (atTop) => setAtTop(index, atTop),
    settled,
  });

  const enabled = shown !== null && !reduceMotion;
  const dragRange = pageHeight * 0.35;
  const dismissDistance = pageHeight * 0.15;

  const followDown = (translationY: number) => {
    'worklet';
    drag.value = Math.min(1, Math.max(0, translationY / dragRange));
  };
  const releaseDown = (translationY: number, velocityY: number) => {
    'worklet';
    if (translationY + velocityY * 0.2 > dismissDistance) {
      scheduleOnRN(close, -velocityY / pageHeight);
    } else {
      drag.value = withSpring(0, pageShotOpenSpringConfig);
    }
  };

  const pullDown = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetY(10)
    .failOffsetX([-16, 16])
    .onUpdate((event) => followDown(event.translationY))
    .onEnd((event) => releaseDown(event.translationY, event.velocityY));

  /** 滚动区停在顶部时长按接管：激活即排掉尚未开始的 ScrollView 拖动，下拉跟手关闭。 */
  const longPressDrag = Gesture.Pan()
    .enabled(enabled && scrollAtTop)
    .activateAfterLongPress(LONG_PRESS_DRAG_MS)
    .onStart(() => scheduleOnRN(triggerGlassPressHaptic))
    .onUpdate((event) => followDown(event.translationY))
    .onEnd((event) => releaseDown(event.translationY, event.velocityY));

  const rootEdgeSwipe = Gesture.Pan()
    .enabled(enabled && stack.length === 0)
    .hitSlop({ left: 0, width: EDGE_SWIPE_WIDTH })
    .activeOffsetX(10)
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      drag.value = Math.min(1, Math.max(0, event.translationX / (pageWidth * 0.5)));
    })
    .onEnd((event) => {
      if (event.translationX + event.velocityX * 0.2 > pageWidth * 0.25) {
        scheduleOnRN(close, -event.velocityX / pageWidth);
      } else {
        drag.value = withSpring(0, pageShotOpenSpringConfig);
      }
    });

  const rect = landRect ?? shown?.rect ?? { x: 0, y: 0, width: pageWidth, height: pageHeight };
  const radius = shown?.radius ?? 0;
  const hasMorph = shown?.morph != null;
  const pageColor = colors.page as string;
  const shellBackground =
    typeof background === 'function'
      ? shown
        ? background(shown)
        : 'transparent'
      : (background ?? pageColor);

  const frameStyle = useAnimatedStyle(() => {
    const frame = pageShotFrame(progress.value, drag.value, rect, pageWidth, pageHeight, radius);
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
    const scale = pageShotFrame(progress.value, 0, rect, pageWidth, pageHeight, radius).contentScale;
    return {
      transform: [
        { translateX: (-pageWidth * (1 - scale)) / 2 },
        { translateY: (-pageHeight * (1 - scale)) / 2 },
        { scale },
      ],
    };
  });
  const bodyStyle = useAnimatedStyle(() => ({
    opacity: pageShotFrame(progress.value, 0, rect, pageWidth, pageHeight, radius).bodyOpacity,
  }));
  /** 触发元素外观按触发元素原尺寸排版、居中于外壳，只做 transform · 飞行中不随外壳宽高逐帧重排。 */
  const morphStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, Math.max(0, progress.value / MORPH_PROGRESS)),
    transform: [{ scale: pageShotFrame(progress.value, 0, rect, pageWidth, pageHeight, radius).land }],
  }));
  /** 有 morph 时外壳底色 + 页面内容与触发元素外观交叉淡化：进度 0 时外壳即触发元素本身。 */
  const pageLayerStyle = useAnimatedStyle(() => ({
    opacity: hasMorph ? Math.min(1, Math.max(0, progress.value / MORPH_PROGRESS)) : 1,
  }));
  const dimStyle = useAnimatedStyle(() => ({
    opacity: pageShotFrame(progress.value, 0, rect, pageWidth, pageHeight, radius).dim * fade.value,
  }));

  const dimColor = colors['material-same-black'] as string;

  const closeAction: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-close',
    accessibilityLabel: '关闭',
    onPress: () => close(),
  };
  const backAction: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: back,
  };
  const insetApi = {
    topInset,
    scrollTopInset: native && !flight ? 0 : topInset,
    contentInsetAdjustmentBehavior: native && !flight ? ('automatic' as const) : ('never' as const),
  };
  const titleOf = (pageKey: string | null) => (shown && title ? title(shown, pageKey) : undefined);
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
      title={titleOf(pageKey)}
      showLeft={pageKey !== null}
      left={backAction}
      right={closeAction}
      background="visible"
      topInset={insets.top}
      manageStatusBar={false}
      mode={mode}
      forceRnImplementation
    />
  );

  return (
    <EgEdsAnimaOverlayModal
      visible={shown !== null}
      onRequestClose={() => (stack.length > 0 ? back() : close())}
      onShow={() => {
        // 挂载时须为 `automatic`（原生 tabs 内 RNS 挂载即把 `never` 改回 `automatic`），呈现后再切飞行留白。
        if (native && !reduceMotion) setFlight(true);
        onCoveringChange(true);
      }}
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
        <GestureDetector gesture={Gesture.Race(longPressDrag, pullDown, rootEdgeSwipe)}>
          <Animated.View style={[styles.shot, frameStyle]}>
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: shellBackground }, pageLayerStyle]}
            />
            <Animated.View style={[{ width: pageWidth, height: pageHeight }, contentStyle, pageLayerStyle]}>
              {native ? (
                <PageShotNativeStack
                  mode={mode}
                  pageKeys={shown ? stack : []}
                  rootBackground={shellBackground}
                  pageBackground={pageColor}
                  titleOf={titleOf}
                  backAction={backAction}
                  closeAction={closeAction}
                  onDismissed={(count) => setNativeStack((prev) => prev.slice(0, Math.max(0, prev.length - count)))}
                  onBarHeight={(height) => setNativeBarHeight((prev) => Math.max(prev, height))}
                  rootSettled={!flight}
                  scrollEdgeEffect={scrollEdgeEffect}
                  hostOf={hostOf}
                  renderRoot={() => (shown ? renderRoot(rootApi(shown)) : null)}
                  renderPage={(pageKey, index) => (shown && renderPage ? renderPage(pageApi(shown, pageKey, index)) : null)}
                />
              ) : (
                <>
                  <PageStackLayer
                    enter="static"
                    cover={pages.coverOf(-1)}
                    coverLeaving={pages.coverLeavingOf(-1)}
                    leaving={null}
                    width={pageWidth}
                    isTop={pages.stack.length === 0}
                    edgeSwipe={false}
                    reduceMotion={reduceMotion}
                    background={shellBackground}
                    dimColor={dimColor}
                    onSwipeEnd={pages.finishSwipe}
                  >
                    <EgNavBarScrollEdgeContext.Provider value={hostOf(-1)}>
                      {shown ? renderRoot(rootApi(shown)) : null}
                    </EgNavBarScrollEdgeContext.Provider>
                    <Animated.View pointerEvents="box-none" style={[styles.bar, bodyStyle]}>
                      {rnBar(null)}
                    </Animated.View>
                  </PageStackLayer>
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
                          <View pointerEvents="box-none" style={styles.bar}>
                            {rnBar(pageKey)}
                          </View>
                        </PageStackLayer>
                      ))
                    : null}
                </>
              )}
            </Animated.View>
            {shown?.morph && !handedOff ? (
              <View pointerEvents="none" style={styles.morph}>
                <Animated.View style={[{ width: rect.width, height: rect.height }, morphStyle]}>
                  {shown.morph}
                </Animated.View>
              </View>
            ) : null}
          </Animated.View>
        </GestureDetector>
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
  scrollEdgeEffect: EgNavBarScrollEdgeEffect | undefined;
  /** 层级宿主（上报滚动区是否在顶部）· 本栈补上 scroll edge 切换。 */
  hostOf: (index: number, settled?: boolean) => EgNavBarScrollEdgeHost;
  renderRoot: () => ReactNode;
  renderPage: (pageKey: string, index: number) => ReactNode;
}) {
  const header = (pageKey: string | null) => {
    const title = titleOf(pageKey);
    const options = egNavBarNativeStackOptions({ title, mode, showTitle: Boolean(title?.trim()) });
    return {
      title: options.title,
      titleColor: options.headerTitleStyle.color,
      titleFontFamily: options.headerTitleStyle.fontFamily,
      titleFontSize: options.headerTitleStyle.fontSize,
      titleFontWeight: options.headerTitleStyle.fontWeight,
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
          <ScreenStackHeaderRightView hidesSharedBackground>
            <EgNavBarActionView action={closeAction} mode={mode} />
          </ScreenStackHeaderRightView>
        </>
      ),
    };
  };
  /** 各页 scroll edge（键 -1 = 根页）· 静止 hidden，页内 `useEgNavBarScroll` 滚入栏下切 soft；`scrollEdgeEffect` 固定时以其为准。 */
  const [edgeByPage, setEdgeByPage] = useState<Record<number, EgNavBarScrollEdgeEffect>>({});
  const edgesOf = (index: number) =>
    ({ top: scrollEdgeEffect ?? edgeByPage[index] ?? 'hidden', bottom: 'hidden', left: 'hidden', right: 'hidden' }) as const;
  const depth = pageKeys.length;
  useEffect(() => {
    setEdgeByPage((prev) => {
      const kept = Object.entries(prev).filter(([key]) => Number(key) < depth);
      return kept.length === Object.keys(prev).length ? prev : Object.fromEntries(kept);
    });
  }, [depth]);
  const hostOf = (index: number, settled: boolean): EgNavBarScrollEdgeHost => ({
    ...layerHostOf(index, settled),
    setEdge: (effect) => setEdgeByPage((prev) => (prev[index] === effect ? prev : { ...prev, [index]: effect })),
  });

  return (
    <ScreenStack style={styles.fill} nativeContainerStyle={styles.transparent}>
      <ScreenStackItem
        screenId="eg-page-shot-root"
        activityState={2}
        style={StyleSheet.absoluteFill}
        contentStyle={{ backgroundColor: rootBackground }}
        gestureEnabled={false}
        scrollEdgeEffects={edgesOf(-1)}
        onHeaderHeightChange={(event) => {
          const height = Math.round(event.nativeEvent.headerHeight);
          if (height > 0) onBarHeight(height);
        }}
        headerConfig={header(null)}
      >
        <EgNavBarScrollEdgeContext.Provider value={hostOf(-1, rootSettled)}>{renderRoot()}</EgNavBarScrollEdgeContext.Provider>
      </ScreenStackItem>
      {pageKeys.map((pageKey, index) => (
        <ScreenStackItem
          key={index}
          screenId={`eg-page-shot-${index}`}
          activityState={2}
          style={StyleSheet.absoluteFill}
          contentStyle={{ backgroundColor: pageBackground }}
          gestureEnabled
          scrollEdgeEffects={edgesOf(index)}
          onDismissed={(event) => onDismissed(event.nativeEvent.dismissCount)}
          headerConfig={header(pageKey)}
        >
          <EgNavBarScrollEdgeContext.Provider value={hostOf(index, true)}>
            {renderPage(pageKey, index)}
          </EgNavBarScrollEdgeContext.Provider>
        </ScreenStackItem>
      ))}
    </ScreenStack>
  );
}
