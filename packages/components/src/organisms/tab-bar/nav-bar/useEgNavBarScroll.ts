import { NavigationContext } from '@react-navigation/native';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { isIos26OrLater } from '../../../shared/iosVersion.js';
import type { EgNavBarScrollEdgeEffect } from './EgNavBar.types.js';
import {
  EG_NAV_BAR_NATIVE_SCROLL_EDGE_HIDE_MS,
  patchEgNavBarNativeScrollEdge,
} from './egNavBarNativeScrollEdge.js';

type ScrollEventLike = { nativeEvent: { contentOffset: { y: number } } };

/** 滚入栏下的判定距离（自静止位置起，px）。 */
const SCROLL_EDGE_ACTIVE_DISTANCE = 1;

/**
 * 非 react-navigation 栈的系统栏宿主（如 `EgEdsAnimaPageShot` 弹层内页面栈）— 接收本页 scroll edge 切换与是否停在顶部。
 * `settled: false`（如展开飞行中滚动区临时改留白）期间忽略滚动；落位后重取静止位置。
 * @internal
 */
export type EgNavBarScrollEdgeHost = {
  setEdge: (effect: EgNavBarScrollEdgeEffect) => void;
  setAtTop: (atTop: boolean) => void;
  settled: boolean;
};

/** @internal */
export const EgNavBarScrollEdgeContext = createContext<EgNavBarScrollEdgeHost | null>(null);

/** 业务已固定 scroll edge（如 `automatic`）的 react-navigation 页 — `useEgNavBarScroll` 不再按滚动改写。 */
const fixedScrollEdgeNavigations = new WeakSet<object>();

/** @internal `EgEdsAnimaPage({ scrollEdgeEffect })` 在 screenOptions 内登记。 */
export function markEgNavBarScrollEdgeFixed(navigation: object, fixed: boolean) {
  if (fixed) fixedScrollEdgeNavigations.add(navigation);
  else fixedScrollEdgeNavigations.delete(navigation);
}

export type UseEgNavBarScrollOptions = {
  /**
   * iOS 26+ 驱动所在页系统栏 scroll edge（静止 `hidden` · 滚入栏下 `soft`）：react-navigation native-stack 页自动
   * `setOptions`；RN `EgNavBar` 的 `showTitle`、expo-router 等把返回的 `scrollEdgeActive` 传给 `egNavBarNativeStackOptions`。
   * 默认 true（`EgPage` 内）。Showcase 等已用 `scrollEdgeActive` 写进 `<Stack.Screen options>` 时传 `false`，避免双写。
   * 业务已固定 `scrollEdgeEffect`（`soft` / `hard` / `hidden`）时以配置为准，滚动不改写；`'automatic'` 视同缺省。
   */
  nativeScrollEdge?: boolean;
};

/**
 * `background="auto"` 的滚动驱动 — 展开到任意 `ScrollView` / `FlatList`：
 * `<ScrollView onScroll={onScroll} scrollEventThrottle={scrollEventThrottle} />`
 *
 * iOS 26+ 系统栏下 ScrollView 用 `contentInsetAdjustmentBehavior="automatic"`：静止位置取首个滚动事件
 * （系统应用避让 inset 时即触发），自此滚动超过 1px 视为内容已滚入栏下。
 * 系统栏只作用于页面「首个子视图链」上的 ScrollView：须为页面首个视图，勿外包带底色 `View`（会断链、scroll edge 不生效）；
 * 页底色走 navigator `contentStyle` / `cardStyle`。
 */
