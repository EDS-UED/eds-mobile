import { shouldUseIosNativeGlassMaterial } from '../../../../atoms/glass/resolveNativeGlassEnhancement.js';
import { isIos26OrLater } from '../../../../shared/iosVersion.js';

/** iOS 26+ 且系统 Liquid Glass API 可用 → `GlassControlShell` 原生材质（与 Shell 内部同一闸门）。 */
export function shouldUseEgButtonGlassNativeStack(): boolean {
  return isIos26OrLater() && shouldUseIosNativeGlassMaterial();
}
