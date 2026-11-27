import type { EgSymbolSize } from '@eds/mobile-components';
import type { EgDataListPrimaryWeight } from '@eds/mobile-components';

import mobileTheme from '@eds/mobile-tokens/theme';

import type { DocCustomizeControl } from './types.js';
import { SHOWCASE_SYMBOL_SIZE_OPTIONS } from './showcaseSizeOptions.js';

export type DataListGraphicSize = 'sm' | 'md' | 'lg' | 'xl';
export type DataListGraphicType = 'crypto' | 'avatar' | 'icon' | 'custom';
export type DataListPrimaryWeight = EgDataListPrimaryWeight;

function dataListGraphicSizePx(size: DataListGraphicSize): number {
  const token = dataListGraphicSpacingToken(size);
  return mobileTheme.spacing[token] as number;
}

function formatDataListGraphicSizeLabel(size: DataListGraphicSize): string {
  return `${size.toUpperCase()} · ${dataListGraphicSizePx(size)}px`;
}

export const DATA_LIST_GRAPHIC_SIZES = (
  ['sm', 'md', 'lg', 'xl'] as const satisfies readonly DataListGraphicSize[]
).map((value) => ({
  value,
  label: formatDataListGraphicSizeLabel(value),
}));

export const DATA_LIST_GRAPHIC_TYPES = [
  { value: 'crypto', label: '币种 · EgCrypto' },
  { value: 'avatar', label: '头像 · EgAvatar' },
  { value: 'icon', label: '图标 · EgSymbol' },
  { value: 'custom', label: '插槽' },
] as const;

export const DATA_LIST_ICON_SYMBOL_SIZES = [...SHOWCASE_SYMBOL_SIZE_OPTIONS];

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
  /** 内容区右侧「插槽」总开关（右箭头 / 开关 / 自定义）。 */
  slotOpen: boolean;
  showCustom: boolean;
  showArrow: boolean;
  showSwitch: boolean;
  showMessage: boolean;
  showRedDot: boolean;
};

const graphicOn = (state: Record<string, unknown>) => state.graphicEnabled !== false;
const iconGraphic = (state: Record<string, unknown>) =>
  graphicOn(state) && state.graphicType === 'icon';
const widgetOn = (state: Record<string, unknown>) => state.widgetEnabled === true;
const widgetSlotOn = (state: Record<string, unknown>) => state.widgetSlotEnabled === true;

export const dataListCustomizeDefaults = {
  rowCount: '1' as DataListRowCountOption,
  graphicEnabled: true,
  graphicSize: 'md' as DataListGraphicSize,
  graphicType: 'crypto' as DataListGraphicType,
  iconSymbolSize: 'md' as EgSymbolSize,
  primaryWeight: 'heavy' as DataListPrimaryWeight,
  primaryTagEnabled: false,
  subBoldSegment: false,
  descriptionEnabled: false,
  widgetEnabled: false,
  widgetShowTime: false,
  widgetShowTag: false,
  widgetSlotEnabled: false,
  widgetShowCustom: false,
  widgetShowSwitch: false,
  widgetShowArrow: false,
  widgetShowMessage: false,
  widgetShowRedDot: false,
  interactive: true,
  pressIntensity: 'xs',
  pressHapticEnabled: false,
  touchGestureEnabled: false,
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
    label: '动效',
    options: [...DATA_LIST_PRESS_INTENSITIES],
    visibleWhen: (state) => Boolean(state.interactive),
  },
  { kind: 'boolean', key: 'interactive', label: '点按' },
  {
    kind: 'boolean',
    key: 'pressHapticEnabled',
    label: '压感反馈',
    visibleWhen: (state) => Boolean(state.interactive),
  },
  {
    kind: 'boolean',
    key: 'touchGestureEnabled',
    label: 'Touch',
    visibleWhen: (state) => Boolean(state.interactive),
  },
];

const dataListGraphicSlotCardControls: DocCustomizeControl[] = [
  { kind: 'heading', key: 'graphicHeading', label: '图形', toggleKey: 'graphicEnabled' },
  {
    kind: 'select',
    key: 'graphicSize',
    label: '尺寸',
    options: [...DATA_LIST_GRAPHIC_SIZES],
    visibleWhen: graphicOn,
  },
  {
    kind: 'select',
    key: 'graphicType',
    label: '类型',
    options: [...DATA_LIST_GRAPHIC_TYPES],
    visibleWhen: graphicOn,
  },
  {
    kind: 'select',
    key: 'iconSymbolSize',
    label: '符号尺寸',
    options: [...DATA_LIST_ICON_SYMBOL_SIZES],
    visibleWhen: iconGraphic,
  },
];

const dataListTextSlotCardControls: DocCustomizeControl[] = [
  { kind: 'heading', key: 'textHeading', label: '文本' },
  {
    kind: 'select',
    key: 'primaryWeight',
    label: '字宽',
    options: [...DATA_LIST_PRIMARY_WEIGHTS],
  },
  {
    kind: 'boolean',
    key: 'subBoldSegment',
    label: '副文本加粗',
  },
  {
    kind: 'boolean',
    key: 'descriptionEnabled',
    label: '说明文本',
  },
  {
    kind: 'boolean',
    key: 'primaryTagEnabled',
    label: 'EgTag',
  },
];

