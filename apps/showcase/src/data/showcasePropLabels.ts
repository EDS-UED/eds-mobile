/**
 * Showcase 定制下拉选项（§4.2）：
 * - token / prop 取值：**「中文 + 英文 token」**，中间空格；英文与 props 字面量一致
 * - 纯数量等非枚举：简短中文（如 `1 个`）
 */

export type PropLabelRow<K extends string = string> = {
  key: K;
  label: string;
};

export type SelectOption = { value: string; label: string };

/** §4.2 — 「中文 + 英文 token」 */
export function tokenLabel(zh: string, token: string): string {
  return `${zh} ${token}`;
}

/** 预览画廊等场景：仅取 tokenLabel 的中文部分。 */
export function galleryLabelFromTokenLabel(label: string): string {
  const spaceIndex = label.lastIndexOf(' ');
  if (spaceIndex <= 0) return label;
  return label.slice(0, spaceIndex);
}

export function tokenOption(zh: string, value: string): SelectOption {
  return { value, label: tokenLabel(zh, value) };
}

export function countSelectOptions(max: number, start = 1): SelectOption[] {
  return Array.from({ length: max - start + 1 }, (_, index) => {
    const value = String(start + index);
    return { value, label: `${value} 个` };
  });
}

export const showcaseSizeLabels = {
  lg: tokenLabel('大', 'lg'),
  md: tokenLabel('中', 'md'),
  sm: tokenLabel('小', 'sm'),
  xs: tokenLabel('特小', 'xs'),
} as const;

export const showcaseLinkSizeLabels = {
  lg: tokenLabel('大', 'lg'),
  md: tokenLabel('中', 'md'),
  sm: tokenLabel('小', 'sm'),
} as const;

export const showcaseInputSizeLabels = {
  lg: tokenLabel('大', 'lg'),
  md: tokenLabel('中', 'md'),
  sm: tokenLabel('小', 'sm'),
} as const;

export const showcaseVariantLabels = {
  solid: tokenLabel('实心', 'solid'),
  outline: tokenLabel('描边', 'outline'),
  text: tokenLabel('文字', 'text'),
} as const;

export const showcaseButtonToneLabels = {
  brand: tokenLabel('品牌', 'brand'),
  danger: tokenLabel('危险', 'danger'),
  decor: tokenLabel('装饰', 'decor'),
  subtle: tokenLabel('浅', 'subtle'),
  sameWhite: tokenLabel('同白', 'sameWhite'),
} as const;

export const showcaseLinkToneLabels = {
  brand: tokenLabel('品牌', 'brand'),
  theme: tokenLabel('主题', 'theme'),
  decor: tokenLabel('装饰', 'decor'),
} as const;

export const showcasePaginationToneLabels = {
  decor: tokenLabel('装饰', 'decor'),
  brand: tokenLabel('品牌', 'brand'),
} as const;

export const showcaseIconShapeLabels = {
  rectangular: tokenLabel('矩形', 'rectangular'),
  square: tokenLabel('方形', 'square'),
  round: tokenLabel('圆形', 'round'),
} as const;

export const showcasePaginationKindLabels = {
  number: '分页器-数字',
  symbol: '分页器-符号',
  button: '分页器-填充箭头',
  borderArrow: '工具栏-边框箭头',
} as const;

export const showcaseInputTypeLabels = {
  standard: tokenLabel('文本', 'text'),
  amount: tokenLabel('金额', 'amount'),
} as const;

export const showcaseWidthModeLabels = {
  fixed: tokenLabel('固定', 'fixed'),
  full: tokenLabel('全宽', 'full'),
  adaptive: tokenLabel('自适应', 'adaptive'),
  trigger: tokenLabel('触发器', 'trigger'),
} as const;

export const showcasePlacementLabels = {
  top: tokenLabel('上', 'top'),
  bottom: tokenLabel('下', 'bottom'),
  left: tokenLabel('左', 'left'),
  right: tokenLabel('右', 'right'),
} as const;

