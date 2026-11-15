import { isIos26OrLater } from '../../../../shared/iosVersion.js';

/** iOS 26+ → `UISwitch`（RN `Switch`）；Android · iOS ≤25 → EDS 自绘轨道。 */
export function shouldUseEgSwitchNativeStack(): boolean {
  return isIos26OrLater();
}

export type EgSwitchRenderStack = 'native' | 'rn';

export function resolveEgSwitchRenderStack(): EgSwitchRenderStack {
  return shouldUseEgSwitchNativeStack() ? 'native' : 'rn';
}