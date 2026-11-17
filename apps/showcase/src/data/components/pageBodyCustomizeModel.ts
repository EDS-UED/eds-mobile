import {
  EG_PAGE_CONTENT_PADDING_TOP_PRESETS,
  resolveEgPageContentPaddingTopFromPreset,
  type EgPageContentPaddingTopPreset,
} from '@eds/mobile-components';

import type { DocCustomizeControl } from './types.js';

export const PAGE_BODY_CONTENT_PADDING_TOP_PRESET_OPTIONS: {
  value: EgPageContentPaddingTopPreset | 'custom';
  label: string;
}[] = [
  { value: 'xs', label: 'xs · 0' },
  { value: 'sm', label: 'sm · 4px' },
  { value: 'md', label: 'md · 8px' },
  { value: 'lg', label: 'lg · 12px（默认）' },
  { value: 'xl', label: 'xl · 16px' },
  { value: '2xl', label: '2xl · 20px' },
  { value: 'custom', label: '自定义' },
];

export const pageBodyCustomizeDefaults = {
  mode: 'light',
  contentPaddingTopPreset: 'lg' as EgPageContentPaddingTopPreset | 'custom',
  contentPaddingTopCustom: '12',
};

export const pageBodyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'contentPaddingTopPreset',
    label: '顶边距',
    options: PAGE_BODY_CONTENT_PADDING_TOP_PRESET_OPTIONS.map(({ value, label }) => ({
      value,
      label,
    })),
  },
  {
    kind: 'text',
    key: 'contentPaddingTopCustom',
    label: '顶边距（px）',
    placeholder: '12',
    visibleWhen: (state) => String(state.contentPaddingTopPreset ?? 'lg') === 'custom',
  },
];

export function resolvePageBodyContentPaddingTop(
  state: Record<string, unknown>,
): number {
  const preset = String(state.contentPaddingTopPreset ?? 'lg') as
    | EgPageContentPaddingTopPreset
    | 'custom';
  const customRaw = state.contentPaddingTopCustom;
  const customPx =
    typeof customRaw === 'number'
      ? customRaw
      : typeof customRaw === 'string'
        ? Number(customRaw)
        : undefined;
  return resolveEgPageContentPaddingTopFromPreset(preset, customPx);
}

/** 预览 props · 仅 `contentPaddingTop` 进 `EgPage`，档位字段留在 Customize 态。 */
export function applyPageBodyPreviewProps(
  entry: { slug?: string; exportName?: string },
  merged: Record<string, unknown>,
): Record<string, unknown> {
  if (entry.slug !== 'page-body' && entry.exportName !== 'EgPage') {
    return merged;
  }
  const { contentPaddingTopPreset: _p, contentPaddingTopCustom: _c, ...rest } = merged;
  return {
    ...rest,
    contentPaddingTop: resolvePageBodyContentPaddingTop(merged),
  };
}

export function pageBodyCustomizeSummary(state: Record<string, unknown>): string {
  const preset = String(state.contentPaddingTopPreset ?? 'lg');
  if (preset === 'custom') {
    return `custom · ${resolvePageBodyContentPaddingTop(state)}px`;
  }
  const px = EG_PAGE_CONTENT_PADDING_TOP_PRESETS[preset as EgPageContentPaddingTopPreset];
  return `${preset} · ${px}px`;
}