export const showcaseTriggerLabels = {
  click: tokenLabel('点击', 'click'),
  hover: tokenLabel('悬浮', 'hover'),
} as const;

export const showcaseAlignLabels = {
  start: tokenLabel('起始', 'start'),
  end: tokenLabel('结束', 'end'),
  center: tokenLabel('居中', 'center'),
} as const;

export const showcaseHeightModeLabels = {
  adaptive: tokenLabel('自适应', 'adaptive'),
  fixed: tokenLabel('固定', 'fixed'),
} as const;

export const showcaseTagStatusLabels = {
  danger: tokenLabel('危险', 'danger'),
  warning: tokenLabel('警告', 'warning'),
  success: tokenLabel('成功', 'success'),
  ready: tokenLabel('就绪', 'ready'),
  invalid: tokenLabel('无效', 'invalid'),
} as const;

export const showcaseMessageTypeLabels = {
  subtle: tokenLabel('浅', 'subtle'),
  brand: tokenLabel('品牌', 'brand'),
  danger: tokenLabel('危险', 'danger'),
} as const;

export const showcaseFlotationTriggerStyleLabels = {
  subtle: tokenLabel('浅', 'subtle'),
  outline: tokenLabel('描边', 'outline'),
  text: tokenLabel('文字', 'text'),
} as const;

export const showcaseFlotationTriggerKindLabels = {
  'standard-dropdown': '标准下拉框',
  'module-menu': '模块菜单',
} as const;

export const showcaseFlotationBoxTypeLabels = {
  text: tokenLabel('文字', 'text'),
  'symbol-text': tokenLabel('图标+文字', 'symbol-text'),
  'image-text': tokenLabel('图片+文字', 'image-text'),
} as const;

export const showcaseFlotationBoxKindLabels = {
  'standard-menu': '标准下拉菜单',
  'standard-cascade-menu': '标准下拉级联菜单',
  'scene-address-dropdown': '场景化-下拉地址',
  'scene-address-hover': '场景化-地址悬浮',
} as const;

/** Combo 页 EgFlotationMenu「场景」— 对齐侧栏插槽 catalog 文案。 */
export const showcaseFlotationComboBoxSceneLabels = {
  'standard-menu': '标准菜单',
  'standard-cascade-menu': '标准级联菜单',
  'scene-address-dropdown': '下拉地址',
  'scene-address-hover': '地址悬浮',
} as const;

export const showcaseFlotationBoxSelectionModeLabels = {
  single: tokenLabel('单选', 'single'),
  multiple: tokenLabel('复选', 'multiple'),
} as const;

export const showcaseDividerTypeLabels = {
  module: tokenLabel('模块', 'module'),
  page: tokenLabel('页面', 'page'),
  navigator: tokenLabel('导航', 'navigator'),
} as const;

export const showcaseDirectionLabels = {
  horizontal: tokenLabel('水平', 'horizontal'),
  vertical: tokenLabel('垂直', 'vertical'),
  left: tokenLabel('左', 'left'),
  right: tokenLabel('右', 'right'),
} as const;

export const showcaseTabShapeLabels = {
  circle: tokenLabel('圆形', 'circle'),
  square: tokenLabel('方形', 'square'),
} as const;

export const showcaseFeedbackToastTypeLabels = {
  result: tokenLabel('结果', 'result'),
  danger: tokenLabel('危险', 'danger'),
} as const;

export const showcaseFeedbackMessageTypeLabels = {
  subtle: tokenLabel('浅', 'subtle'),
  brand: tokenLabel('品牌', 'brand'),
  danger: tokenLabel('危险', 'danger'),
} as const;

export const showcaseMessageFocusBackgroundLabels = {
  inherit: tokenLabel('继承原色', 'inherit'),
  'same-white': tokenLabel('同白', 'same-white'),
} as const;

