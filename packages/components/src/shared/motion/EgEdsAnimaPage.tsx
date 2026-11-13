import type { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Animated, Platform } from 'react-native';

import { EgNavBar, shouldUseEgNavBarNativeStack } from '../../organisms/tab-bar/nav-bar/EgNavBar.js';
import type { EgNavBarScrollEdgeEffect } from '../../organisms/tab-bar/nav-bar/EgNavBar.types.js';
import { egNavBarNativeStackScreenOptions } from '../../organisms/tab-bar/nav-bar/egNavBarNativeStackOptions.js';
import { markEgNavBarScrollEdgeFixed } from '../../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import type { ThemeMode } from '../../theme/index.js';
import {
  pageBackSpringConfig,
  pageDimOpacity,
  pageParallaxRatio,
  pagePushSpringConfig,
} from './pageMotion.js';

/** `@react-navigation/stack` `cardStyleInterpolator` 入参（仅用到的字段）。 */
type EdsPageCardInterpolationProps = {
  current: { progress: Animated.AnimatedInterpolation<number> };
  next?: { progress: Animated.AnimatedInterpolation<number> };
  layouts: { screen: { width: number; height: number } };
};

/**
 * 各路由「上层页离场中」开关（1 = 返回 / 侧滑中）：被覆盖页由视差改为整屏同速推回。
 * 由上层页 `beforeRemove` / `gestureStart` 置位、`transitionEnd` 复位 — 两时刻下层页或被盖住、或已归位，切换不可见。
 */
const coverLeavingByRoute = new Map<string, Animated.Value>();
/**
 * 各路由「侧滑后落位中」开关（1 = 手势开始 → 本次转场结束）：上层页位移夹取在 [原位, 离场位]。
 * 侧滑未达阈值松手时 open spring 继承手势速度，不夹取则越过原位（页面右缘左移露底）再弹回。
 */
const gestureSettleByRoute = new Map<string, Animated.Value>();
const pageInterpolatorByRoute = new Map<string, unknown>();
const wiredNavigations = new WeakSet<object>();

function routeValueOf(map: Map<string, Animated.Value>, routeKey: string) {
  let value = map.get(routeKey);
  if (!value) {
    value = new Animated.Value(0);
    map.set(routeKey, value);
  }
  return value;
}

type PageNavigationEvents = {
  addListener: (
    type: 'beforeRemove' | 'gestureStart' | 'transitionEnd',
    callback: (event: { data?: { closing?: boolean } }) => void,
  ) => () => void;
  getState: () => { routes: { key: string }[] };
};

function wirePageEvents(navigation: PageNavigationEvents, routeKey: string, coverUnder: boolean) {
  if (wiredNavigations.has(navigation)) return;
  wiredNavigations.add(navigation);
  const under = () => {
    const routes = navigation.getState().routes;
    const index = routes.findIndex((item) => item.key === routeKey);
    return index > 0 ? routeValueOf(coverLeavingByRoute, routes[index - 1]!.key) : null;
  };
  let leavingUnder: Animated.Value | null = null;
  const markLeaving = () => {
    if (!coverUnder) return;
    leavingUnder = under() ?? leavingUnder;
    leavingUnder?.setValue(1);
  };
  navigation.addListener('beforeRemove', markLeaving);
  navigation.addListener('gestureStart', () => {
    markLeaving();
    routeValueOf(gestureSettleByRoute, routeKey).setValue(1);
  });
  navigation.addListener('transitionEnd', (event) => {
    (leavingUnder ?? under())?.setValue(0);
    leavingUnder = null;
    gestureSettleByRoute.get(routeKey)?.setValue(0);
    if (event.data?.closing) {
      coverLeavingByRoute.delete(routeKey);
      gestureSettleByRoute.delete(routeKey);
      for (const key of pageInterpolatorByRoute.keys()) {
        if (key.startsWith(`${routeKey}:`)) pageInterpolatorByRoute.delete(key);
      }
    }
  });
}

function springSpec(config: Record<string, number>) {
  return {
    animation: 'spring' as const,
    config: {
      stiffness: config.stiffness ?? 224,
      damping: config.damping ?? 24,
      mass: config.mass ?? 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.5,
    },
  };
}

