/// <reference types="vite/client" />

declare module '@eds/mobile-tokens/json' {
  const tokens: Record<string, unknown>;
  export default tokens;
}

declare module '@eds/mobile-tokens/liquid-glass' {
  export function initLiquidGlass(options?: Record<string, unknown>): unknown[];
  export function attachLiquidGlass(element: HTMLElement, options?: Record<string, unknown>): unknown;
  export function detachLiquidGlass(element: HTMLElement): void;
}

declare module '@eds/mobile-tokens/corner-smoothing' {
  export function initCornerSmoothing(): void;
  export function rescanCornerSmoothing(root?: ParentNode): void;
}
