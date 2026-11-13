import type { ViewProps } from 'react-native';
import { resolveEgButtonGlassRenderStack } from './_shared/resolveEgButtonGlassStack.js';
import { EgButtonGlassNative } from './EgButtonGlassNative.js';
import { EgButtonGlassRn } from './EgButtonGlassRn.js';
import type { EgButtonGlassProps } from './EgButtonGlass.types.js';

/** 玻璃按钮 — iOS 26+ 原生 `GlassView`；其它系统 RN `glass-button-box`。 */
export function EgButtonGlass(props: EgButtonGlassProps & Pick<ViewProps, 'style'>) {
  if (resolveEgButtonGlassRenderStack() === 'native') {
    return <EgButtonGlassNative {...props} />;
  }
  return <EgButtonGlassRn {...props} />;
}

export {
  shouldUseEgButtonGlassNativeStack,
  resolveEgButtonGlassRenderStack,
  readEgButtonGlassStackDiagnostics,
  type EgButtonGlassRenderStack,
  type EgButtonGlassStackDiagnostics,
} from './_shared/resolveEgButtonGlassStack.js';