/** 上层页位移（两段 translate 相加）：平时随 spring 过冲回弹；侧滑落位中（`gestureSettle` 1）夹取，不越过原位。 */
function focusedTranslates(
  current: EdsPageCardInterpolationProps['current'],
  from: number,
  gestureSettle: Animated.Value,
) {
  const range = { inputRange: [0, 1], outputRange: [from, 0] };
  return [
    Animated.multiply(
      current.progress.interpolate({ ...range, extrapolate: 'extend' }),
      gestureSettle.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    ),
    Animated.multiply(current.progress.interpolate({ ...range, extrapolate: 'clamp' }), gestureSettle),
  ] as const;
}

/**
 * motion-page · 页面左右切换：新页自右（`sign` 1）/ 自左（`sign` -1）推入，下层页反向视差 × `ratio-page-parallax` 并压暗 `opacity-page-dim`；
 * 返回时下层页整屏同速推回（`coverLeaving`）。推入 / 返回 spring 过冲即轻回弹；侧滑未达阈值弹回原位时上层页不越位。
 */
function pageHorizontalInterpolator(
  { current, next, layouts: { screen } }: EdsPageCardInterpolationProps,
  sign: 1 | -1,
  coverLeaving: Animated.Value,
  gestureSettle: Animated.Value,
) {
  const [translateFree, translateSettle] = focusedTranslates(current, sign * screen.width, gestureSettle);
  const translateUnfocused = next
    ? Animated.multiply(
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -sign * screen.width],
          extrapolate: 'extend',
        }),
        coverLeaving.interpolate({ inputRange: [0, 1], outputRange: [pageParallaxRatio, 1] }),
      )
    : (0 as const);
  return {
    cardStyle: {
      transform: [
        { translateX: translateFree },
        { translateX: translateSettle },
        { translateX: translateUnfocused },
      ],
    },
    overlayStyle: { opacity: pageOverlayOpacity(current) },
  };
}

/** motion-page · 上下方向：新页自底推入，下层页原位压暗；同一 spring 与回弹（下拉未达阈值弹回时不越位）。 */
function pageVerticalInterpolator(
  { current, layouts: { screen } }: EdsPageCardInterpolationProps,
  gestureSettle: Animated.Value,
) {
  const [translateFree, translateSettle] = focusedTranslates(current, screen.height, gestureSettle);
  return {
    cardStyle: { transform: [{ translateY: translateFree }, { translateY: translateSettle }] },
    overlayStyle: { opacity: pageOverlayOpacity(current) },
  };
}

type PageInterpolator = (
  props: EdsPageCardInterpolationProps,
) => ReturnType<typeof pageHorizontalInterpolator> | ReturnType<typeof pageVerticalInterpolator>;

function pageInterpolatorOf(routeKey: string, axis: 'horizontal' | 'horizontal-reverse' | 'vertical') {
  const cacheKey = `${routeKey}:${axis}`;
  let interpolator = pageInterpolatorByRoute.get(cacheKey) as PageInterpolator | undefined;
  if (!interpolator) {
    const gestureSettle = routeValueOf(gestureSettleByRoute, routeKey);
    if (axis === 'vertical') {
      interpolator = (props) => pageVerticalInterpolator(props, gestureSettle);
    } else {
      const coverLeaving = routeValueOf(coverLeavingByRoute, routeKey);
      const sign = axis === 'horizontal-reverse' ? -1 : 1;
      interpolator = (props) => pageHorizontalInterpolator(props, sign, coverLeaving, gestureSettle);
    }
    pageInterpolatorByRoute.set(cacheKey, interpolator);
  }
  return interpolator;
}

function pageOverlayOpacity(current: EdsPageCardInterpolationProps['current']) {
  return current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, pageDimOpacity * 0.5],
    extrapolate: 'clamp',
  });
}

const pageTransitionSpec = {
  open: springSpec(pagePushSpringConfig),
  close: springSpec(pageBackSpringConfig),
};

export type EgEdsAnimaPageDirection = 'horizontal' | 'horizontal-reverse' | 'vertical';

export type EgEdsAnimaPageOptions = {
  /** 左右（自右推入）/ 右左（自左推入）/ 上下（自底推入）。默认 `horizontal`。 */
  direction?: EgEdsAnimaPageDirection;
  /**
   * 自屏幕边缘拖拽关闭（左右 = 左缘右滑 · 右左 = 右缘左滑 · 上下 = 下拉）。默认 true。
   * 不做整页任意位置拖拽：页内横向手势（如 `EgTabBlock` 正文左右滑切）须独占页面中部。
   * Android 恒关闭：整页 Pan 与原生 ScrollView 争抢触摸，拇指弧线滚动时卡片被横向拖动（页面晃动）；返回交给系统返回手势 / 返回键。
   */
  dragDismiss?: boolean;
  mode?: ThemeMode;
  /** iOS 26+ 系统栏 scroll edge 固定值（如 `'automatic'` 交系统决定）。缺省同 EgNavBar：静止 `hidden` · 滚入栏下 `soft`（`useEgNavBarScroll`）。 */
  scrollEdgeEffect?: EgNavBarScrollEdgeEffect;
};

