import { isIos26OrLater } from '../../../../shared/iosVersion.js';

/** iOS 26+ → 系统原生菜单（ActionSheet）；Android / iOS ≤25 → RN 模态列表。 */
export function shouldUseEgMenuNativeStack(): boolean {
  return isIos26OrLater();
}

export type EgMenuRenderStack = 'native' | 'rn';

export function resolveEgMenuRenderStack(): EgMenuRenderStack {
  return shouldUseEgMenuNativeStack() ? 'native' : 'rn';
}
