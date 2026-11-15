import { Platform, StyleSheet, View } from 'react-native';

import { EgGlass } from './EgGlass.js';
import {
  EgScrollEdgeEffect,
  resolveEgScrollEdgeEffect,
  type EgScrollEdgeEffectProps,
} from './EgScrollEdgeEffect.js';
import { useGlassMaskNativeEdge } from './GlassMaskScrollEdge.js';
import { getNativeBlurView, isExpoBlurNativeLinked } from './nativeBlur.js';
import { getNativeLinearGradient, isExpoLinearGradientNativeLinked } from './nativeLinearGradient.js';

/** 置顶遮罩绘制档 — 原生 scroll edge · RN 遮罩浅 · RN 遮罩深兜底。 */
export type GlassMaskBackdropTier = 'native' | 'shallow' | 'deep';

export function resolveGlassMaskBackdropTier(input: {
  nativeMaskEdge: boolean;
  shallowAvailable: boolean;
  platform?: typeof Platform.OS;
}): GlassMaskBackdropTier {
  if (input.nativeMaskEdge) return 'native';
  if ((input.platform ?? Platform.OS) === 'android') return 'deep';
  return input.shallowAvailable ? 'shallow' : 'deep';
}

/** 遮罩浅依赖 expo-blur + expo-linear-gradient 原生模块均已链接。 */
export function isGlassMaskShallowAvailable(): boolean {
  return (
    getNativeBlurView() != null &&
    getNativeLinearGradient() != null &&
    isExpoBlurNativeLinked() &&
    isExpoLinearGradientNativeLinked()
  );
}

export function useGlassMaskBackdropTier(): GlassMaskBackdropTier {
  return resolveGlassMaskBackdropTier({
    nativeMaskEdge: useGlassMaskNativeEdge(),
    shallowAvailable: isGlassMaskShallowAvailable(),
  });
}

/**
 * 置顶遮罩背景：
 * 1. iOS 26+ `GlassMaskScrollEdgeScope` → 系统 Scroll Edge（本组件不绘）
 * 2. iOS 26 以下 → `EgScrollEdgeEffect`（遮罩浅）
 * 3. Android（强制毛玻璃）· 遮罩浅原生模块不可用 → `EgGlass box="glass-mask-box"`（遮罩深）
 */
export function GlassMaskBackdrop(props: EgScrollEdgeEffectProps) {
  const tier = useGlassMaskBackdropTier();
  const resolved = resolveEgScrollEdgeEffect(props.effect ?? 'automatic', props.container ?? 'page');

  if (resolved === 'hidden' || tier === 'native') {
    return null;
  }
  if (tier === 'shallow') {
    return <EgScrollEdgeEffect {...props} />;
  }
  return (
    <EgGlass
      box="glass-mask-box"
      mode={props.mode}
      style={props.style}
      testID={props.testID ?? 'eg-glass-mask-box-fallback'}
      maskModuleDivider={resolved === 'hard'}
    />
  );
}
