import type { ViewProps } from 'react-native';
import { resolveEgGlassCapsuleRenderStack } from './_shared/resolveEgGlassCapsuleStack.js';
import { EgGlassCapsuleNative } from './EgGlassCapsuleNative.js';
import { EgGlassCapsuleRn } from './EgGlassCapsuleRn.js';
import type { EgGlassCapsuleProps } from './EgGlassCapsule.types.js';

/** 玻璃按钮 — iOS 26+ 原生 `GlassView`；其它系统 RN `glass-button-box`。 */
export function EgGlassCapsule(props: EgGlassCapsuleProps & Pick<ViewProps, 'style'>) {
  if (resolveEgGlassCapsuleRenderStack() === 'native') {
    return <EgGlassCapsuleNative {...props} />;
  }
  return <EgGlassCapsuleRn {...props} />;
}

export {
  shouldUseEgGlassCapsuleNativeStack,
  resolveEgGlassCapsuleRenderStack,
  readEgGlassCapsuleStackDiagnostics,
  type EgGlassCapsuleRenderStack,
  type EgGlassCapsuleStackDiagnostics,
} from './_shared/resolveEgGlassCapsuleStack.js';
