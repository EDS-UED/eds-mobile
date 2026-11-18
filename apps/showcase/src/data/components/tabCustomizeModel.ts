import type { DocCustomizeControl } from './types.js';

export const TAB_SHOWCASE_MAX_SEGMENTS = 10;

export const tabSegmentCountOptions = Array.from({ length: TAB_SHOWCASE_MAX_SEGMENTS }, (_, index) => {
  const n = String(index + 1);
  return { value: n, label: n };
});

export const tabSlideCustomizeDefaults = {
  segmentCount: '3',
} as const;

export const tabSlideSegmentCountControl: DocCustomizeControl = {
  kind: 'select',
  key: 'segmentCount',
  label: '数量',
  options: tabSegmentCountOptions,
};

export const tabSlideCustomizeControls: DocCustomizeControl[] = [tabSlideSegmentCountControl];

export const segmentedControlSizeOptions = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
] as const;

export const segmentedControlWidthModeOptions = [
  { value: 'hug', label: '自适应' },
  { value: 'fill', label: '全宽' },
] as const;

export const segmentedControlCustomizeDefaults = {
  ...tabSlideCustomizeDefaults,
  size: 'lg',
  widthMode: 'hug',
} as const;

export const segmentedControlCustomizeControls: DocCustomizeControl[] = [
  tabSlideSegmentCountControl,
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: [...segmentedControlSizeOptions],
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: '宽度',
    options: [...segmentedControlWidthModeOptions],
  },
];

export function readTabSegmentCount(state: Record<string, unknown>): number {
  const raw = state.segmentCount;
  const parsed =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
        ? Number.parseInt(raw, 10)
        : Number.NaN;
  if (!Number.isFinite(parsed)) {
    return 3;
  }
  return Math.min(TAB_SHOWCASE_MAX_SEGMENTS, Math.max(1, Math.trunc(parsed)));
}

export function buildEgTabPreviewItems(count: number): { id: string; label: string }[] {
  return Array.from({ length: count }, (_, index) => {
    const id = String(index + 1);
    return { id, label: 'Label' };
  });
}

export function buildEgTogglePreviewItems(count: number): { id: string; label: string; count?: number }[] {
  return Array.from({ length: count }, (_, index) => {
    const id = String(index + 1);
    return index === 1 ? { id, label: 'Label', count: 12 } : { id, label: 'Label' };
  });
}

export function buildEgSegmentedControlPreviewSegments(count: number): string[] {
  return Array.from({ length: count }, () => 'Label');
}

export function stripTabSlideCustomizeMeta(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const { segmentCount: _segmentCount, ...rest } = props;
  return rest;
}

export function isEgTabPreviewEntry(
  entry: Pick<{ slug: string; exportName: string }, 'slug' | 'exportName'>,
): boolean {
  return entry.exportName === 'EgTab' || entry.slug === 'tab-tabs';
}

export function isEgTogglePreviewEntry(
  entry: Pick<{ slug: string; exportName: string }, 'slug' | 'exportName'>,
): boolean {
  return entry.exportName === 'EgToggle' || entry.slug === 'tab-block';
}

export function isEgSegmentedControlPreviewEntry(
  entry: Pick<{ slug: string; exportName: string }, 'slug' | 'exportName'>,
): boolean {
  return entry.exportName === 'EgSegmentedControl' || entry.slug === 'tab-segmented-control';
}

export function applyTabSlidePreviewProps(
  entry: Pick<{ slug: string; exportName: string }, 'slug' | 'exportName'>,
  props: Record<string, unknown>,
): Record<string, unknown> {
  if (isEgTabPreviewEntry(entry)) {
    const count = readTabSegmentCount(props);
    const base = stripTabSlideCustomizeMeta(props);
    return {
      ...base,
      defaultSelectedId: '1',
      items: buildEgTabPreviewItems(count),
    };
  }

  if (isEgTogglePreviewEntry(entry)) {
    const count = readTabSegmentCount(props);
    const base = stripTabSlideCustomizeMeta(props);
    return {
      ...base,
      selectedId: '1',
      items: buildEgTogglePreviewItems(count),
    };
  }

  if (isEgSegmentedControlPreviewEntry(entry)) {
    const count = readTabSegmentCount(props);
    const base = stripTabSlideCustomizeMeta(props);
    return {
      ...base,
      defaultSelectedIndex: 0,
      segments: buildEgSegmentedControlPreviewSegments(count),
    };
  }

  return props;
}

export function resolveTabSlideAiCustomizeState(
  doc: { componentTag: string; previewSlug: string } | undefined,
  customizeState: Record<string, unknown>,
): Record<string, unknown> {
  if (!doc) {
    return customizeState;
  }
  const entry = { slug: doc.previewSlug, exportName: doc.componentTag };
  return applyTabSlidePreviewProps(entry, {
    ...(doc.componentTag === 'EgSegmentedControl'
      ? segmentedControlCustomizeDefaults
      : tabSlideCustomizeDefaults),
    ...customizeState,
  });
}
