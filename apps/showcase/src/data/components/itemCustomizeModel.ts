import type { DocCustomizeControl } from './types.js';

export const ITEM_DEMO_ICONS = [
  { value: 'eds-pentagram', label: 'pentagram' },
  { value: 'eds-user-security', label: 'security' },
  { value: 'eds-interface-lock', label: 'lock' },
  { value: 'none', label: '无图形' },
] as const;

export const ITEM_PAD_SIZES = [
  { value: 'sm', label: '紧凑 · 8px' },
  { value: 'md', label: '标准 · 12px' },
  { value: 'lg', label: '宽松 · 16px' },
] as const;

export const ITEM_PRESS_INTENSITIES = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
] as const;

export const ITEM_TRAILING_DISPLAYS = [
  { value: 'icon', label: 'Icon' },
  { value: 'menu', label: 'Menu' },
  { value: 'switch', label: '开关' },
  { value: 'custom', label: '自定义' },
] as const;

export const ITEM_DEMO_MENU_ITEMS = [
  { value: 'default', label: '默认' },
  { value: 'compact', label: '紧凑' },
  { value: 'expanded', label: '宽松' },
] as const;

const widgetOn = (state: Record<string, unknown>) => state.widgetEnabled !== false;

export const itemCustomizeDefaults = {
  label: '修改昵称',
  subLabelEnabled: false,
  subLabel: '副文本说明',
  iconName: 'eds-pentagram',
  widgetEnabled: true,
  trailingDisplay: 'icon',
  accessoryDetailEnabled: false,
  menuSelectedId: 'default',
  trailingSwitchOn: false,
  showDivider: true,
  previewRowCount: '3',
  interactive: true,
  pressIntensity: 'xs',
  padSize: 'lg',
};

/** 列表 / 行壳 — 「定制」卡片。 */
export const itemComponentCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'previewRowCount',
    label: '预览行数',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  { kind: 'boolean', key: 'showDivider', label: '底部分割线' },
  {
    kind: 'select',
    key: 'padSize',
    label: '密度',
    options: [...ITEM_PAD_SIZES],
  },
  {
    kind: 'select',
    key: 'pressIntensity',
    label: '点按缩放',
    options: [...ITEM_PRESS_INTENSITIES],
    visibleWhen: (state) => Boolean(state.interactive),
  },
  { kind: 'boolean', key: 'interactive', label: '可点按' },
];

export const itemIconCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'iconName',
    label: '左侧图标',
    options: [...ITEM_DEMO_ICONS],
  },
];

export const itemTextCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: '主文案', placeholder: '修改昵称' },
  { kind: 'boolean', key: 'subLabelEnabled', label: '副文本' },
  {
    kind: 'text',
    key: 'subLabel',
    label: '副文本文案',
    placeholder: '副文本说明',
    visibleWhen: (state) => state.subLabelEnabled === true,
  },
];

export const itemTrailingCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'widgetEnabled', label: '挂件插槽' },
  {
    kind: 'select',
    key: 'trailingDisplay',
    label: '显示',
    options: [...ITEM_TRAILING_DISPLAYS],
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'accessoryDetailEnabled',
    label: '附属说明',
    visibleWhen: widgetOn,
  },
  {
    kind: 'select',
    key: 'menuSelectedId',
    label: 'Menu 选中项',
    options: [...ITEM_DEMO_MENU_ITEMS],
    visibleWhen: (state) => widgetOn(state) && state.trailingDisplay === 'menu',
  },
  {
    kind: 'boolean',
    key: 'trailingSwitchOn',
    label: '开关默认',
    visibleWhen: (state) => widgetOn(state) && state.trailingDisplay === 'switch',
  },
];

export const itemCustomizeControls: DocCustomizeControl[] = [
  ...itemComponentCustomizeControls,
  ...itemIconCustomizeControls,
  ...itemTextCustomizeControls,
  ...itemTrailingCustomizeControls,
];

/** 「插槽」单卡 · 图形 / 文本 / 挂件小类标题 + EgItem 行。 */
export const itemSlotCustomizeControls: DocCustomizeControl[] = [
  { kind: 'heading', key: 'itemSlotGraphicHeading', label: '图形' },
  ...itemIconCustomizeControls,
  { kind: 'heading', key: 'itemSlotTextHeading', label: '文本' },
  ...itemTextCustomizeControls,
  { kind: 'heading', key: 'itemSlotWidgetHeading', label: '挂件' },
  ...itemTrailingCustomizeControls,
];

export function readItemPreviewRowCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.previewRowCount ?? '3'), 10);
  if (!Number.isFinite(parsed)) return 3;
  return Math.min(4, Math.max(1, parsed));
}

export function readItemIconName(state: Record<string, unknown>): string {
  const value = String(state.iconName ?? 'eds-pentagram');
  return value === 'none' ? '' : value;
}

export type ItemTrailingDisplay = 'icon' | 'menu' | 'switch' | 'custom';

export function readItemTrailingDisplay(state: Record<string, unknown>): ItemTrailingDisplay {
  const value = state.trailingDisplay;
  if (value === 'menu' || value === 'switch' || value === 'custom') return value;
  return 'icon';
}

export type ItemPadSize = 'sm' | 'md' | 'lg';

export function readItemPadSize(state: Record<string, unknown>): ItemPadSize {
  const value = state.padSize;
  if (value === 'sm' || value === 'md') return value;
  return 'lg';
}

export function readItemSubLabel(state: Record<string, unknown>): string | undefined {
  if (state.subLabelEnabled !== true) return undefined;
  const text = String(state.subLabel ?? '').trim();
  return text.length > 0 ? text : undefined;
}

export function readItemTrailingValue(state: Record<string, unknown>): string | undefined {
  if (state.widgetEnabled === false || state.accessoryDetailEnabled !== true) {
    return undefined;
  }
  return '默认';
}