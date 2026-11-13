import { egMenuEdgeInsetPx, egMenuTriggerGapPx } from './egMenuLayoutDefaults.js';

export type EgMenuPlacement = 'top' | 'bottom';
export type EgMenuAlign = 'start' | 'center' | 'end';

export type EgMenuAnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export { egMenuEdgeInsetPx } from './egMenuLayoutDefaults.js';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * RN 浮层定位 — 相对触发器向外扩 `spacing-1`（4px）盖住触发器：
 * - `bottom`：上 -4；start 再左 -4，end 再右 -4，center 仅上 -4
 * - `top`：下 -4；start 左 -4，end 右 -4，center 仅下 -4
 * 之后再 clamp 到距屏幕 `spacing-2-5`。
 */
export function resolveEgMenuPanelFrame(input: {
  anchor: EgMenuAnchorRect;
  panelWidth: number;
  panelHeight: number;
  windowWidth: number;
  windowHeight: number;
  placement: EgMenuPlacement;
  align: EgMenuAlign;
  edgeInset?: number;
}): { top: number; left: number; width: number } {
  const {
    anchor,
    panelWidth,
    panelHeight,
    windowWidth,
    windowHeight,
    placement,
    align,
    edgeInset = egMenuEdgeInsetPx(),
  } = input;

  const maxWidth = Math.max(160, windowWidth - edgeInset * 2);
  const width = clamp(panelWidth, 160, maxWidth);
  const overlap = egMenuTriggerGapPx();

  let left: number;
  if (align === 'end') {
    left = anchor.x + anchor.width - width + overlap;
  } else if (align === 'center') {
    left = anchor.x + anchor.width / 2 - width / 2;
  } else {
    left = anchor.x - overlap;
  }
  left = clamp(left, edgeInset, windowWidth - edgeInset - width);

  let top: number;
  if (placement === 'top') {
    top = anchor.y + anchor.height - panelHeight + overlap;
  } else {
    top = anchor.y - overlap;
  }
  top = clamp(top, edgeInset, Math.max(edgeInset, windowHeight - edgeInset - panelHeight));

  return { top, left, width };
}