const dataListWidgetSlotCardControls: DocCustomizeControl[] = [
  { kind: 'heading', key: 'widgetHeading', label: '挂件', toggleKey: 'widgetEnabled' },
  {
    kind: 'boolean',
    key: 'widgetShowTime',
    label: '时间',
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'widgetShowTag',
    label: 'EgTag',
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'widgetShowMessage',
    label: 'EgMessage',
    visibleWhen: widgetOn,
  },
  {
    kind: 'boolean',
    key: 'widgetShowRedDot',
    label: 'EgReddot',
    visibleWhen: widgetOn,
  },
];

const dataListContentSlotCardControls: DocCustomizeControl[] = [
  { kind: 'heading', key: 'widgetSlotHeading', label: '插槽', toggleKey: 'widgetSlotEnabled' },
  {
    kind: 'boolean',
    key: 'widgetShowArrow',
    label: '右箭头',
    visibleWhen: widgetSlotOn,
    exclusiveKeys: ['widgetShowSwitch', 'widgetShowCustom'],
  },
  {
    kind: 'boolean',
    key: 'widgetShowSwitch',
    label: 'EgSwitch',
    visibleWhen: widgetSlotOn,
    exclusiveKeys: ['widgetShowArrow', 'widgetShowCustom'],
  },
  {
    kind: 'boolean',
    key: 'widgetShowCustom',
    label: '自定义',
    visibleWhen: widgetSlotOn,
    exclusiveKeys: ['widgetShowArrow', 'widgetShowSwitch'],
  },
];

/** DataList「内容」— 四张子卡片 · 图形 / 文本 / 挂件 / 插槽。 */
export const dataListSlotCustomizeCards: DocCustomizeControl[][] = [
  dataListGraphicSlotCardControls,
  dataListTextSlotCardControls,
  dataListWidgetSlotCardControls,
  dataListContentSlotCardControls,
];

export const dataListSlotCustomizeControls: DocCustomizeControl[] = [
  ...dataListGraphicSlotCardControls,
  ...dataListTextSlotCardControls,
  ...dataListWidgetSlotCardControls,
  ...dataListContentSlotCardControls,
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
  if (value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') return value;
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

/** 主文本后 EgTag · `primaryTagEnabled`（与挂件 `widgetShowTag` 独立）。 */
export function readDataListPrimaryTagEnabled(state: Record<string, unknown>): boolean {
  return state.primaryTagEnabled === true;
}

/** 挂件可同时展示 · 红点与主行挂件不互斥。 */
export function readDataListWidgetFlags(state: Record<string, unknown>): DataListWidgetFlags {
  const slotOpen = state.widgetSlotEnabled === true;
  const enabled = state.widgetEnabled === true;
  if (!enabled) {
    return {
      showTime: false,
      showTag: false,
      slotOpen,
      showCustom: slotOpen && state.widgetShowCustom === true,
      showArrow: slotOpen && state.widgetShowArrow === true,
      showSwitch: slotOpen && state.widgetShowSwitch === true,
      showMessage: false,
      showRedDot: false,
    };
  }

  const legacyType = state.widgetType;
  const legacyRedDotOnly = legacyType === 'redDot';
  const legacyPrimary =
    legacyType === 'custom' ? 'custom' : legacyType === 'time' ? 'time' : null;

  const hasNewKeys =
    'widgetShowTime' in state ||
    'widgetShowTag' in state ||
    'widgetSlotEnabled' in state ||
    'widgetShowCustom' in state ||
    'widgetShowSwitch' in state ||
    'widgetShowArrow' in state ||
    'widgetShowMessage' in state ||
    'widgetShowRedDot' in state;

  if (!hasNewKeys && legacyType != null) {
    return {
      showTime: legacyPrimary === 'time',
      showTag: legacyType === 'tag',
      slotOpen: false,
      showCustom: false,
      showArrow: false,
      showSwitch: false,
      showMessage: false,
      showRedDot: legacyRedDotOnly,
    };
  }

  return {
    showTime: state.widgetShowTime === true,
    showTag: state.widgetShowTag === true,
    slotOpen,
    showCustom: slotOpen && state.widgetShowCustom === true,
    showArrow: slotOpen && state.widgetShowArrow === true,
    showSwitch: slotOpen && state.widgetShowSwitch === true,
    showMessage: state.widgetShowMessage === true,
    showRedDot: state.widgetShowRedDot === true,
  };
}

/** 图形插槽边长 · avatar-lg → avatar-4xl。 */
export function dataListGraphicSpacingToken(
  size: DataListGraphicSize,
): 'avatar-lg' | 'avatar-xl' | 'avatar-3xl' | 'avatar-4xl' {
  if (size === 'sm') return 'avatar-lg';
  if (size === 'lg') return 'avatar-3xl';
  if (size === 'xl') return 'avatar-4xl';
  return 'avatar-xl';
}

/** EgAvatar `size` 与图形 token 对齐。 */
export function dataListGraphicAvatarSize(size: DataListGraphicSize): 'lg' | 'xl' | '3xl' | '4xl' {
  if (size === 'sm') return 'lg';
  if (size === 'lg') return '3xl';
  if (size === 'xl') return '4xl';
  return 'xl';
}