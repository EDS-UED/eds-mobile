/**
 * Mobile Color semantic group + token order on /tokens (Figma Color System).
 *
 * Spec source: packages/tokens/spec/color/semantic.json
 * Group order: Box → Stroke → Text → Material → Status → Effect → Event
 */
export const effectColorTokenOrder = [
  'effect-shallow',
  'effect-moderate',
  'effect-deep',
  'effect-prompt',
] as const;

const effectColorTokenNames = new Set<string>(effectColorTokenOrder);

export function colorSemanticGroupKey(name: string): string {
  if (effectColorTokenNames.has(name) || name.startsWith('effect-')) return 'effect';
  if (name.startsWith('eds-')) return 'eds';
  return name.split('-')[0];
}

export const colorSemanticGroupOrder = [
  'box',
  'stroke',
  'text',
  'material',
  'status',
  'effect',
  'event',
] as const;

export const colorSemanticGroupLabels: Record<string, string> = {
  box: 'Box',
  stroke: 'Stroke',
  text: 'Text',
  material: 'Material',
  status: 'Status',
  effect: 'Effect',
  event: 'Event',
};

/** Figma Color System → Box variable order. */
export const boxColorTokenOrder = ['box-page', 'box-flotation'] as const;

/** Figma Color System → Stroke variable order. */
export const strokeColorTokenOrder = [
  'stroke-hide',
  'stroke-divider',
  'stroke-base-primary',
  'stroke-base-secondary',
  'stroke-base-tertiary',
  'stroke-base-quaternary',
  'stroke-color-brand',
  'stroke-color-danger',
  'stroke-same-white',
] as const;

/** Figma Color System → Text variable order. */
export const textColorTokenOrder = [
  'text-base-primary',
  'text-base-secondary',
  'text-base-tertiary',
  'text-base-quaternary',
  'text-brand',
  'text-face-primary',
  'text-face-secondary',
  'text-face-tertiary',
  'text-face-quaternary',
  'text-same-black',
  'text-same-white',
  'text-same-white-weaken',
] as const;

/** Figma Color System → Material variable order. */
export const materialColorTokenOrder = [
  'material-hide',
  'material-base-primary',
  'material-base-secondary',
  'material-base-tertiary',
  'material-base-quaternary',
  'material-card-shallow',
  'material-card-moderate',
  'material-card-deep',
  'material-brand',
  'material-brand-weaken',
  'material-match',
  'material-match-weaken',
  'material-decor',
  'material-decor-weaken',
  'material-face-primary',
  'material-face-secondary',
  'material-face-tertiary',
  'material-face-quaternary',
  'material-same-black',
  'material-same-black-weaken',
  'material-same-white',
  'material-same-white-weaken',
] as const;

/** Figma Color System → Status variable order. */
export const statusColorTokenOrder = [
  'status-disable-base',
  'status-disable-base-weaken',
  'status-disable-brand',
  'status-disable-brand-weaken',
  'status-disable-same-white',
  'status-success',
  'status-success-weaken',
  'status-danger',
  'status-danger-weaken',
  'status-warning',
  'status-warning-weaken',
] as const;

/** Figma Color System → Event variable order (Mobile: event-tap*). */
export const eventColorTokenOrder = [
  'event-tap',
  'event-tap-brand',
  'event-tap-decor',
  'event-tap-danger',
  'event-tap-base',
  'event-tap-face',
  'event-focus',
  'event-focus-brand',
] as const;

const colorTokenOrderByGroup: Record<string, readonly string[]> = {
  box: boxColorTokenOrder,
  stroke: strokeColorTokenOrder,
  text: textColorTokenOrder,
  material: materialColorTokenOrder,
  status: statusColorTokenOrder,
  effect: effectColorTokenOrder,
  event: eventColorTokenOrder,
};

export function sortColorSemanticItems<T extends { name: string }>(
  groupKey: string,
  items: T[],
): T[] {
  const order = colorTokenOrderByGroup[groupKey];
  if (!order) {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }

  const rank = new Map(order.map((name, index) => [name, index]));
  return [...items].sort(
    (a, b) => (rank.get(a.name) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.name) ?? Number.MAX_SAFE_INTEGER),
  );
}
