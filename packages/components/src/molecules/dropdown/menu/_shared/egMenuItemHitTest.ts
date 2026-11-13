export type EgMenuItemHitRect = {
  top: number;
  bottom: number;
  itemId: string;
};

/** 触摸 absoluteY → 命中行；worklet 安全。 */
export function hitTestMenuItemAtY(y: number, rects: EgMenuItemHitRect[]): EgMenuItemHitRect | undefined {
  'worklet';
  if (rects.length === 0) {
    return undefined;
  }

  for (let i = 0; i < rects.length; i += 1) {
    const rect = rects[i];
    if (y >= rect.top && y < rect.bottom) {
      return rect;
    }
  }

  const first = rects[0];
  if (y < first.top) {
    return first;
  }

  const last = rects[rects.length - 1];
  if (y >= last.bottom) {
    return last;
  }

  let best = rects[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < rects.length; i += 1) {
    const rect = rects[i];
    const center = (rect.top + rect.bottom) / 2;
    const distance = Math.abs(y - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = rect;
    }
  }

  return best;
}
