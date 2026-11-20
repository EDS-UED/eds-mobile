export type EgMenuItemHitRect = {
  top: number;
  bottom: number;
  itemId: string;
};

/** 相邻行之间用半行高中点切分，避免落在间隙时被 fallback 带到下一行。 */
export function partitionMenuItemHitRects(rects: EgMenuItemHitRect[]): EgMenuItemHitRect[] {
  if (rects.length <= 1) {
    return rects;
  }
  const sorted = rects.slice().sort((a, b) => a.top - b.top);
  const partitioned: EgMenuItemHitRect[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const rect = sorted[i];
    const prev = sorted[i - 1];
    const next = sorted[i + 1];
    const top =
      prev != null ? Math.max(rect.top, (prev.bottom + rect.top) / 2) : rect.top;
    const bottom =
      next != null ? Math.min(rect.bottom, (rect.bottom + next.top) / 2) : rect.bottom;
    partitioned.push({ itemId: rect.itemId, top, bottom });
  }
  return partitioned;
}

/** 触摸 Y → 命中行（`y` 与 `rects` 须同一坐标系）；worklet 安全。 */
export function hitTestMenuItemAtY(
  y: number,
  rects: EgMenuItemHitRect[],
  slopPx = 0,
): EgMenuItemHitRect | undefined {
  'worklet';
  if (rects.length === 0) {
    return undefined;
  }

  for (let i = 0; i < rects.length; i += 1) {
    const rect = rects[i];
    if (y >= rect.top - slopPx && y <= rect.bottom + slopPx) {
      return rect;
    }
  }

  return undefined;
}