export const showcaseFormSubmissionTypeLabels = {
  notes: tokenLabel('备注', 'notes'),
  danger: tokenLabel('危险', 'danger'),
  success: tokenLabel('成功', 'success'),
} as const;

export const showcaseStreamerTypeLabels = {
  info: tokenLabel('信息', 'info'),
  warning: tokenLabel('警告', 'warning'),
  danger: tokenLabel('危险', 'danger'),
} as const;

export const showcaseStreamerVisualLabels = {
  brand: tokenLabel('品牌', 'brand'),
  moderate: tokenLabel('弱化', 'moderate'),
} as const;

export const showcaseToggleCheckboxModeLabels = {
  checkbox: tokenLabel('复选框', 'checkbox'),
  'unchecked-disable': tokenLabel('未选禁用', 'unchecked-disable'),
  'checked-disable': tokenLabel('已选禁用', 'checked-disable'),
  indeterminate: tokenLabel('半选', 'indeterminate'),
} as const;

export const showcaseToggleRadioModeLabels = {
  radio: tokenLabel('单选', 'radio'),
  disable: tokenLabel('禁用', 'disable'),
} as const;

export const showcaseToggleDecideModeLabels = {
  decide: tokenLabel('决定', 'decide'),
  disable: tokenLabel('禁用', 'disable'),
} as const;

export const showcaseToggleSwitchModeLabels = {
  switch: tokenLabel('开关', 'switch'),
  disable: tokenLabel('禁用', 'disable'),
} as const;

export const showcaseTagSystemTypeLabels = {
  subtle: tokenLabel('浅', 'subtle'),
  'solid-brand': tokenLabel('实心品牌', 'solid-brand'),
  'solid-red': tokenLabel('实心红', 'solid-red'),
  gray: tokenLabel('灰', 'gray'),
  'stroke-subtle': tokenLabel('描边浅', 'stroke-subtle'),
  'stroke-solid': tokenLabel('描边实心', 'stroke-solid'),
} as const;

export const showcaseTagColorfulStyleLabels = {
  apricot: tokenLabel('杏色', 'apricot'),
  khaki: tokenLabel('卡其', 'khaki'),
  grass: tokenLabel('草绿', 'grass'),
  sage: tokenLabel('鼠尾草', 'sage'),
  cyan: tokenLabel('青', 'cyan'),
  'ice-blue': tokenLabel('冰蓝', 'ice-blue'),
  periwinkle: tokenLabel('长春花', 'periwinkle'),
  lilac: tokenLabel('丁香', 'lilac'),
  orchid: tokenLabel('兰花', 'orchid'),
  mallow: tokenLabel('锦葵', 'mallow'),
  rose: tokenLabel('玫瑰', 'rose'),
  coral: tokenLabel('珊瑚', 'coral'),
  mauve: tokenLabel('淡紫', 'mauve'),
  moss: tokenLabel('苔藓', 'moss'),
  steel: tokenLabel('钢蓝', 'steel'),
  grape: tokenLabel('葡萄', 'grape'),
  samewhite: tokenLabel('同白', 'samewhite'),
  lime: tokenLabel('青柠', 'lime'),
} as const;

export const showcaseTagCustomStyleLabels = {
  vermilion: tokenLabel('朱红', 'vermilion'),
  orange: tokenLabel('橙', 'orange'),
  amber: tokenLabel('琥珀', 'amber'),
  lime: tokenLabel('青柠', 'lime'),
  mint: tokenLabel('薄荷', 'mint'),
  teal: tokenLabel('青绿', 'teal'),
  'clear-sky': tokenLabel('晴空', 'clear-sky'),
  cobalt: tokenLabel('钴蓝', 'cobalt'),
  aurora: tokenLabel('极光', 'aurora'),
  orchid: tokenLabel('兰花', 'orchid'),
  rose: tokenLabel('玫瑰', 'rose'),
  peach: tokenLabel('蜜桃', 'peach'),
  'aml-danger': tokenLabel('AML 危险', 'aml-danger'),
  'aml-suspicious': tokenLabel('AML 可疑', 'aml-suspicious'),
  'aml-invalid': tokenLabel('AML 无效', 'aml-invalid'),
} as const;

