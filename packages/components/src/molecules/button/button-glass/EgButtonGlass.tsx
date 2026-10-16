import type { ViewProps } from 'react-native';
import { shouldUseEgButtonGlassNativeStack } from './_shared/resolveEgButtonGlassStack.js';
import { EgButtonGlassNative } from './EgButtonGlassNative.js';
import { EgButtonGlassRn } from './EgButtonGlassRn.js';
import type { EgButtonGlassProps } from './EgButtonGlass.types.js';

/**
 * 导航栏玻璃按钮 — 文本胶囊 / 圆形图标。
 *
 * - **iOS 26+**：系统 Liquid Glass；Pressable 边距与 RN 栈同 token（勿在 GlassView 上再叠一层 padding）。
 * - **其它平台 / iOS ≤25**：RN + `glass-button-box`（`EgGlass`），边距见 `resolveEgButtonGlassShellStyle`。
 */
export function EgButtonGlass(props: EgButtonGlassProps & Pick<ViewProps, 'style'>) {
  if (shouldUseEgButtonGlassNativeStack()) {
    return <EgButtonGlassNative {...props} />;
  }
  return <EgButtonGlassRn {...props} />;
}

export { shouldUseEgButtonGlassNativeStack } from './_shared/resolveEgButtonGlassStack.js';
