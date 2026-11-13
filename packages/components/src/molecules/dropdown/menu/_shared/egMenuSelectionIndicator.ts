export type EgMenuRowLayout = {
  itemId: string;
  y: number;
  height: number;
  width: number;
};

type SharedNumber = { value: number };

export function layoutForMenuItem(
  layouts: EgMenuRowLayout[],
  itemId: string,
): EgMenuRowLayout | undefined {
  'worklet';
  for (let i = 0; i < layouts.length; i += 1) {
    if (layouts[i].itemId === itemId) {
      return layouts[i];
    }
  }
  return undefined;
}

/** 选中高亮 — 即时落位，无过渡动效。 */
export function snapMenuSelectionIndicator(
  itemId: string,
  layouts: EgMenuRowLayout[],
  indicatorY: SharedNumber,
  indicatorHeight: SharedNumber,
): void {
  'worklet';
  const layout = layoutForMenuItem(layouts, itemId);
  if (!layout) {
    return;
  }
  indicatorY.value = layout.y;
  indicatorHeight.value = layout.height;
}