export const showcaseBatchBarActionTypeLabels = {
  text: tokenLabel('文字', 'text'),
  symbol: tokenLabel('符号', 'symbol'),
  statistics: tokenLabel('统计', 'statistics'),
} as const;

export const showcasePageBgLabels = {
  none: tokenLabel('无', 'none'),
  right: tokenLabel('右', 'right'),
  center: tokenLabel('居中', 'center'),
} as const;

export const showcaseLayoutTypeLabels = {
  empty: tokenLabel('空', 'empty'),
  free: tokenLabel('自由布局', 'free'),
} as const;

export const showcasePopupUsesLabels = {
  detail: tokenLabel('详情', 'detail'),
  dialog: tokenLabel('对话框', 'dialog'),
  verify: tokenLabel('验证', 'verify'),
  custom: tokenLabel('自定义', 'custom'),
} as const;

export const showcasePopupAlertVerticalAlignLabels = {
  center: tokenLabel('居中', 'center'),
  'offset-top': tokenLabel('偏上', 'offset-top'),
} as const;

export const showcaseSearchScenarioLabels = {
  search: tokenLabel('搜索', 'search'),
  'verify-input': tokenLabel('验证输入', 'verify-input'),
} as const;

export const showcaseDialogTypeLabels = {
  symbol: tokenLabel('带符号的对话', 'symbol'),
  compose: tokenLabel('业务对话', 'compose'),
  standard: tokenLabel('标准', 'standard'),
} as const;

export const showcasePaginerDataVolumeLabels = {
  few: tokenLabel('少量', 'few'),
  many: tokenLabel('大量', 'many'),
} as const;

export const showcaseYesNoLabels = {
  yes: tokenLabel('有', 'yes'),
  no: tokenLabel('无', 'no'),
} as const;

export const showcaseModuleMenuAccessoryLabels = {
  none: tokenLabel('无', 'none'),
  message: tokenLabel('消息', 'message'),
  reddot: tokenLabel('红点', 'reddot'),
} as const;

export const showcaseModuleMenuTitleKindLabels = {
  text: '文本',
  preset: '下拉框',
} as const;

export const showcaseNavBarScenarioLabels = {
  'nav-bar': tokenLabel('组件', 'nav-bar'),
  cregis: tokenLabel('业务', 'cregis'),
} as const;

export const showcaseModuleMenuScenarioLabels = {
  'module-menu': '组件',
  cregis: 'Cregis',
  udun: 'UDun',
} as const;

export const showcaseIconButtonEventLabels = {
  full: tokenLabel('完整', 'full'),
  default: tokenLabel('默认', 'default'),
  hover: tokenLabel('悬浮', 'hover'),
  active: tokenLabel('点击', 'active'),
  focus: tokenLabel('聚焦', 'focus'),
} as const;

export const showcaseTooltipPanelKindLabels = {
  container: tokenLabel('容器面板', 'container'),
  flotation: tokenLabel('浮层面板', 'flotation'),
  popup: tokenLabel('弹窗面板', 'popup'),
  subtle: tokenLabel('页面面板', 'subtle'),
  molde: tokenLabel('模块层级', 'molde'),
} as const;

/** Tooltip 本体页「类型」下拉 — panelKind 选项（中英）。 */
export const showcaseTooltipPanelKindCustomizeLabels = {
  flotation: tokenLabel('工具提示', 'flotation'),
  container: tokenLabel('客户端容器', 'container'),
  popup: tokenLabel('弹窗容器', 'popup'),
  molde: tokenLabel('模块层级', 'molde'),
} as const;

