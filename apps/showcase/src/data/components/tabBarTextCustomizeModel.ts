import { buildEgTabBarTextItems, EG_TAB_BAR_TEXT_MAX_TABS } from '@eds/mobile-components';

import type { DocCustomizeControl } from './types.js';

export const tabBarTextCustomizeDefaults = {
  tabCount: '3',
  defaultSelectedIndex: '0',
  disabled: false,
} as const;

export const tabBarTextTabCountOptions = Array.from({ length: EG_TAB_BAR_TEXT_MAX_TABS }, (_, index) => {
  const n = String(index + 1);
  return { value: n, label: n };
});

export const tabBarTextTabCountControl: DocCustomizeControl = {
  kind: 'select',
  key: 'tabCount',
  label: 'Tab 数量',
  options: tabBarTextTabCountOptions,
};

export function readTabBarTextTabCount(state: Record<string, unknown>): number {
  const raw = state.tabCount;
  const parsed =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
        ? Number.parseInt(raw, 10)
        : Number.NaN;
  if (!Number.isFinite(parsed)) {
    return 3;
  }
  return Math.min(EG_TAB_BAR_TEXT_MAX_TABS, Math.max(1, Math.trunc(parsed)));
}

export function buildTabBarTextDefaultSelectedOptions(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    value: String(index),
    label: `Tab ${index + 1}`,
  }));
}

export const tabBarTextCustomizeControls: DocCustomizeControl[] = [
  tabBarTextTabCountControl,
  {
    kind: 'select',
    key: 'defaultSelectedIndex',
    label: '默认选中',
    options: buildTabBarTextDefaultSelectedOptions(readTabBarTextTabCount(tabBarTextCustomizeDefaults)),
  },
  { kind: 'boolean', key: 'disabled', label: '禁用' },
];

export function stripTabBarTextCustomizeMeta(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const { tabCount: _tabCount, ...rest } = props;
  return rest;
}

export function isEgTabBarTextPreviewEntry(
  entry: Pick<{ slug: string; exportName: string }, 'slug' | 'exportName'>,
): boolean {
  return entry.exportName === 'EgTabBarText' || entry.slug === 'tab-bar-text';
}

export function applyTabBarTextPreviewProps(
  entry: Pick<{ slug: string; exportName: string }, 'slug' | 'exportName'>,
  props: Record<string, unknown>,
): Record<string, unknown> {
  if (!isEgTabBarTextPreviewEntry(entry)) {
    return props;
  }
  const tabCount = readTabBarTextTabCount(props);
  const base = stripTabBarTextCustomizeMeta(props);
  const defaultSelectedIndex = Number(base.defaultSelectedIndex ?? 0);
  return {
    ...base,
    tabCount,
    defaultSelectedIndex: Math.min(tabCount - 1, Math.max(0, defaultSelectedIndex)),
    items: buildEgTabBarTextItems(tabCount),
  };
}

export function resolveTabBarTextAiCustomizeState(
  doc: { componentTag: string; previewSlug: string } | undefined,
  customizeState: Record<string, unknown>,
): Record<string, unknown> {
  if (!doc || doc.componentTag !== 'EgTabBarText') {
    return customizeState;
  }
  const entry = { slug: doc.previewSlug, exportName: doc.componentTag };
  return applyTabBarTextPreviewProps(entry, {
    ...tabBarTextCustomizeDefaults,
    ...customizeState,
  });
}