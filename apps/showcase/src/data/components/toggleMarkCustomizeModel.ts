import { EG_TOGGLE_MARK_DEFAULT_SIZE } from '@eds/mobile-components';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import { SHOWCASE_TOGGLE_SIZE_OPTIONS } from './showcaseSizeOptions.js';
import type { DocCustomizeControl } from './types.js';

export const TOGGLE_MARK_PREVIEW_STATE_OPTIONS = [
  { value: 'full', label: '完整' },
  { value: 'on', label: '选中' },
  { value: 'off', label: '未选' },
  { value: 'disabled', label: '禁用' },
] as const;

export type ToggleMarkPreviewState = (typeof TOGGLE_MARK_PREVIEW_STATE_OPTIONS)[number]['value'];

export const toggleMarkCustomizeDefaults = {
  size: EG_TOGGLE_MARK_DEFAULT_SIZE,
  previewState: 'full',
} as const;

export const toggleMarkCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: [...SHOWCASE_TOGGLE_SIZE_OPTIONS],
  },
  {
    kind: 'select',
    key: 'previewState',
    label: '状态',
    options: [...TOGGLE_MARK_PREVIEW_STATE_OPTIONS],
  },
];

type ToggleMarkEntry = Pick<FigmaComponentEntry, 'exportName'>;

function resolveToggleMarkKeys(exportName: string): {
  valueKey: 'checked' | 'decided';
  defaultKey: 'defaultChecked' | 'defaultDecided';
} | null {
  switch (exportName) {
    case 'EgCheckbox':
    case 'EgRadio':
      return { valueKey: 'checked', defaultKey: 'defaultChecked' };
    case 'EgDecide':
      return { valueKey: 'decided', defaultKey: 'defaultDecided' };
    default:
      return null;
  }
}

/** Showcase Customize → 可点按预览（完整 = 非受控）。 */
export function applyToggleMarkPreviewProps(
  entry: ToggleMarkEntry,
  merged: Record<string, unknown>,
): Record<string, unknown> {
  const keys = resolveToggleMarkKeys(entry.exportName);
  if (!keys) {
    return merged;
  }

  const previewState = String(merged.previewState ?? 'full') as ToggleMarkPreviewState;
  const { previewState: _ps, [keys.valueKey]: _v, [keys.defaultKey]: _d, ...rest } = merged;

  switch (previewState) {
    case 'full':
      return { ...rest, [keys.defaultKey]: false, disabled: false };
    case 'on':
      return { ...rest, [keys.valueKey]: true, disabled: false };
    case 'off':
      return { ...rest, [keys.valueKey]: false, disabled: false };
    default:
      return { ...rest, [keys.valueKey]: true, disabled: true };
  }
}

export function toggleMarkPreviewRemountSuffix(customize: Record<string, unknown>): string {
  return `${String(customize.size ?? EG_TOGGLE_MARK_DEFAULT_SIZE)}-${String(customize.previewState ?? 'full')}`;
}