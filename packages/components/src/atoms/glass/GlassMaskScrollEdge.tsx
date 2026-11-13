import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';

import { isIos26OrLater } from '../../shared/iosVersion.js';
import type { ThemeMode } from '../../theme/index.js';

export type GlassMaskScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

const GlassMaskNativeEdgeContext = createContext(false);

/** 当前子树内 `glass-mask-box` 是否由系统 scroll edge effect 承载（iOS 26+ 且处于 `GlassMaskScrollEdgeScope`）。 */
export function useGlassMaskNativeEdge(): boolean {
  return useContext(GlassMaskNativeEdgeContext);
}

/**
 * `glass-mask-box` 原生区 — iOS 26+ 时区内 `EgGlass box="glass-mask-box"` 不绘 RN 层，
 * 背景交给同区 `GlassMaskScrollEdgeHost` 的系统 scroll edge effect。须与 Host 成对使用。
 */
export function GlassMaskScrollEdgeScope({ children }: { children: ReactNode }) {
  return (
    <GlassMaskNativeEdgeContext.Provider value={isIos26OrLater()}>
      {children}
    </GlassMaskNativeEdgeContext.Provider>
  );
}

/**
 * `glass-mask-box` iOS 26+ 原生承载 — 包住滚动区，系统 `UINavigationBar` 仅作 scroll edge effect（无标题 / 栏项）。
 * Android · iOS ≤25 直接返回 children（背景由 RN `EgGlass` 绘制）。
 *
 * 静止（`active` false）隐藏整个系统栏而非设 edge `hidden` — RNS 设 `hidden` 时把样式重置为 automatic（sheet 内即 hard），
 * 淡出过程会闪出分割线；首次测得栏高前栏须可见（效果 `hidden`），否则测不到高度。
 * 系统栏高度不可改且原生栈裁切自身边界 — 原生栈恒贴宿主顶（下移会露出无内容硬边）；
 * 由 `onEdgeHeightChange` 回传实测栏高，EDS 栏须据此定高，使 scroll edge 底边与 EDS 栏底对齐。
 *
 * 不可用于 RN `Modal` 内：RNSScreen 在 Modal 宿主下会再挂一个 RCTSurfaceTouchHandler，触摸重复派发致 Pressable 失效；
 * 浮层须用 `EgEdsAnimaOverlayModal`（iOS 26+ 走 `transparentModal`）。
 */
export function GlassMaskScrollEdgeHost({
  mode = 'light',
  edgeEffect = 'soft',
  active = true,
  onEdgeHeightChange,
  children,
}: {
  mode?: ThemeMode;
  /** 顶部系统 scroll edge 样式；默认 `soft`（透明渐变模糊，与 RN mask 一致）。 */
  edgeEffect?: GlassMaskScrollEdgeEffect;
  /** 内容是否已滚入栏下；`false` 时 scroll edge 隐藏（同 RN mask `background="auto"`）。 */
  active?: boolean;
  /** 系统栏实测高度（px，距宿主顶）— 仅 iOS 26+ 回调。 */
  onEdgeHeightChange?: (height: number) => void;
  children: ReactNode;
}) {
  const [measured, setMeasured] = useState(false);
  const measureFrameRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(measureFrameRef.current), []);
  if (!isIos26OrLater()) return <>{children}</>;

  return (
    <ScreenStack style={styles.fill} nativeContainerStyle={styles.transparent}>
      <ScreenStackItem
        screenId="eg-glass-mask-scroll-edge"
        activityState={2}
        style={[StyleSheet.absoluteFill, styles.transparent]}
        contentStyle={styles.transparent}
        scrollEdgeEffects={{ top: measured ? edgeEffect : 'hidden', bottom: 'hidden', left: 'hidden', right: 'hidden' }}
        onHeaderHeightChange={(event) => {
          const height = Math.round(event.nativeEvent.headerHeight);
          if (height <= 0) return;
          onEdgeHeightChange?.(height);
          if (measured || measureFrameRef.current) return;
          /**
           * 隐藏系统栏须晚于宿主对栏高的响应提交：同一提交内隐藏会以 UIKit 动画重排，
           * 宿主据栏高调整的滚动 inset / offset 被卷入动画，内容可见地滑动。
           */
          measureFrameRef.current = requestAnimationFrame(() => {
            measureFrameRef.current = requestAnimationFrame(() => setMeasured(true));
          });
        }}
        headerConfig={{
          hidden: measured && !active,
          title: ' ',
          titleColor: 'transparent',
          backgroundColor: 'transparent',
          translucent: true,
          hideShadow: true,
          hideBackButton: true,
          disableBackButtonMenu: true,
          experimental_userInterfaceStyle: mode === 'dark' ? 'dark' : 'light',
        }}
      >
        {children}
      </ScreenStackItem>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