export function useEgNavBarScroll({ nativeScrollEdge = true }: UseEgNavBarScrollOptions = {}) {
  /** 自静止位起「滚入栏下」距离 — 供 RN `EgNavBar` `background="auto"` 驱动透明度。 */
  const scrollOffset = useSharedValue(0);
  const navigation = useContext(NavigationContext);
  const host = useContext(EgNavBarScrollEdgeContext);
  const setHostEdge = host?.setEdge;
  const setHostAtTop = host?.setAtTop;
  const settled = host?.settled ?? true;
  const [scrollEdgeActive, setScrollEdgeActive] = useState(false);
  const restOffset = useRef<number | null>(null);
  const active = useRef(false);
  const atTop = useRef(true);
  const nativeEdgeHiddenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drivesNativeEdge = nativeScrollEdge && isIos26OrLater();

  const applyNativeScrollEdge = useCallback((effect: 'soft' | 'hidden') => {
    if (setHostEdge) {
      setHostEdge(effect);
      return;
    }
    if (navigation && !fixedScrollEdgeNavigations.has(navigation)) {
      navigation.setOptions(patchEgNavBarNativeScrollEdge(effect));
    }
  }, [navigation, setHostEdge]);

  const clearNativeEdgeHiddenTimer = useCallback(() => {
    if (nativeEdgeHiddenTimer.current) {
      clearTimeout(nativeEdgeHiddenTimer.current);
      nativeEdgeHiddenTimer.current = null;
    }
  }, []);
  useLayoutEffect(() => {
    if (!settled) restOffset.current = null;
  }, [settled]);

  const resetScrollChrome = useCallback(() => {
    clearNativeEdgeHiddenTimer();
    restOffset.current = null;
    scrollOffset.value = 0;
    active.current = false;
    atTop.current = true;
    setScrollEdgeActive(false);
    if (drivesNativeEdge) applyNativeScrollEdge('hidden');
  }, [applyNativeScrollEdge, clearNativeEdgeHiddenTimer, drivesNativeEdge, scrollOffset]);

  useEffect(() => {
    if (!navigation || typeof navigation.addListener !== 'function') return;
    const unsubscribe = navigation.addListener('focus', resetScrollChrome);
    return () => {
      unsubscribe();
      clearNativeEdgeHiddenTimer();
    };
  }, [clearNativeEdgeHiddenTimer, navigation, resetScrollChrome]);

  const onScroll = useCallback(
    (event: ScrollEventLike) => {
      const y = event.nativeEvent.contentOffset.y;
      if (!settled) {
        scrollOffset.value = Math.max(0, y);
        // page-shot 飞行中仍上报顶停，供根页下拉关闭。
        if (setHostAtTop) {
          if (restOffset.current === null) restOffset.current = Math.min(y, 0);
          const underUnsettled = Math.max(0, y - restOffset.current);
          const atTopUnsettled = underUnsettled <= SCROLL_EDGE_ACTIVE_DISTANCE;
          if (atTop.current !== atTopUnsettled) {
            atTop.current = atTopUnsettled;
            setHostAtTop(atTopUnsettled);
          }
        }
        return;
      }
      // 系统避让（`automatic`）静止位置为负；`never` 首个事件已是用户拖动，静止即 0。
      if (restOffset.current === null) restOffset.current = Math.min(y, 0);
      const under = Math.max(0, y - restOffset.current);
      scrollOffset.value = under;
      const next = under > SCROLL_EDGE_ACTIVE_DISTANCE;
      if (setHostAtTop && atTop.current !== !next) {
        atTop.current = !next;
        setHostAtTop(!next);
      }
      if (next !== active.current) {
        active.current = next;
        setScrollEdgeActive(next);
      }
      if (!drivesNativeEdge) {
        return;
      }
      if (next) {
        clearNativeEdgeHiddenTimer();
        applyNativeScrollEdge('soft');
        return;
      }
      if (nativeEdgeHiddenTimer.current) return;
      nativeEdgeHiddenTimer.current = setTimeout(() => {
        nativeEdgeHiddenTimer.current = null;
        if (active.current) return;
        applyNativeScrollEdge('hidden');
      }, EG_NAV_BAR_NATIVE_SCROLL_EDGE_HIDE_MS);
    },
    [
      applyNativeScrollEdge,
      clearNativeEdgeHiddenTimer,
      drivesNativeEdge,
      scrollOffset,
      setHostAtTop,
      setHostEdge,
      settled,
    ],
  );

  return { scrollOffset, onScroll, scrollEventThrottle: 16 as const, scrollEdgeActive };
}