export const showcaseTooltipFlotationScenarioLabels = {
  component: '类型',
  'text-overflow': '字段溢出',
  'paragraph-overflow-info': '段落溢出',
  'multi-address': '地址溢出（Item、可复制）',
} as const;

export const showcaseTooltipPanelRadiusLabels: Record<string, string> = {
  '': tokenLabel('默认', 'default'),
  'radius-0': tokenLabel('无圆角', 'radius-0'),
  'radius-xs': tokenLabel('超小', 'radius-xs'),
  'radius-sm': tokenLabel('小', 'radius-sm'),
  'radius-md': tokenLabel('中', 'radius-md'),
  'radius-lg': tokenLabel('大', 'radius-lg'),
  'radius-full': tokenLabel('全圆', 'radius-full'),
};

export const showcaseComboPopupCountLabels = {
  '1': '1 个（仅确认）',
  '2': '2 个（确认+取消）',
} as const;

export const showcaseComboActionKindLabels = {
  skid: tokenLabel('滑轨', 'Action-Skid'),
  'popup-window': tokenLabel('弹窗', 'Popup Window'),
  flotation: tokenLabel('浮层', 'Flotation'),
  page: tokenLabel('页面', 'Page'),
} as const;

export const showcaseButtonCustomizeFieldLabels = {
  tone: '色调',
  variant: '风格',
  size: '尺寸',
  disabled: '禁用',
  loading: '加载',
  label: '文案',
  showIcon: '显示图标',
  iconPosition: '图标位置',
  iconName: '图标名',
  symbol: '图标',
  shape: '类型',
  event: '交互',
  badge: '角标',
  showBadge: '显示角标',
  showReddot: '显示红点',
  href: '链接',
  kind: '类型',
  divider: '分隔线',
  confirmLabel: '确认文案',
  cancelLabel: '取消文案',
  count: '按钮数',
  clear: '清空',
  direction: '方向',
} as const;

export const showcaseInputCustomizeFieldLabels = {
  type: '类型',
  size: '尺寸',
  widthMode: '宽度',
  fixedWidth: '固定宽度',
  placeholder: '占位符',
  scenario: '场景化',
  disabled: '禁用',
  readonly: '只读',
  unit: '单位',
  clearable: '清空',
  showMax: '显示 Max',
  maxLabel: 'Max 文案',
  pasteLabel: 'Paste 文案',
  clearLabel: 'Clear 文案',
  interaction: '交互',
  label: '标题',
  feedback: '反馈区',
} as const;

export const showcaseTooltipCustomizeFieldLabels = {
  scenario: '场景化',
  panelRadius: '圆角',
  widthMode: '宽度',
  width: '固定宽度',
  heightMode: '高度',
  height: '高度',
  maxHeight: '最大高度',
  placement: '弹出方向',
  trigger: '触发方式',
  disabled: '禁用',
  triggerLabel: '触发器文案',
} as const;

export const showcaseFlotationCustomizeFieldLabels = {
  triggerStyle: '样式',
  size: '尺寸',
  triggerLabel: '文案',
  disabled: '禁用',
  showSymbol: '显示图标',
  symbolIcon: '图标名',
  symbolPosition: '图标位置',
  showTag: '显示标签',
  tagText: '标签文案',
  tagStatus: '标签状态',
  showMessage: '显示消息',
  messageText: '消息文案',
  messageType: '消息类型',
  placement: '弹出方向',
  offset: '主轴偏移',
  crossAxisOffset: '交叉轴偏移',
  showAdd: '显示 Add',
  addLabel: 'Add 文案',
  widthMode: '容器宽度',
  width: '固定宽度',
  align: '对齐',
  heightMode: '容器高度',
  height: '高度值',
  maxHeight: '最大高度',
  itemCount: '行数',
  boxSelectionMode: '选择模式',
  editBoxIndex: '编辑行',
  boxType: '类型',
  label: '文案',
  showCheckbox: '复选框',
  checked: '选中',
  showReddot: '红点',
  showCascader: '级联箭头',
  expanded: '展开态',
  boxKind: '盒子插槽',
} as const;

