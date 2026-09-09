/** Mobile Figma Primitives — Color Base display order (node 2008:41). */
export const colorBaseOrder = [
  'eds-brand',
  'eds-match',
  'eds-decor',
  'eds-success',
  'eds-danger',
  'eds-warning',
  'eds-base',
  'eds-face',
  'eds-same-black',
  'eds-same-white',
  'eds-page',
  'eds-flotation',
] as const;

export function sortColorBaseRows<T extends { name: string }>(rows: T[]): T[] {
  const rank = new Map(colorBaseOrder.map((name, index) => [name, index]));

  return [...rows].sort((a, b) => {
    const aRank = rank.get(a.name as (typeof colorBaseOrder)[number]);
    const bRank = rank.get(b.name as (typeof colorBaseOrder)[number]);

    if (aRank == null && bRank == null) return a.name.localeCompare(b.name);
    if (aRank == null) return 1;
    if (bRank == null) return -1;
    return aRank - bRank;
  });
}
