import type { EgNavBarScrollEdgeEffect } from './EgNavBar.types.js';
import { egNavBarNativeScrollEdgeEffects } from './egNavBarNativeStackOptions.js';
import { resolveFadeMotionTokens } from '../../../shared/motion/fadeMotionTokens.js';

/** RNS 设 `top: hidden` 会先落 `automatic`（像 hard）— 收顶后延迟再下发 hidden，对齐 motion-fade。 */
export const EG_NAV_BAR_NATIVE_SCROLL_EDGE_HIDE_MS = resolveFadeMotionTokens().opacityDurationMs;

export function patchEgNavBarNativeScrollEdge(
  top: Extract<EgNavBarScrollEdgeEffect, 'soft' | 'hidden'>,
): { scrollEdgeEffects: ReturnType<typeof egNavBarNativeScrollEdgeEffects> } {
  return { scrollEdgeEffects: egNavBarNativeScrollEdgeEffects(top) };
}