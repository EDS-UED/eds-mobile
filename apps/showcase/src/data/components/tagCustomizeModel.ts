import type { DocCustomizeControl } from './types.js';
import { SHOWCASE_SIZE_OPTIONS_LG_TO_SM } from './showcaseSizeOptions.js';

export const TAG_FAMILY_OPTIONS = [
  { value: 'system', label: '系统' },
  { value: 'status', label: '状态' },
  { value: 'colorful', label: '彩色' },
  { value: 'custom', label: '商业' },
] as const;

export type TagFamilyOption = (typeof TAG_FAMILY_OPTIONS)[number]['value'];

export const EG_TAG_STYLE_OPTIONS = [
  { value: 'subtle', label: '浅' },
  { value: 'solid-brand', label: '实心品牌' },
  { value: 'solid-red', label: '实心红' },
  { value: 'gray', label: '灰' },
  { value: 'stroke-subtle', label: '描边浅' },
  { value: 'stroke-solid', label: '描边实心' },
] as const;

export const TAG_STATUS_OPTIONS = [
  { value: 'danger', label: '危险' },
  { value: 'warning', label: '警告' },
  { value: 'success', label: '成功' },
  { value: 'ready', label: '就绪' },
  { value: 'invalid', label: '无效' },
] as const;

/** 对齐 Desktop `showcaseTagColorfulStyleLabels` */
export const TAG_COLORFUL_STYLE_OPTIONS = [
  { value: 'apricot', label: '杏色' },
  { value: 'khaki', label: '卡其' },
  { value: 'grass', label: '草绿' },
  { value: 'sage', label: '鼠尾草' },
  { value: 'cyan', label: '青' },
  { value: 'ice-blue', label: '冰蓝' },
  { value: 'periwinkle', label: '长春花' },
  { value: 'lilac', label: '丁香' },
  { value: 'orchid', label: '兰花' },
  { value: 'mallow', label: '锦葵' },
  { value: 'rose', label: '玫瑰' },
  { value: 'coral', label: '珊瑚' },
  { value: 'mauve', label: '淡紫' },
  { value: 'moss', label: '苔藓' },
  { value: 'steel', label: '钢蓝' },
  { value: 'grape', label: '葡萄' },
  { value: 'samewhite', label: '同白' },
  { value: 'lime', label: '青柠' },
] as const;

/** 对齐 Desktop `showcaseTagCustomStyleLabels` · 商业 */
export const TAG_CUSTOM_STYLE_OPTIONS = [
  { value: 'vermilion', label: '朱红' },
  { value: 'orange', label: '橙' },
  { value: 'amber', label: '琥珀' },
  { value: 'lime', label: '青柠' },
  { value: 'mint', label: '薄荷' },
  { value: 'teal', label: '青绿' },
  { value: 'clear-sky', label: '晴空' },
  { value: 'cobalt', label: '钴蓝' },
  { value: 'aurora', label: '极光' },
  { value: 'orchid', label: '兰花' },
  { value: 'rose', label: '玫瑰' },
  { value: 'peach', label: '蜜桃' },
  { value: 'aml-danger', label: 'AML 危险' },
  { value: 'aml-safe', label: 'AML 安全' },
  { value: 'aml-suspicious', label: 'AML 可疑' },
  { value: 'aml-ready', label: 'AML 就绪' },
  { value: 'aml-invalid', label: 'AML 无效' },
] as const;

export const TAG_SHAPES = [
  { value: 'round', label: '圆形' },
  { value: 'square', label: '方形' },
] as const;

const familyIs = (value: string) => (state: Record<string, unknown>) => String(state.family ?? 'system') === value;

export const tagCustomizeDefaults = {
  family: 'system' as TagFamilyOption,
  variant: 'subtle',
  status: 'danger',
  colorfulStyle: 'apricot',
  customStyle: 'vermilion',
  shape: 'round',
  size: 'sm',
  label: 'Tag',
};

export const tagCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'family',
    label: '类型',
    options: [...TAG_FAMILY_OPTIONS],
  },
  {
    kind: 'select',
    key: 'variant',
    label: '样式',
    options: [...EG_TAG_STYLE_OPTIONS],
    visibleWhen: familyIs('system'),
  },
  {
    kind: 'select',
    key: 'status',
    label: '状态',
    options: [...TAG_STATUS_OPTIONS],
    visibleWhen: familyIs('status'),
  },
  {
    kind: 'select',
    key: 'colorfulStyle',
    label: '彩色',
    options: [...TAG_COLORFUL_STYLE_OPTIONS],
    visibleWhen: familyIs('colorful'),
  },
  {
    kind: 'select',
    key: 'customStyle',
    label: '商业',
    options: [...TAG_CUSTOM_STYLE_OPTIONS],
    visibleWhen: familyIs('custom'),
  },
  { kind: 'select', key: 'shape', label: '形状', options: [...TAG_SHAPES] },
  { kind: 'select', key: 'size', label: '尺寸', options: [...SHOWCASE_SIZE_OPTIONS_LG_TO_SM] },
  { kind: 'text', key: 'label', label: '文案' },
];