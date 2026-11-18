import type { EgSymbolSize } from '@eds/mobile-components';
import type { EgDataListPrimaryWeight } from '@eds/mobile-components';

import type { DocCustomizeControl } from './types.js';

export type DataListGraphicSize = 'sm' | 'md' | 'lg';
export type DataListGraphicType = 'crypto' | 'avatar' | 'icon' | 'custom';
export type DataListPrimaryWeight = EgDataListPrimaryWeight;

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

export const DATA_LIST_PRESS_INTENSITIES = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
] as const;

/** Showcase「业务侧自定义」— 预览固定 3 行示意；业务用 `children` 自配条数。 */
export const DATA_LIST_ROW_COUNT_BUSINESS = 'business' as const;

export type DataListRowCountOption = '1' | '2' | typeof DATA_LIST_ROW_COUNT_BUSINESS;

/** 业务侧自定义时预览演示行数（非 API 约束）。 */
export const DATA_LIST_ROW_COUNT_BUSINESS_PREVIEW_ROWS = 3;

export type DataListWidgetFlags = {
  showTime: boolean;
  showTag: boolean;
  showCustom: boolean;
  showRedDot: boolean;
};

const graphicOn = (state: Record<string, unknown>) => state.graphicEnabled !== false;
const iconGraphic = (state: Record<string, unknown>) =>
  graphicOn(state) && state.graphicType === 'icon';
const widgetOn = (state: Record<string, unknown>) => state.widgetEnabled === true;

export const dataListCustomizeDefaults = {
  rowCount: DATA_LIST_ROW_COUNT_BUSINESS,
  graphicEnabled: true,
  graphicSize: 'md' as DataListGraphicSize,
  graphicType: 'crypto' as DataListGraphicType,
  iconSymbolSize: 'md' as EgSymbolSize,
  primaryWeight: 'heavy' as DataListPrimaryWeight,
  subBoldSegment: false,
  descriptionEnabled: false,
  widgetEnabled: false,
  widgetShowTime: true,
  widgetShowTag: false,
  widgetShowCustom: false,
  widgetShowRedDot: false,
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
      { value: DATA_LIST_ROW_COUNT_BUSINESS, label: '业务侧自定义' },
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
    kind: 'boolean',
    key: 'widgetShowTime',
    label: '时间 · 主文本同行',
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'widgetShowTag',
    label: 'Tag · 主文本同行',
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'widgetShowCustom',
    label: '自定义 · 主文本同行',
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'widgetShowRedDot',
    label: '红点 · 副文本同行（可与上三项同开）',
    visibleWhen: widgetOn,
  },
];

export const dataListCustomizeControls: DocCustomizeControl[] = [
  ...dataListComponentCustomizeControls,
  ...dataListSlotCustomizeControls,
];

export function readDataListRowCountOption(state: Record<string, unknown>): DataListRowCountOption {
  const raw = String(state.rowCount ?? '1');
  if (raw === DATA_LIST_ROW_COUNT_BUSINESS) return DATA_LIST_ROW_COUNT_BUSINESS;
  if (raw === '2') return '2';
  return '1';
}

export function readDataListRowCount(state: Record<string, unknown>): number {
  const option = readDataListRowCountOption(state);
  if (option === DATA_LIST_ROW_COUNT_BUSINESS) return DATA_LIST_ROW_COUNT_BUSINESS_PREVIEW_ROWS;
  return option === '2' ? 2 : 1;
}

export function isDataListRowCountBusiness(state: Record<string, unknown>): boolean {
  return readDataListRowCountOption(state) === DATA_LIST_ROW_COUNT_BUSINESS;
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

export function readDataListSubBoldSegment(state: Record<string, unknown>): boolean {
  const value = state.subBoldSegment;
  return value === true || value === 'true' || value === 1 || value === '1';
}

/** 挂件可同时展示 · 红点与主行挂件不互斥。 */
export function readDataListWidgetFlags(state: Record<string, unknown>): DataListWidgetFlags {
  const enabled = state.widgetEnabled === true;
  if (!enabled) {
    return { showTime: false, showTag: false, showCustom: false, showRedDot: false };
  }

  const legacyType = state.widgetType;
  const legacyRedDotOnly = legacyType === 'redDot';
  const legacyPrimary =
    legacyType === 'tag' ? 'tag' : legacyType === 'custom' ? 'custom' : legacyType === 'time' ? 'time' : null;

  const hasNewKeys =
    'widgetShowTime' in state ||
    'widgetShowTag' in state ||
    'widgetShowCustom' in state ||
    'widgetShowRedDot' in state;

  if (!hasNewKeys && legacyType != null) {
    return {
      showTime: legacyPrimary === 'time',
      showTag: legacyPrimary === 'tag',
      showCustom: legacyPrimary === 'custom',
      showRedDot: legacyRedDotOnly,
    };
  }

  return {
    showTime: state.widgetShowTime !== false,
    showTag: state.widgetShowTag === true,
    showCustom: state.widgetShowCustom === true,
    showRedDot: state.widgetShowRedDot === true,
  };
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