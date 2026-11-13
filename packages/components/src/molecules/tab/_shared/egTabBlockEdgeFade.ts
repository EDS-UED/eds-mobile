export const EG_TAB_BLOCK_EDGE_FADE_LOCATIONS: readonly [number, number, number] = [0, 0.42, 1];

export function egTabBlockPageBackgroundFadeStops(
  pageBg: string,
): readonly [string, string, string] {
  if (pageBg.startsWith('#') && pageBg.length === 7) {
    return [pageBg, `${pageBg}66`, `${pageBg}00`];
  }
  return [pageBg, pageBg, 'transparent'];
}
