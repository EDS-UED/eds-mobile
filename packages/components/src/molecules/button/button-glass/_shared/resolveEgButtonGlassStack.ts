import { Platform } from 'react-native';

import { getNativeGlassView } from '../../../../atoms/glass/nativeLiquidGlass.js';
import { shouldUseIosNativeGlassMaterial } from '../../../../atoms/glass/resolveNativeGlassEnhancement.js';
import { getIOSMajorVersion, isIos26OrLater } from '../../../../shared/iosVersion.js';

/** `native` · GlassView + `isInteractive`；`rn` · glass-button-box。 */
export type EgButtonGlassRenderStack = 'native' | 'rn';

/**
 * iOS 26+ 且 UIGlassEffect 可用 → 原生液态玻璃。
 * 其余 → RN。
 */
export function shouldUseEgButtonGlassNativeStack(): boolean {
  return Platform.OS === 'ios' && isIos26OrLater() && shouldUseIosNativeGlassMaterial();
}

/** EgButtonGlass 唯一分流：默认原生，不支持则 RN。 */
export function resolveEgButtonGlassRenderStack(): EgButtonGlassRenderStack {
  if (shouldUseEgButtonGlassNativeStack() && Boolean(getNativeGlassView())) {
    return 'native';
  }
  return 'rn';
}

export type EgButtonGlassStackDiagnostics = {
  stack: EgButtonGlassRenderStack;
  iosMajor: number;
  runtimeGlassApi: boolean | null;
  compiledLiquidGlass: boolean | null;
  hint: string;
};

export function readEgButtonGlassStackDiagnostics(): EgButtonGlassStackDiagnostics {
  const stack = resolveEgButtonGlassRenderStack();
  const iosMajor = Platform.OS === 'ios' ? getIOSMajorVersion() : 0;
  let runtimeGlassApi: boolean | null = null;
  let compiledLiquidGlass: boolean | null = null;

  try {
    const mod = require('expo-glass-effect') as {
      isGlassEffectAPIAvailable?: () => boolean;
      isLiquidGlassAvailable?: () => boolean;
    };
    runtimeGlassApi = Boolean(mod.isGlassEffectAPIAvailable?.());
    compiledLiquidGlass = Boolean(mod.isLiquidGlassAvailable?.());
  } catch {
    runtimeGlassApi = null;
    compiledLiquidGlass = null;
  }

  if (stack === 'native') {
    return {
      stack,
      iosMajor,
      runtimeGlassApi,
      compiledLiquidGlass,
      hint: 'EgButtonGlass → GlassView（系统液态玻璃 + isInteractive）',
    };
  }

  let hint = 'EgButtonGlass → glass-button-box（RN）';
  if (Platform.OS === 'ios') {
    if (iosMajor < 26) {
      hint += ` · iOS ${iosMajor}（原生需 26+）`;
    } else if (runtimeGlassApi === false) {
      hint += ' · UIGlassEffect 不可用';
    } else if (runtimeGlassApi === null) {
      hint += ' · 未链接 expo-glass-effect';
    } else if (!getNativeGlassView()) {
      hint += ' · GlassView 未加载';
    } else if (!shouldUseIosNativeGlassMaterial()) {
      hint += ' · 原生闸门未通过';
    }
  }

  return {
    stack: 'rn',
    iosMajor,
    runtimeGlassApi,
    compiledLiquidGlass,
    hint,
  };
}
