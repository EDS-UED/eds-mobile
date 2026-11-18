import { resolveEgSwitchSize } from '../_shared/toggleComponentDefaults.js';
import { resolveEgSwitchRenderStack } from './_shared/resolveEgSwitchStack.js';
import { EgSwitchNative } from './EgSwitchNative.js';
import { EgSwitchRn } from './EgSwitchRn.js';
import type { EgSwitchProps } from './EgSwitch.types.js';

export type { EgSwitchProps } from './EgSwitch.types.js';
export {
  resolveEgSwitchRenderStack,
  shouldUseEgSwitchNativeStack,
  type EgSwitchRenderStack,
} from './_shared/resolveEgSwitchStack.js';

/** Toggle Switch — iOS 26+ 系统开关 · 其余 EDS 自绘轨道。 */
export function EgSwitch(props: EgSwitchProps) {
  const resolved = { ...props, size: resolveEgSwitchSize(props.size) };
  if (!resolved.forceRnImplementation && resolveEgSwitchRenderStack() === 'native') {
    return <EgSwitchNative {...resolved} />;
  }
  return <EgSwitchRn {...resolved} />;
}