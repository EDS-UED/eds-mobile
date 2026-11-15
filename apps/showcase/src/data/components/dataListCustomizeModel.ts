import type { EgSymbolSize } from '@eds/mobile-components';

import type { DocCustomizeControl } from './types.js';

export type DataListGraphicSize = 'sm' | 'md' | 'lg';
export type DataListGraphicType = 'crypto' | 'avatar' | 'icon' | 'custom';
export type DataListPrimaryWeight = 'normal' | 'medium' | 'heavy';
export type DataListWidgetType = 'time' | 'tag' | 'custom' | 'redDot';

export const DATA_LIST_GRAPHIC_SIZES = [
  { value: 'sm', label: 'SM · avatar-lg' },
  { value: 'md', label: 'MD · avatar-xl（默认）' },
  { value: 'lg', label: 'LG · avatar-3xl' },
] as const;

export const DATA_LIST_GRAPHIC_TYPES = [
  { value: 'crypto', label: '币种 · EgCrypto' },
  { value: 'avatar', label: '头像 · EgAvatar' },
  { value: 'icon', label: '图标 · EgSymbol' },
  { value: 'custom', label: '自定义' },
] as const;

export const DATA_LIST_ICON_SYMBOL_SIZES = [
  { value: 'xs', label: 'XS · symbol-xs' },
  { value: 'sm', label: 'SM · symbol-sm' },
  { value: 'md', label: 'MD · symbol-md（默认）' },
  { value: 'lg', label: 'LG · symbol-lg' },
] as const;

export const DATA_LIST_PRIMARY_WEIGHTS = [
  { value: 'normal', label: '正常 · typography-body-medium' },
  { value: 'medium', label: '中等 · typography-body-medium-strong' },
  { value: 'heavy', label: '粗 · typography-body-medium-heavy（默认）' },
] as const;

export const DATA_LIST_WIDGET_TYPES = [
  { value: 'time', label: '时间 · 与主文本同行' },
  { value: 'tag', label: 'Tag · 与主文本同行' },
  { value: 'custom', label: '自定义 · 与主文本同行' },
  { value: 'redDot', label: '红点 · 与副文本同行' },
] as const;

export const DATA_LIST_PRESS_INTENSITIES = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
] as const;

const graphicOn = (state: Record<string, unknown>) => state.graphicEnabled !== false;
const iconGraphic = (state: Record<string, unknown>) =>
  graphicOn(state) && state.graphicType === 'icon';
const widgetOn = (state: Record<string, unknown>) => state.widgetEnabled === true;

export const dataListCustomizeDefaults = {
  rowCount: '3',
  graphicEnabled: true,
  graphicSize: 'md' as DataListGraphicSize,
  graphicType: 'crypto' as DataListGraphicType,
  iconSymbolSize: 'md' as EgSymbolSize,
  primaryWeight: 'heavy' as DataListPrimaryWeight,
  subBoldSegment: false,
  descriptionEnabled: false,
  widgetEnabled: false,
  widgetType: 'time' as DataListWidgetType,
  interactive: true,
  pressIntensity: 'xs',
  forceTouchEnabled: false,
};

export const dataListComponentCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'rowCount',
    label: '行数',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
    ],
  },
  {
    kind: 'select',
    key: 'pressIntensity',
    label: '点按缩放',
    options: [...DATA_LIST_PRESS_INTENSITIES],
    visibleWhen: (state) => Boolean(state.interactive),
  },
  { kind: 'boolean', key: 'interactive', label: '可点按' },
  {
    kind: 'boolean',
    key: 'forceTouchEnabled',
    label: '压感 / 3D Touch',
    visibleWhen: (state) => Boolean(state.interactive),
  },
];

export const dataListSlotCustomizeControls: DocCustomizeControl[] = [
  { kind: 'heading', key: 'graphicHeading', label: '图形' },
  { kind: 'boolean', key: 'graphicEnabled', label: '图形插槽' },
  {
    kind: 'select',
    key: 'graphicSize',
    label: '图形尺寸',
    options: [...DATA_LIST_GRAPHIC_SIZES],
    visibleWhen: graphicOn,
  },
  {
    kind: 'select',
    key: 'graphicType',
    label: '图形类型',
    options: [...DATA_LIST_GRAPHIC_TYPES],
    visibleWhen: graphicOn,
  },
  {
    kind: 'select',
    key: 'iconSymbolSize',
    label: '图标 symbol 尺寸',
    options: [...DATA_LIST_ICON_SYMBOL_SIZES],
    visibleWhen: iconGraphic,
  },
  { kind: 'heading', key: 'textHeading', label: '文本' },
  {
    kind: 'select',
    key: 'primaryWeight',
    label: '主文本粗细',
    options: [...DATA_LIST_PRIMARY_WEIGHTS],
  },
  {
    kind: 'boolean',
    key: 'subBoldSegment',
    label: '副文本片段 A 加粗',
  },
  {
    kind: 'boolean',
    key: 'descriptionEnabled',
    label: '说明文本',
  },
  { kind: 'heading', key: 'widgetHeading', label: '挂件' },
  { kind: 'boolean', key: 'widgetEnabled', label: '挂件插槽' },
  {
    kind: 'select',
    key: 'widgetType',
    label: '挂件类型',
    options: [...DATA_LIST_WIDGET_TYPES],
    visibleWhen: widgetOn,
  },
];

export const dataListCustomizeControls: DocCustomizeControl[] = [
  ...dataListComponentCustomizeControls,
  ...dataListSlotCustomizeControls,
];

export function readDataListRowCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.rowCount ?? '3'), 10);
  if (!Number.isFinite(parsed)) return 3;
  return Math.min(5, Math.max(1, parsed));
}

export function readDataListGraphicSize(state: Record<string, unknown>): DataListGraphicSize {
  const value = state.graphicSize;
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

export function readDataListGraphicType(state: Record<string, unknown>): DataListGraphicType {
  const value = state.graphicType;
  if (value === 'avatar' || value === 'icon' || value === 'custom') return value;
  return 'crypto';
}

export function readDataListPrimaryWeight(state: Record<string, unknown>): DataListPrimaryWeight {
  const value = state.primaryWeight;
  if (value === 'normal' || value === 'medium') return value;
  return 'heavy';
}

export function readDataListWidgetType(state: Record<string, unknown>): DataListWidgetType {
  const value = state.widgetType;
  if (value === 'tag' || value === 'custom' || value === 'redDot') return value;
  return 'time';
}

/** 图形插槽边长 · avatar-lg / avatar-xl / avatar-3xl。 */
export function dataListGraphicSpacingToken(size: DataListGraphicSize): 'avatar-lg' | 'avatar-xl' | 'avatar-3xl' {
  if (size === 'sm') return 'avatar-lg';
  if (size === 'lg') return 'avatar-3xl';
  return 'avatar-xl';
}

/** EgAvatar `size` 与图形 token 对齐。 */
export function dataListGraphicAvatarSize(size: DataListGraphicSize): 'lg' | 'xl' | '3xl' {
  if (size === 'sm') return 'lg';
  if (size === 'lg') return '3xl';
  return 'xl';
}