type PageNavigation = { goBack: () => void };

type RnStackHeaderProps = {
  options: { title?: string };
  back?: unknown;
  navigation: PageNavigation;
};

/** iOS 26+ → 原生栈（系统 UINavigationBar + 系统转场）；Android · iOS ≤25 → RN 栈（EDS page 弹簧 + EgNavBar）。 */
export function shouldUseEgEdsAnimaNativePage(): boolean {
  return shouldUseEgNavBarNativeStack();
}

/**
 * motion-page 页面栈 · 与 `EgEdsAnimaPage` 配套：
 * iOS 26+ `createNativeStackNavigator`，其余 `createStackNavigator`。各页只传 `options={{ title }}`。
 */
export function createEgEdsAnimaPageNavigator<ParamList extends ParamListBase>() {
  return (
    shouldUseEgEdsAnimaNativePage()
      ? createNativeStackNavigator<ParamList>()
      : createStackNavigator<ParamList>()
  ) as unknown as ReturnType<typeof createNativeStackNavigator<ParamList>>;
}

/**
 * motion-page · `createEgEdsAnimaPageNavigator` 的 `screenOptions`：
 * - iOS 26+：系统 `UINavigationBar`（`egNavBarNativeStackScreenOptions`）+ 系统 push / pop、左缘侧滑返回。
 * - Android · iOS ≤25：推入 `EdsSemanticAnima('page')`（下层页视差）· 返回 / 拖拽关闭 `EdsRecipeAnima('page-back')`（下层页整屏同速推回）；顶栏 `EgNavBar` 随页推入。
 * 压暗层为纯黑 × `opacity-page-dim` × 0.5；导航主题 `colors.background` 宜设页面底色，过冲时边缘不露异色。
 * 页面底色走 `options.contentStyle`（原生栈）/ `cardStyle`（RN 栈），滚动区须为页面首个视图（见 `useEgNavBarScroll`）。
 */
export function EgEdsAnimaPage({
  direction = 'horizontal',
  dragDismiss = true,
  mode = 'light',
  scrollEdgeEffect,
}: EgEdsAnimaPageOptions = {}) {
  const vertical = direction === 'vertical';
  const reverse = direction === 'horizontal-reverse';
  if (shouldUseEgEdsAnimaNativePage()) {
    return ({ navigation }: { navigation: PageNavigation }) => {
      markEgNavBarScrollEdgeFixed(navigation, scrollEdgeEffect != null);
      return {
        ...egNavBarNativeStackScreenOptions({ onBack: () => navigation.goBack(), mode, scrollEdgeEffect }),
        animation: vertical ? 'slide_from_bottom' : reverse ? 'slide_from_left' : 'default',
        gestureEnabled: dragDismiss,
        fullScreenGestureEnabled: false,
        gestureDirection: vertical ? 'vertical' : 'horizontal',
      } as NativeStackNavigationOptions;
    };
  }
  return ({ navigation, route }: { navigation: PageNavigation; route: { key: string } }) => {
    wirePageEvents(navigation as unknown as PageNavigationEvents, route.key, !vertical);
    return {
      gestureEnabled: dragDismiss && Platform.OS !== 'android',
      gestureDirection: vertical ? 'vertical' : reverse ? 'horizontal-inverted' : 'horizontal',
      cardOverlayEnabled: true,
      transitionSpec: pageTransitionSpec,
      cardStyleInterpolator: pageInterpolatorOf(route.key, direction),
      headerMode: 'screen',
      header: ({ options, back, navigation }: RnStackHeaderProps) => (
        <EgNavBar
          title={options.title}
          showLeft={back != null}
          left={{
            kind: 'icon',
            icon: 'eds-arrow-left-ios',
            accessibilityLabel: '返回',
            onPress: () => navigation.goBack(),
          }}
          background="visible"
          mode={mode}
          forceRnImplementation
        />
      ),
    } as unknown as NativeStackNavigationOptions;
  };
}
