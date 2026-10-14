import { isAndroidLiquidGlassAvailable } from './nativeAndroidLiquidGlass.js';
import { isNativeLiquidGlassAvailable } from './nativeLiquidGlass.js';

/** iOS 系统液态材质 — 须 JS 模块 + 原生 API 均可用，避免仅 link 包时 GlassView 闪退。 */
export function shouldUseIosNativeGlassMaterial(): boolean {
  return isNativeLiquidGlassAvailable();
}

export function shouldUseAndroidNativeGlassMaterial(): boolean {
  return isAndroidLiquidGlassAvailable();
}
