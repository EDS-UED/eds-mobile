import { EG_SWITCH_DEFAULT_SIZE, egSwitchComponentDefaults, resolveEgSwitchSize } from '@eds/mobile-components';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';
import type { ThemeMode } from '@eds/mobile-components';

import { SHOWCASE_TOGGLE_SIZE_OPTIONS } from './showcaseSizeOptions.js';
import type { DocCustomizeControl } from './types.js';

export const SWITCH_PREVIEW_STATE_OPTIONS = [
  { value: 'full', label: '完整' },
  { value: 'on', label: '开启' },
  { value: 'off', label: '关闭' },
  { value: 'disabled', label: '禁用' },
] as const;

export type SwitchPreviewState = (typeof SWITCH_PREVIEW_STATE_OPTIONS)[number]['value'];

export const switchCustomizeDefaults = {
  ...egSwitchComponentDefaults,
  previewState: 'full',
  forceRnImplementation: false,
} as const;

export const switchCustomizeControls: DocCustomizeControl[] = [
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
    options: [...SWITCH_PREVIEW_STATE_OPTIONS],
  },
  {
    kind: 'boolean',
    key: 'forceRnImplementation',
    label: 'iOS：强制 EgSwitchRn（对照 LG/MD/SM）',
  },
];

function coerceForceRn(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

/** Showcase Customize → 仅 EgSwitch 合法 props（勿 `...rest` 泄漏 showcase 键）。 */
export function applySwitchPreviewProps(
  entry: Pick<FigmaComponentEntry, 'exportName'>,
  merged: Record<string, unknown>,
): Record<string, unknown> {
  if (entry.exportName !== 'EgSwitch') {
    return merged;
  }

  const previewState = String(merged.previewState ?? 'full') as SwitchPreviewState;
  const size = resolveEgSwitchSize(merged.size);
  const mode: ThemeMode = merged.mode === 'dark' ? 'dark' : 'light';
  const testID = typeof merged.testID === 'string' ? merged.testID : undefined;
  const forceRn = coerceForceRn(merged.forceRnImplementation);

  const base = {
    mode,
    size,
    testID,
    ...(forceRn ? { forceRnImplementation: true as const } : {}),
  };

  switch (previewState) {
    case 'full':
      return { ...base, defaultValue: false, disabled: false };
    case 'on':
      return { ...base, value: true, disabled: false };
    case 'off':
      return { ...base, value: false, disabled: false };
  }

  return { ...base, value: true, disabled: true };
}

export function switchPreviewRemountSuffix(customize: Record<string, unknown>): string {
  return `${String(customize.size ?? EG_SWITCH_DEFAULT_SIZE)}-${String(customize.previewState ?? 'full')}-${String(coerceForceRn(customize.forceRnImplementation))}`;
}