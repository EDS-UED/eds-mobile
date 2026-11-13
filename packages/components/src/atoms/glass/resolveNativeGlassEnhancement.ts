import { isIos26OrLater } from '../../shared/iosVersion.js';
import { isNativeLiquidGlassAvailable } from './nativeLiquidGlass.js';

/**
 * iOS 26+ 系统液态材质 — 须 JS 模块 + 原生 API 均可用，避免仅 link 包时 GlassView 闪退。
 * 其余系统（Android · iOS ≤25）一律走 RN 毛玻璃兜底。
 */
export function shouldUseIosNativeGlassMaterial(): boolean {
  return isIos26OrLater() && isNativeLiquidGlassAvailable();
}