export const showcaseDisabledLabel = '禁用';
export const showcaseLoadingLabel = '加载';

export function propLabelRows<K extends string>(
  keys: readonly K[],
  labels: Record<K, string>,
): PropLabelRow<K>[] {
  return keys.map((key) => ({ key, label: labels[key] }));
}

export function propLabelSelectOptions<K extends string>(
  keys: readonly K[],
  labels: Record<K, string>,
): SelectOption[] {
  return propLabelRows(keys, labels).map((row) => ({ value: row.key, label: row.label }));
}

export const buttonSizeRows = propLabelRows(
  ['lg', 'md', 'sm', 'xs'] as const,
  showcaseSizeLabels,
);

export const buttonVariantRows = propLabelRows(
  ['solid', 'outline', 'text'] as const,
  showcaseVariantLabels,
);

export const buttonToneRows = propLabelRows(
  ['brand', 'danger', 'decor', 'subtle', 'sameWhite'] as const,
  showcaseButtonToneLabels,
);

export const iconShapeRows = propLabelRows(
  ['rectangular', 'square', 'round'] as const,
  showcaseIconShapeLabels,
);

export const linkToneRows = propLabelRows(['brand', 'theme', 'decor'] as const, showcaseLinkToneLabels);

export const linkSizeRows = propLabelRows(['lg', 'md', 'sm'] as const, showcaseLinkSizeLabels);

export const paginationKindRows = propLabelRows(
  ['number', 'symbol', 'button', 'borderArrow'] as const,
  showcasePaginationKindLabels,
);

export const paginationToneRows = propLabelRows(
  ['decor', 'brand'] as const,
  showcasePaginationToneLabels,
);

export const inputSizeRows = propLabelRows(['sm', 'md', 'lg'] as const, showcaseInputSizeLabels);

export const inputTypeRows = propLabelRows(
  ['standard', 'amount'] as const,
  showcaseInputTypeLabels,
);

export const placementRows = propLabelRows(
  ['top', 'bottom', 'left', 'right'] as const,
  showcasePlacementLabels,
);

export const triggerRows = propLabelRows(['click', 'hover'] as const, showcaseTriggerLabels);

export const alignStartEndRows = propLabelRows(['start', 'end'] as const, showcaseAlignLabels);

export const widthModeAdaptiveFixedRows = propLabelRows(
  ['adaptive', 'fixed'] as const,
  showcaseWidthModeLabels,
);

export const widthModeTriggerFixedAdaptiveRows = propLabelRows(
  ['trigger', 'fixed', 'adaptive'] as const,
  showcaseWidthModeLabels,
);

export const widthModeFixedFullRows = propLabelRows(['fixed', 'full'] as const, showcaseWidthModeLabels);

export const heightModeRows = propLabelRows(['adaptive', 'fixed'] as const, showcaseHeightModeLabels);

export const flotationTriggerStyleRows = propLabelRows(
  ['subtle', 'outline', 'text'] as const,
  showcaseFlotationTriggerStyleLabels,
);

export const flotationBoxTypeRows = propLabelRows(
  ['text', 'symbol-text', 'image-text'] as const,
  showcaseFlotationBoxTypeLabels,
);

export const directionLeftRightRows = propLabelRows(['left', 'right'] as const, showcaseDirectionLabels);

export const iconButtonEventRows = propLabelRows(
  ['full', 'default', 'hover', 'active', 'focus'] as const,
  showcaseIconButtonEventLabels,
);

/** EgButton 默认 size=lg */
export const buttonHeroPreviewLabel = showcaseSizeLabels.lg;

/** EgInput 默认 size=md */
export const inputHeroPreviewLabel = showcaseInputSizeLabels.md;
