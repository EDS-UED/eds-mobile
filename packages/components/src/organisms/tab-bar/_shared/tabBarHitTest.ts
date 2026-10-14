export type TabBarItemLayout = { x: number; width: number };

/** 触摸 x（相对 track）→ 最近 Tab 索引；worklet 安全。 */
export function hitTestTabBarIndex(x: number, layouts: TabBarItemLayout[]): number {
  'worklet';
  if (layouts.length === 0) {
    return -1;
  }

  for (let i = 0; i < layouts.length; i += 1) {
    const layout = layouts[i];
    if (x >= layout.x && x < layout.x + layout.width) {
      return i;
    }
  }

  const first = layouts[0];
  if (x < first.x) {
    return 0;
  }

  const last = layouts[layouts.length - 1];
  if (x >= last.x + last.width) {
    return layouts.length - 1;
  }

  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < layouts.length; i += 1) {
    const layout = layouts[i];
    const center = layout.x + layout.width / 2;
    const distance = Math.abs(x - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }

  return best;
}

export function layoutForTabIndex(
  layouts: TabBarItemLayout[],
  index: number,
): TabBarItemLayout | undefined {
  'worklet';
  if (index < 0 || index >= layouts.length) {
    return undefined;
  }
  return layouts[index];
}
