import {
  AVATAR_NATIVE_PALETTE_SIZE,
  EG_SWITCH_DEFAULT_SIZE,
  EG_TOGGLE_MARK_DEFAULT_SIZE,
  formatAvatarPaletteName,
} from '@eds/mobile-components';

import {
  defaultBlurGlassCustomizeState,
  defaultScrollEdgeCustomizeState,
  blurGlassCustomizeControls,
  scrollEdgeCustomizeControls,
  resolveScrollEdgeStyle,
} from '@/data/tokens/glassEffectCustomizeModel';
import { SHOWCASE_SCROLL_EDGE_EG_SLUG } from '@/data/components/showcaseInfraCatalog';

import type { DocCustomizeControl, DocPropRow } from './types.js';
import { buildRnSelfClosingSnippet } from './buildRnUsageSnippet.js';
import {
  buildMenuSectionsFromCustomize,
  menuCustomizeControls,
  menuCustomizeDefaults,
  resolveMenuDefaultSelectedId,
  stripMenuCustomizeMeta,
} from './menuCustomizeModel.js';
import {
  buildSheetsUsageSnippet,
  SCROLL_EDGE_EFFECT_OPTIONS,
  sheetsCustomizeControls,
  sheetsCustomizeDefaults,
} from './sheetsCustomizeModel.js';
import {
  dataListComponentCustomizeControls,
  dataListCustomizeDefaults,
  dataListSlotCustomizeCards,
  isDataListRowCountBusiness,
  readDataListRowCount,
} from './dataListCustomizeModel.js';
import {
  itemComponentCustomizeControls,
  itemCustomizeDefaults,
  itemSlotCustomizeControls,
} from './itemCustomizeModel.js';
import { tagCustomizeControls, tagCustomizeDefaults } from './tagCustomizeModel.js';
import {
  buildEgSegmentedControlPreviewSegments,
  buildEgTogglePreviewItems,
  buildEgTabPreviewItems,
  readTabSegmentCount,
  segmentedControlCustomizeControls,
  segmentedControlCustomizeDefaults,
  stripTabSlideCustomizeMeta,
  tabSlideCustomizeControls,
  tabSlideCustomizeDefaults,
} from './tabCustomizeModel.js';
import {
  buildTabBarTextDefaultSelectedOptions,
  readTabBarTextTabCount,
  stripTabBarTextCustomizeMeta,
  tabBarTextCustomizeControls,
  tabBarTextCustomizeDefaults,
} from './tabBarTextCustomizeModel.js';
import {
  pageBodyCustomizeControls,
  pageBodyCustomizeDefaults,
  pageBodyCustomizeSummary,
} from './pageBodyCustomizeModel.js';
import { switchCustomizeControls, switchCustomizeDefaults } from './switchCustomizeModel.js';
import {
  toggleMarkCustomizeControls,
  toggleMarkCustomizeDefaults,
} from './toggleMarkCustomizeModel.js';
import {
  BUTTON_OPTION_LABEL_STYLES,
  BUTTON_SHOWCASE_SIZES,
  BUTTON_SHOWCASE_TONES,
  BUTTON_SHOWCASE_VARIANTS,
  BUTTON_SHOWCASE_WIDTHS,
  buttonShowcaseDefaults,
  buttonShowcaseExportForTone,
  buttonShowcaseVariantToFigmaType,
  resolveButtonShowcaseVariantOptions,
  LINK_BUTTON_SHOWCASE_TONES,
  type ButtonShowcaseTone,
} from './buttonShowcaseModel.js';
import {
  SHOWCASE_AVATAR_SIZE_OPTIONS,
  SHOWCASE_AVATAR_SIZE_OPTIONS_TO_2XL,
  SHOWCASE_SIZE_OPTIONS_LG_TO_SM,
  SHOWCASE_SIZE_OPTIONS_LG_TO_XS,
  SHOWCASE_SIZE_OPTIONS_XL_TO_XS,
  SHOWCASE_SYMBOL_SIZE_OPTIONS,
} from './showcaseSizeOptions.js';

export type RnDocConfig = {
  componentTag: string;
  /** Catalog preview slug (playground ComponentDetailScreen). */
  previewSlug: string;
  previewMode?: 'slug' | 'family';
  family?: string;
  importCode: string;
  customizeDefaults: Record<string, unknown>;
  customizeControls: DocCustomizeControl[];
  /** 插槽定制（如 EgDataList）· 独立「插槽」卡片。 */
  customizeSlotControls?: DocCustomizeControl[];
  /** 插槽 / 内容 — 多张子卡片 · 优先于 `customizeSlotControls` 单卡。 */
  customizeSlotCards?: DocCustomizeControl[][];
  /** 多卡区块 DocSection 标题 · 默认「插槽」。 */
  customizeSlotSectionTitle?: string;
  /** Menu — 分组切换 + 添加分组，而非一次展示全部组。 */
  customizeLayout?: 'menu-sections';
  propRows: DocPropRow[];
  buildUsageSnippet?: (state: Record<string, unknown>) => string;
  propQueryKeys?: string[];
};

const FIELD_EVENTS = [
  { value: 'default', label: '默认' },
  { value: 'entering', label: '输入中' },
  { value: 'done', label: '已完成' },
  { value: 'tap', label: '点击' },
  { value: 'disable', label: '禁用' },
] as const;

const CONTROL_SIZES = SHOWCASE_SIZE_OPTIONS_XL_TO_XS;

const fieldCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: [...CONTROL_SIZES],
  },
  {
    kind: 'select',
    key: 'event',
    label: '交互',
    options: [...FIELD_EVENTS],
  },
  { kind: 'text', key: 'placeholder', label: '占位符' },
  { kind: 'boolean', key: 'disabled', label: '禁用' },
];

const fieldCustomizeDefaults = {
  size: 'xl',
  event: 'default',
  placeholder: 'Input',
  disabled: false,
} as const;

const fieldPropRows: DocPropRow[] = [
  { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'xl'", description: '控件尺寸' },
  { name: 'event', type: 'FieldEvent', defaultValue: 'undefined', description: '视觉交互态' },
  { name: 'placeholder', type: 'string', defaultValue: 'undefined', description: '占位文案' },
  { name: 'value', type: 'string', defaultValue: 'undefined', description: '受控值' },
  { name: 'defaultValue', type: 'string', defaultValue: 'undefined', description: '非受控初始值' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
  { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
];

const menuCustomizeDefaultsSnapshot = { ...menuCustomizeDefaults };

function menuBodyDoc(): RnDocConfig {
  const defaults = { ...menuCustomizeDefaultsSnapshot };
  return {
    componentTag: 'EgMenu',
    previewSlug: 'menu-body',
    importCode: `// 触发器：默认 EgGlassCapsule 胶囊，或 trigger 插槽
import { EgMenu } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: menuCustomizeControls,
    customizeLayout: 'menu-sections',
    propRows: [
      { name: 'sections', type: 'EgMenuSection[]', defaultValue: '—', description: '分组 · title? + items' },
      { name: 'items', type: 'EgMenuItem[]', defaultValue: '—', description: '单段菜单（兼容）' },
      { name: 'trigger', type: 'ReactNode | (ctx) => ReactNode', defaultValue: 'EgGlassCapsule 胶囊', description: '触发器插槽' },
      { name: 'triggerIcon', type: 'string', defaultValue: "'eds-more-ios'", description: '默认玻璃胶囊 symbol' },
      { name: 'selectedId', type: 'string', defaultValue: 'undefined', description: '受控选中 id' },
      { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: '默认玻璃触发器尺寸' },
      { name: 'forceRnImplementation', type: 'boolean', defaultValue: 'false', description: '强制 RN 浮层（跳过 iOS 系统 Menu）' },
      { name: 'placement', type: "'top' | 'bottom'", defaultValue: "'bottom'", description: '出现方向 · 盖住触发器' },
      { name: 'align', type: "'start' | 'center' | 'end'", defaultValue: "'start'", description: '水平对齐' },
      { name: 'menuWidth', type: 'number', defaultValue: '268', description: '浮层宽度 (px)' },
      { name: 'menuMaxHeight', type: 'number', defaultValue: '580', description: '浮层最大高度 (px)' },
    ],
    propQueryKeys: [
      'triggerVariant',
      'triggerSlotLabel',
      'size',
      'triggerIcon',
      'disabled',
      'placement',
      'align',
      'forceRnImplementation',
      'menuWidth',
      'menuMaxHeight',
      'sectionCount',
      'showItemIcon',
    ],
    buildUsageSnippet: (state) => {
      const merged = { ...defaults, ...state };
      const sections = buildMenuSectionsFromCustomize(merged);
      const preview = stripMenuCustomizeMeta({
        ...merged,
        sections,
        defaultSelectedId: resolveMenuDefaultSelectedId(merged, sections),
      });
      return buildRnSelfClosingSnippet('EgMenu', preview, {
        defaults: stripMenuCustomizeMeta(defaults),
      });
    },
  };
}

function sheetsBodyDoc(): RnDocConfig {
  return {
    componentTag: 'EgSheets',
    previewSlug: 'sheets-body',
    importCode: `// 卡片 EgGlass glass-sheets-box · 遮罩 effect-sheets-background / material-base-tertiary · EgNavBar · EdsSemanticAnima('sheets')
import { EgSheets } from '@eds/mobile-components';`,
    customizeDefaults: { ...sheetsCustomizeDefaults },
    customizeControls: sheetsCustomizeControls,
    propRows: [
      { name: 'visible', type: 'boolean', defaultValue: '—', description: '是否呈现' },
      { name: 'onDismiss', type: '() => void', defaultValue: '—', description: '收起动画结束后回调' },
      { name: 'detents', type: "('small' | 'medium' | 'adaptive' | 'large')[]", defaultValue: "['medium', 'large']", description: '档位 · 小 28% / 中 50% · 自适应 = 顶栏 + 内容（上限同 large）· 大 = 顶边贴系统条（safe area top）spacing-0' },
      { name: 'initialDetent', type: "'small' | 'medium' | 'adaptive' | 'large'", defaultValue: "'medium'", description: '打开时档位' },
      { name: 'detent', type: "'small' | 'medium' | 'adaptive' | 'large'", defaultValue: 'undefined', description: '受控档位 · 变化即弹簧吸附' },
      { name: 'onDetentChange', type: '(detent) => void', defaultValue: 'undefined', description: '拖拽吸附到新档位' },
      { name: 'title', type: 'string', defaultValue: 'undefined', description: '顶部 EgNavBar 标题 · 顶栏悬浮于内容上，背景 auto（滚动时显现）' },
      { name: 'showTitle', type: 'boolean', defaultValue: 'true', description: '显示标题' },
      { name: 'showLeft', type: 'boolean', defaultValue: 'false', description: '显示左侧返回 · 按钮由 EDS 锁定（eds-arrow-left-ios），业务侧禁止修改 / 替换' },
      { name: 'onBack', type: '() => void', defaultValue: 'undefined', description: '左侧返回点击回调' },
      { name: 'showRight', type: 'boolean', defaultValue: 'true', description: '显示右侧关闭 · 按钮由 EDS 锁定（eds-close，点击收起），业务侧禁止修改 / 替换' },
      {
        name: 'flushToEdges',
        type: 'boolean',
        defaultValue: 'false',
        description: '贴边 · 开启后各档位左右及底外边距为 0（默认关 · 浮动 inset）',
      },
      { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: '遮罩点击 / 下拉 / 系统返回可收起' },
      { name: 'showDragIndicator', type: 'boolean', defaultValue: 'false', description: '顶部拖拽指示条 · 叠在卡片顶缘，不侵占 NavBar 顶边距' },
      { name: 'scrollEdgeEffect', type: "'automatic' | 'hard' | 'soft' | 'hidden'", defaultValue: "'soft'", description: '顶栏 scroll edge · 静止 hidden，内容滚入栏下后用此样式（默认 soft）· iOS 26+ 系统 Scroll Edge · iOS 26 以下遮罩浅 · Android 遮罩深 · automatic 按 Sheet 解析为 hard' },
      { name: 'children', type: 'ReactNode', defaultValue: 'undefined', description: '内容插槽 · 顶栏下方滚动区；最高档可滚动，自适应档按其高度定档' },
      { name: 'actions', type: 'ReactNode', defaultValue: 'undefined', description: '底部 action 插槽 · 始终贴当前档位底边；缺省一个 EgBrandButton「确认」（点击收起），传入即替换，按钮数量 / 样式 / 组合由业务自定义' },
      { name: 'showActions', type: 'boolean', defaultValue: 'true', description: '显示底部 action 插槽' },
      {
        name: 'actionsBlankCompensation',
        type: 'EgSheetsActionsBlankCompensation',
        defaultValue: 'undefined',
        description:
          '留白补偿 · `showActions` 且 detents 含 `adaptive` 时从自适应高度扣减对应 spacing（px）；未传则保持既有算法',
      },
      { name: 'contentStyle', type: 'StyleProp<ViewStyle>', defaultValue: 'undefined', description: '内容插槽容器样式（默认左右 / 底部 spacing-5）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: Object.keys(sheetsCustomizeDefaults),
    buildUsageSnippet: buildSheetsUsageSnippet,
  };
}

function pageBodyDoc(): RnDocConfig {
  return {
    componentTag: 'EgPage',
    previewSlug: 'page-body',
    importCode: `// EgPage 本体 + motion-page 栈（业务入口，非直接 EgEdsAnimaPage）
import {
  createEgPageNavigator,
  egPageScreenOptions,
  EgPage,
} from '@eds/mobile-components';`,
    customizeDefaults: pageBodyCustomizeDefaults,
    customizeControls: pageBodyCustomizeControls,
    propRows: [
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题 · 页面底色 box-page' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '滚动内容插槽' },
      {
        name: 'contentPaddingTop',
        type: 'number',
        defaultValue: '12（lg）',
        description: '顶边距（px）· 导航占位之后；未传默认 lg。Customize 档位 xs–2xl / 自定义',
      },
      {
        name: 'contentPaddingHorizontal',
        type: 'number',
        defaultValue: '20（spacing-5）',
        description: '左右边距 · 未传用 token 默认；`contentContainerStyle` 可覆盖',
      },
      {
        name: 'contentPaddingBottom',
        type: 'number',
        defaultValue: '40（spacing-10）',
        description: '底边距 · 未传用 token 默认；`contentContainerStyle` 可覆盖',
      },
      {
        name: 'scrollTopInset',
        type: 'number',
        defaultValue: 'undefined',
        description: '顶栏占位（不含顶边距）· iOS 26+ automatic 时忽略',
      },
      {
        name: 'contentInsetAdjustmentBehavior',
        type: "'automatic' | 'never'",
        defaultValue: "'automatic'",
        description: 'iOS 26+ 系统栏 automatic；RN 顶栏留白时 never',
      },
      { name: 'contentContainerStyle', type: 'StyleProp<ViewStyle>', defaultValue: 'undefined', description: '业务样式最后合并 · 同名字段以业务为准' },
      { name: 'onScroll', type: 'ScrollView props', defaultValue: 'useEgNavBarScroll()', description: '与顶栏 background="auto" 联动' },
      {
        name: 'nativeScrollEdge',
        type: 'boolean',
        defaultValue: 'true',
        description:
          'iOS 26+ 由本页滚动驱动系统 scroll edge（静止 hidden · 滚入 soft）；页根须 EgPage 为首 ScrollView',
      },
    ],
    propQueryKeys: ['mode', 'contentPaddingTopPreset', 'contentPaddingTopCustom'],
    buildUsageSnippet: (state) => {
      const top = pageBodyCustomizeSummary(state ?? pageBodyCustomizeDefaults);
      return `const Stack = createEgPageNavigator<ParamList>();
<Stack.Navigator screenOptions={egPageScreenOptions({ mode: 'light' })}>
  …
</Stack.Navigator>
<EgPage mode="light" contentPaddingTop={/* ${top} */}>
  {/* 默认 左右 20 · 底 40 · 顶边距可 contentPaddingTop 或 contentContainerStyle 覆盖 */}
</EgPage>`;
    },
  };
}

function pageShotBodyDoc(): RnDocConfig {
  return {
    componentTag: 'EgPageShot',
    previewSlug: 'page-shot-body',
    importCode: `// motion-page-shot · 根页须 EgPageShotContent（收回触发卡片含滚后 scroll 同轨已内建）
import { EgPageShot, EgPageShotContent, EgPageShotTrigger } from '@eds/mobile-components';`,
    customizeDefaults: { mode: 'light' },
    customizeControls: [],
    propRows: [
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
      { name: 'renderRoot', type: '(api) => ReactNode', defaultValue: '—', description: '弹层根页 · api.topInset / scrollTopInset / push / close' },
      { name: 'renderPage', type: '(api) => ReactNode', defaultValue: 'undefined', description: '弹层内 motion-page 子页' },
      { name: 'title', type: '(source, pageKey) => string', defaultValue: 'undefined', description: 'NavBar 标题' },
      { name: 'scrollEdgeEffect', type: "'automatic' | 'hard' | 'soft' | 'hidden'", defaultValue: 'undefined', description: '顶栏 scroll edge' },
      { name: 'children', type: 'ReactNode', defaultValue: '—', description: '下层页面 + EgPageShotTrigger' },
    ],
    propQueryKeys: ['mode'],
    buildUsageSnippet: () => `<EgPageShot mode="light" renderRoot={(api) => (
  <EgPageShotContent mode="light" api={api}>{/* Hero + 正文 */}</EgPageShotContent>
)}>
  <EgPageShotTrigger id="card" radius={20}>{/* 触发元素 */}</EgPageShotTrigger>
</EgPageShot>`,
  };
}

function itemBodyDoc(): RnDocConfig {
  return {
    componentTag: 'EgItem',
    previewSlug: 'item-body',
    importCode: `import { EgItem, EgItemGroup, EgSymbol } from '@eds/mobile-components';`,
    customizeDefaults: { ...itemCustomizeDefaults },
    customizeControls: itemComponentCustomizeControls,
    customizeSlotControls: itemSlotCustomizeControls,
    propRows: [
      { name: 'label', type: 'string', defaultValue: '—', description: '主文案 · typography-body-medium' },
      { name: 'labelHeavy', type: 'boolean', defaultValue: 'false', description: '主文案 · typography-body-medium-heavy' },
      {
        name: 'subLabel',
        type: 'string',
        defaultValue: 'undefined',
        description: '主文案下副文本 · typography-body-small · text-base-secondary · 间距 EG_ITEM_SUB_LABEL_GAP（spacing-05）',
      },
      { name: 'value', type: 'string', defaultValue: 'undefined', description: '右侧附属说明 · typography-body-small' },
      {
        name: 'icon',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description:
          '左侧图形 · 槽 symbol-md（22px）· 描边 stroke-lg · 推荐 `<EgSymbol size="md" strokeScaleToken="stroke-lg" />`',
      },
      {
        name: 'trailingEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: '右侧挂件总开关',
      },
      {
        name: 'trailingDisplay',
        type: "'icon' | 'menu' | 'switch' | 'custom'",
        defaultValue: "'icon'",
        description:
          '显示 — icon：`eds-arrow-right-mini-ios`（stroke-xl · stroke-base-tertiary）；menu：排序箭头同上 + `EgMenu`；switch：`EgSwitch`；custom：`trailing` 插槽',
      },
      { name: 'showChevron', type: 'boolean', defaultValue: 'true', description: '`icon` — 无 value 时右箭头；有 value 时与附属说明同排' },
      { name: 'menuItems', type: 'EgMenuItem[]', defaultValue: 'undefined', description: '`menu` — 选项' },
      { name: 'selectedMenuId', type: 'string', defaultValue: 'undefined', description: '`menu` — 当前选中' },
      { name: 'onMenuSelect', type: '(id, item) => void', defaultValue: 'undefined', description: '`menu` — 选中回调' },
      { name: 'switchValue', type: 'boolean', defaultValue: 'undefined', description: '`switch` — 受控' },
      { name: 'defaultSwitchValue', type: 'boolean', defaultValue: 'false', description: '`switch` — 非受控默认' },
      { name: 'onSwitchValueChange', type: '(value) => void', defaultValue: 'undefined', description: '`switch` — 切换回调' },
      { name: 'trailing', type: 'ReactNode', defaultValue: 'undefined', description: '`custom` — 右侧自定义插槽' },
      {
        name: 'padSize',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'lg'",
        description:
          '行密度 · sm=spacing-2·8px · md=spacing-3·12px · lg=spacing-4·16px · 默认 lg',
      },
      { name: 'showDivider', type: 'boolean', defaultValue: 'true', description: 'module 分割线 · 缩进对齐文案' },
      { name: 'onPress', type: '() => void', defaultValue: 'undefined', description: '`icon` 点按 · event-tap + 缩放 xs' },
      { name: 'pressIntensity', type: "'xs' | 'sm' | 'md'", defaultValue: "'xs'", description: '点按缩放' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: Object.keys(itemCustomizeDefaults),
    buildUsageSnippet: (state) => {
      const trailing = state.widgetEnabled !== false;
      const valueAttr =
        trailing && state.accessoryDetailEnabled === true ? `\n  value="默认"` : '';
      const trailingDisplay = String(state.trailingDisplay ?? 'icon');
      const displayAttr = trailing ? `\n  trailingDisplay="${trailingDisplay}"` : '';
      const trailingOffAttr = trailing ? '' : '\n  trailingEnabled={false}';
      const iconName = state.iconName === 'none' ? '' : String(state.iconName ?? 'eds-pentagram');
      const iconBlock = iconName
        ? `\n  icon={<EgSymbol name="${iconName}" size="md" strokeScaleToken="stroke-lg" />}`
        : '';
      const menuBlock =
        trailing && trailingDisplay === 'menu'
          ? `\n  menuItems={[…]}\n  selectedMenuId="…"\n  onMenuSelect={…}`
          : '';
      const switchBlock =
        trailing && trailingDisplay === 'switch'
          ? `\n  switchValue={…}\n  onSwitchValueChange={…}`
          : '';
      const customBlock = trailing && trailingDisplay === 'custom' ? `\n  trailing={<… />}` : '';
      const pressBlock = trailing && trailingDisplay === 'icon' ? '\n  onPress={…}' : '';
      const subLabelAttr =
        state.subLabelEnabled === true && String(state.subLabel ?? '').trim()
          ? `\n  subLabel="${String(state.subLabel).trim()}"`
          : '';
      const padSize = String(state.padSize ?? 'lg');
      const padSizeAttr = padSize !== 'lg' ? `\n  padSize="${padSize}"` : '';
      return `<EgItemGroup>\n  <EgItem\n    label="${String(state.label ?? 'Label')}"${subLabelAttr}${padSizeAttr}${valueAttr}${trailingOffAttr}${displayAttr}${iconBlock}${menuBlock}${switchBlock}${customBlock}${pressBlock}\n  />\n</EgItemGroup>`;
    },
  };
}

function dataListBodyDoc(): RnDocConfig {
  return {
    componentTag: 'EgDataList',
    previewSlug: 'data-list-body',
    importCode: `// 父级 Scene 须有 spacing-5 水平 padding；列表区 DL-bleed
import { EgDataList, EgDataListMessage, EgDataListReddot, EgDataListRow } from '@eds/mobile-components';`,
    customizeDefaults: { ...dataListCustomizeDefaults },
    customizeControls: dataListComponentCustomizeControls,
    customizeSlotCards: dataListSlotCustomizeCards,
    customizeSlotSectionTitle: '内容',
    propRows: [
      { name: 'children', type: 'EgDataListRow[]', defaultValue: '—', description: '数据行 · 行壳（外 spacing-2 / 内 spacing-3）+ 内容插槽 children' },
      { name: 'sceneContentInset', type: 'number', defaultValue: '20', description: 'Scene 水平 inset · 默认 spacing-5' },
      { name: 'rowGap', type: 'number', defaultValue: '4', description: '行间距 · spacing-1（EG_DATA_LIST_ROW_GAP）' },
      {
        name: 'layout',
        type: 'EgDataListRowLayout',
        defaultValue: 'getEgDataListRowLayout()',
        description:
          '行几何 · pad spacing-3 · margin spacing-2 · 图形↔文本 spacing-3（12px）· 副文本最多 2 行（EG_DATA_LIST_SUB_TEXT_MAX_LINES）· 圆角 radius-md · 行高=上下 pad+插槽（无固定高度）',
      },
      { name: 'axis', type: "'row' | 'column'", defaultValue: "'row'", description: 'EgDataListRow 主轴' },
      { name: 'onPress', type: '() => void', defaultValue: 'undefined', description: 'Tap · 触发点按底与缩放' },
      {
        name: 'onLongPress',
        type: '() => void',
        defaultValue: 'undefined',
        description: '长按 · 须 `touchGestureEnabled`（滑动/拖拽不触发）',
      },
      { name: 'pressHapticEnabled', type: 'boolean', defaultValue: 'false', description: '点按触觉反馈 · 默认关' },
      { name: 'touchGestureEnabled', type: 'boolean', defaultValue: 'false', description: '长按手势 · 默认关' },
      { name: 'interactive', type: 'boolean', defaultValue: 'true', description: '点按底 + 缩放' },
      { name: 'pressIntensity', type: "'xs' | 'sm' | 'md' | 'lg'", defaultValue: "'xs'", description: '点按缩放档位' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: [
      'graphicEnabled',
      'graphicSize',
      'graphicType',
      'iconSymbolSize',
      'primaryWeight',
      'primaryTagEnabled',
      'subBoldSegment',
      'descriptionEnabled',
      'widgetEnabled',
      'widgetShowTime',
      'widgetShowTag',
      'widgetSlotEnabled',
      'widgetShowCustom',
      'widgetShowSwitch',
      'widgetShowArrow',
      'widgetShowMessage',
      'widgetShowRedDot',
      'rowCount',
      'interactive',
      'pressIntensity',
      'pressHapticEnabled',
      'touchGestureEnabled',
    ],
    buildUsageSnippet: (state) => {
      if (isDataListRowCountBusiness(state)) {
        return `<EgDataList>
  {items.map((item) => (
    <EgDataListRow key={item.id} accessibilityLabel={item.label} onPress={…}>
      …
    </EgDataListRow>
  ))}
</EgDataList>`;
      }
      const rows = readDataListRowCount(state);
      return `<EgDataList>\n${Array.from({ length: rows }, (_, i) => `  <EgDataListRow accessibilityLabel="Row ${i + 1}" onPress={…}>…</EgDataListRow>`).join('\n')}\n</EgDataList>`;
    },
  };
}

function menuTriggerSceneDoc(): RnDocConfig {
  const defaults = { ...menuCustomizeDefaultsSnapshot };
  return {
    componentTag: 'EgMenuTrigger',
    previewSlug: 'dropdown-trigger',
    importCode: `// 场景化 — Menu 触发器（胶囊 / 插槽）
import { EgMenuTrigger } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: menuCustomizeControls,
    customizeLayout: 'menu-sections',
    propRows: [
      { name: 'trigger', type: 'ReactNode | (ctx) => ReactNode', defaultValue: 'EgGlassCapsule 胶囊', description: '触发器插槽' },
      { name: 'triggerIcon', type: 'string', defaultValue: "'eds-more-ios'", description: '默认玻璃胶囊 symbol' },
      { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: '胶囊尺寸' },
      { name: 'sections', type: 'EgMenuSection[]', defaultValue: '演示分组', description: '菜单分组' },
      { name: 'placement', type: "'top' | 'bottom'", defaultValue: "'bottom'", description: '出现方向' },
      { name: 'align', type: "'start' | 'center' | 'end'", defaultValue: "'start'", description: '水平对齐' },
      { name: 'menuWidth', type: 'number', defaultValue: '268', description: '浮层宽度 (px)' },
      { name: 'menuMaxHeight', type: 'number', defaultValue: '580', description: '浮层最大高度 (px)' },
    ],
    propQueryKeys: [
      'triggerVariant',
      'triggerSlotLabel',
      'size',
      'triggerIcon',
      'disabled',
      'placement',
      'align',
      'forceRnImplementation',
      'menuWidth',
      'menuMaxHeight',
      'sectionCount',
      'showItemIcon',
    ],
    buildUsageSnippet: (state) => {
      const merged = { ...defaults, ...state };
      const sections = buildMenuSectionsFromCustomize(merged);
      const preview = stripMenuCustomizeMeta({
        ...merged,
        sections,
        defaultSelectedId: resolveMenuDefaultSelectedId(merged, sections),
      });
      return buildRnSelfClosingSnippet('EgMenuTrigger', preview, {
        defaults: stripMenuCustomizeMeta(defaults),
      });
    },
  };
}

const textareaCustomizeDefaults = {
  ...fieldCustomizeDefaults,
  placeholder: 'Textarea',
  showBackground: true,
} as const;

const textareaCustomizeControls: DocCustomizeControl[] = [
  ...fieldCustomizeControls,
  { kind: 'boolean', key: 'showBackground', label: '背景' },
];

const textareaPropRows: DocPropRow[] = [
  ...fieldPropRows,
  {
    name: 'showBackground',
    type: 'boolean',
    defaultValue: 'true',
    description: '浅底 material-card-moderate；关 → material-hide',
  },
];

function fieldDoc(
  componentTag: string,
  previewSlug: string,
  placeholder: string,
): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...fieldCustomizeDefaults, placeholder },
    customizeControls: fieldCustomizeControls,
    propRows: fieldPropRows,
    propQueryKeys: ['size', 'event', 'placeholder', 'disabled'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, {
        defaults: { ...fieldCustomizeDefaults, placeholder },
      }),
  };
}

function textareaFieldDoc(componentTag: string, previewSlug: string): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...textareaCustomizeDefaults },
    customizeControls: textareaCustomizeControls,
    propRows: textareaPropRows,
    propQueryKeys: ['size', 'event', 'placeholder', 'disabled', 'showBackground'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, {
        defaults: { ...textareaCustomizeDefaults },
      }),
  };
}

const buttonCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: '色调',
    options: [...BUTTON_SHOWCASE_TONES],
  },
  {
    kind: 'select',
    key: 'labelStyle',
    label: '风格',
    options: [...BUTTON_OPTION_LABEL_STYLES],
    visibleWhen: (state) => state.tone === 'option',
  },
  {
    kind: 'select',
    key: 'variant',
    label: '风格',
    options: [...BUTTON_SHOWCASE_VARIANTS],
    resolveOptions: (state) => [...resolveButtonShowcaseVariantOptions(String(state.tone ?? 'brand'))],
    visibleWhen: (state) => state.tone !== 'option',
  },
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: [...BUTTON_SHOWCASE_SIZES],
  },
  {
    kind: 'select',
    key: 'width',
    label: '宽度',
    options: [...BUTTON_SHOWCASE_WIDTHS],
  },
  { kind: 'text', key: 'label', label: '文案' },
  { kind: 'boolean', key: 'disabled', label: '禁用' },
  { kind: 'boolean', key: 'loading', label: '加载中' },
  {
    kind: 'boolean',
    key: 'active',
    label: '选中',
    visibleWhen: (state) => state.tone === 'option',
  },
];

const TAG_SIZES = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
] as const;

function egTagDoc(componentTag: string, previewSlug: string): RnDocConfig {
  const defaults = { ...tagCustomizeDefaults };
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: tagCustomizeControls,
    propRows: [
      {
        name: 'family',
        type: "'system' | 'status' | 'colorful' | 'custom'",
        defaultValue: "'system'",
        description: '类型 · 系统 / 状态 / 彩色 / 商业',
      },
      {
        name: 'variant',
        type: "'subtle' | 'solid-brand' | 'solid-red' | 'gray' | 'stroke-subtle' | 'stroke-solid'",
        defaultValue: "'subtle'",
        description: '样式 · 仅 family=system',
      },
      {
        name: 'status',
        type: 'TagStatus',
        defaultValue: "'danger'",
        description: '状态色 · family=status',
      },
      { name: 'colorfulStyle', type: 'TagColorfulStyle', defaultValue: "'apricot'", description: '彩色 · family=colorful' },
      { name: 'customStyle', type: 'TagCustomStyle', defaultValue: "'vermilion'", description: '商业 · family=custom' },
      { name: 'shape', type: "'round' | 'square'", defaultValue: "'round'", description: '圆角：radius-full · scale-1' },
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'sm'", description: '尺寸' },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '标签文案' },
    ],
    propQueryKeys: [
      'family',
      'variant',
      'status',
      'colorfulStyle',
      'customStyle',
      'shape',
      'size',
      'label',
    ],
    buildUsageSnippet: (state) => buildRnSelfClosingSnippet(componentTag, state, { defaults }),
  };
}

function colorTagAltDoc(componentTag: string, previewSlug: string): RnDocConfig {
  const defaults = { label: 'Tag', colorType: 'green', size: 'md' } as const;
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...defaults },
    customizeControls: [
      { kind: 'text', key: 'label', label: '文案' },
      {
        kind: 'select',
        key: 'colorType',
        label: '颜色',
        options: [
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' },
          { value: 'orange', label: 'Orange' },
          { value: 'red', label: 'Red' },
        ],
      },
      { kind: 'select', key: 'size', label: '尺寸', options: [...TAG_SIZES] },
    ],
    propRows: [
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '标签文案' },
      { name: 'colorType', type: 'ColorTagType', defaultValue: "'green'", description: 'Colorful 色板' },
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
    ],
    propQueryKeys: ['label', 'colorType', 'size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults: { ...defaults } }),
  };
}

function systemTagDoc(componentTag: string, previewSlug: string): RnDocConfig {
  const defaults = { label: 'Tag', systemType: 'subtle', size: 'md' } as const;
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...defaults },
    customizeControls: [
      { kind: 'text', key: 'label', label: '文案' },
      {
        kind: 'select',
        key: 'systemType',
        label: '类型',
        options: [
          { value: 'subtle', label: 'Subtle' },
          { value: 'strokeSubtle', label: 'Stroke Subtle' },
          { value: 'stroke', label: 'Stroke' },
        ],
      },
      { kind: 'select', key: 'size', label: '尺寸', options: [...TAG_SIZES] },
    ],
    propRows: [
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '标签文案' },
      { name: 'systemType', type: 'SystemTagType', defaultValue: "'subtle'", description: '系统样式' },
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
    ],
    propQueryKeys: ['label', 'systemType', 'size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults: { ...defaults } }),
  };
}

function switchDoc(componentTag: string, previewSlug: string): RnDocConfig {
  const defaults = { ...switchCustomizeDefaults };
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [...switchCustomizeControls],
    propRows: [
      {
        name: 'size',
        type: "'lg' | 'md' | 'sm'",
        defaultValue: `'${EG_SWITCH_DEFAULT_SIZE}'`,
        description: '尺寸',
      },
      {
        name: 'value',
        type: 'boolean',
        defaultValue: '—',
        description: '受控开关态',
      },
      {
        name: 'defaultValue',
        type: 'boolean',
        defaultValue: 'false',
        description: '非受控默认',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用（开启轨 `--status-disable-brand`）',
      },
      {
        name: 'forceRnImplementation',
        type: 'boolean',
        defaultValue: 'false',
        description: '强制 EgSwitchRn（跳过 iOS 26+ 系统 UISwitch）',
      },
    ],
    propQueryKeys: ['size', 'value', 'defaultValue', 'disabled', 'forceRnImplementation'],
    buildUsageSnippet: (state) => {
      const previewState = String(state.previewState ?? 'full');
      const size = String(state.size ?? EG_SWITCH_DEFAULT_SIZE);
      const attrs: Record<string, unknown> = { size };
      if (previewState === 'full') {
        attrs.defaultValue = false;
      } else if (previewState === 'on') {
        attrs.value = true;
      } else if (previewState === 'off') {
        attrs.value = false;
      } else {
        attrs.value = true;
        attrs.disabled = true;
      }
      return buildRnSelfClosingSnippet(componentTag, attrs, {
        defaults: { size: EG_SWITCH_DEFAULT_SIZE },
      });
    },
  };
}

function toggleMarkDoc(
  componentTag: string,
  previewSlug: string,
  valueKey: 'checked' | 'decided',
  defaultKey: 'defaultChecked' | 'defaultDecided',
): RnDocConfig {
  const defaults = { ...toggleMarkCustomizeDefaults };
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [...toggleMarkCustomizeControls],
    propRows: [
      {
        name: 'size',
        type: "'lg' | 'md' | 'sm'",
        defaultValue: `'${EG_TOGGLE_MARK_DEFAULT_SIZE}'`,
        description: '尺寸',
      },
      {
        name: valueKey,
        type: 'boolean',
        defaultValue: '—',
        description: '受控选中态',
      },
      {
        name: defaultKey,
        type: 'boolean',
        defaultValue: 'false',
        description: '非受控默认',
      },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
    ],
    propQueryKeys: ['size', valueKey, defaultKey, 'disabled'],
    buildUsageSnippet: (state) => {
      const previewState = String(state.previewState ?? 'full');
      const size = String(state.size ?? EG_TOGGLE_MARK_DEFAULT_SIZE);
      const attrs: Record<string, unknown> = { size };
      if (previewState === 'full') {
        attrs[defaultKey] = false;
      } else if (previewState === 'on') {
        attrs[valueKey] = true;
      } else if (previewState === 'off') {
        attrs[valueKey] = false;
      } else {
        attrs[valueKey] = true;
        attrs.disabled = true;
      }
      return buildRnSelfClosingSnippet(componentTag, attrs, {
        defaults: { size: EG_TOGGLE_MARK_DEFAULT_SIZE },
      });
    },
  };
}

const DIVIDER_VARIANTS = [
  { value: 'module', label: 'Module (stroke-xs)' },
  { value: 'page', label: 'Page (stroke-xs)' },
] as const;

const DIVIDER_ORIENTATIONS = [
  { value: 'horizontal', label: '水平' },
  { value: 'vertical', label: '垂直' },
] as const;

function dividerDoc(): RnDocConfig {
  const componentTag = 'EgDivider';
  const defaults = {
    variant: 'page',
    orientation: 'horizontal',
    visible: true,
  } as const;
  return {
    componentTag,
    previewSlug: 'divider',
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...defaults },
    customizeControls: [
      { kind: 'select', key: 'variant', label: '类型', options: [...DIVIDER_VARIANTS] },
      { kind: 'select', key: 'orientation', label: '方向', options: [...DIVIDER_ORIENTATIONS] },
      { kind: 'boolean', key: 'visible', label: '显示' },
    ],
    propRows: [
      {
        name: 'variant',
        type: "'module' | 'page'",
        defaultValue: "'page'",
        description: 'Module / Page 场景；线宽 stroke-xs；色 stroke-divider-deep',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: '水平或垂直',
      },
      { name: 'visible', type: 'boolean', defaultValue: 'true', description: '是否渲染分割线' },
      { name: 'length', type: 'number', defaultValue: 'undefined', description: '长轴长度（px）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['variant', 'orientation', 'visible'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults: { ...defaults } }),
  };
}

const SYMBOL_ACTION_SHOWCASE_TONES = [
  { value: 'brand', label: '品牌' },
  { value: 'decor', label: '装饰' },
  { value: 'danger', label: '危险' },
  { value: 'shallow', label: '浅' },
  { value: 'plain', label: '无背景' },
] as const;

const MESSAGE_SHOWCASE_TONES = [
  { value: 'brand', label: '品牌' },
  { value: 'decor', label: '装饰' },
  { value: 'danger', label: '危险' },
  { value: 'shallow', label: '浅' },
] as const;

function messageDoc(): RnDocConfig {
  const defaults = { tone: 'brand', label: '9' };
  return {
    componentTag: 'EgMessage',
    previewSlug: 'feedback-message',
    importCode: `import { EgMessage } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'tone',
        label: '色调',
        options: [...MESSAGE_SHOWCASE_TONES],
      },
      { kind: 'text', key: 'label', label: '文案' },
    ],
    propRows: [
      {
        name: 'tone',
        type: "'brand' | 'decor' | 'danger' | 'shallow'",
        defaultValue: "'brand'",
        description: '色调 · material / status',
      },
      { name: 'label', type: 'string', defaultValue: "'9'", description: '短文案或数字' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['tone', 'label'],
    buildUsageSnippet: (state) => buildRnSelfClosingSnippet('EgMessage', state, { defaults }),
  };
}

function symbolActionDoc(): RnDocConfig {
  const defaults = {
    size: 'md',
    tone: 'brand',
    icon: 'eds-add',
    disabled: false,
    loading: false,
  };
  return {
    componentTag: 'EgSymbolAction',
    previewSlug: 'button-icon-container',
    importCode: `import { EgSymbolAction } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'tone',
        label: '色调',
        options: [...SYMBOL_ACTION_SHOWCASE_TONES],
      },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...SHOWCASE_SIZE_OPTIONS_XL_TO_XS],
      },
      { kind: 'text', key: 'icon', label: '符号' },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
      { kind: 'boolean', key: 'loading', label: '加载' },
    ],
    propRows: [
      {
        name: 'tone',
        type: "'brand' | 'decor' | 'danger' | 'shallow' | 'plain'",
        defaultValue: "'brand'",
        description: '色调 · material / status / event-tap',
      },
      {
        name: 'size',
        type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'",
        defaultValue: "'md'",
        description: '容器 scale-14…7 · 图标 symbol-md/sm/xs',
      },
      { name: 'icon', type: 'string', defaultValue: "'eds-add'", description: 'EDS icon 资源名' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '加载' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['tone', 'size', 'icon', 'disabled', 'loading'],
    buildUsageSnippet: (state) => {
      return buildRnSelfClosingSnippet('EgSymbolAction', state, { defaults });
    },
  };
}

function minimalDoc(componentTag: string, previewSlug: string): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: {},
    customizeControls: [],
    propRows: [
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
      { name: 'testID', type: 'string', defaultValue: 'undefined', description: '测试 ID' },
    ],
    propQueryKeys: [],
    buildUsageSnippet: () => buildRnSelfClosingSnippet(componentTag, {}, { defaults: {} }),
  };
}

function familyDoc(family: string): RnDocConfig {
  const title = family.replace(/-/g, ' ');
  return {
    componentTag: title,
    previewSlug: `${family}-body`,
    previewMode: 'family',
    family,
    importCode: `// Import scene components from '@eds/mobile-components'`,
    customizeDefaults: {},
    customizeControls: [],
    propRows: [
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: [],
    buildUsageSnippet: () => `// See individual scene pages under ${family}`,
  };
}

function symbolBodyDoc(): RnDocConfig {
  const defaults = {
    name: 'eds-wallet',
    size: 'lg',
    fillTone: '',
    strokeColorToken: '',
  };
  return {
    componentTag: 'EgSymbol',
    previewSlug: 'symbol-body',
    importCode: `import { EgSymbol } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'name', label: 'name（资产名）', placeholder: 'eds-wallet' },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...SHOWCASE_SYMBOL_SIZE_OPTIONS],
      },
      {
        kind: 'select',
        key: 'fillTone',
        label: 'fillTone',
        options: [
          { value: '', label: '默认' },
          { value: 'primary', label: 'primary' },
          { value: 'brand', label: 'brand' },
        ],
      },
      {
        kind: 'text',
        key: 'strokeColorToken',
        label: 'strokeColorToken',
        placeholder: 'stroke-base-primary',
      },
    ],
    propRows: [
      { name: 'name', type: 'string', defaultValue: 'required', description: 'icon/crypto 资产名' },
      { name: 'size', type: 'EgSymbolSize', defaultValue: "'md'", description: 'symbol-xs … symbol-lg' },
      { name: 'fillTone', type: "'primary' | 'brand'", defaultValue: 'undefined', description: 'token icon 填色' },
      { name: 'strokeColorToken', type: 'string', defaultValue: "'text-base-primary'", description: '描边 semantic token' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['name', 'size', 'fillTone', 'strokeColorToken'],
    buildUsageSnippet: (state) => {
      const payload: Record<string, unknown> = {
        name: state.name ?? defaults.name,
        size: state.size ?? defaults.size,
      };
      if (state.fillTone) payload.fillTone = state.fillTone;
      if (state.strokeColorToken) payload.strokeColorToken = state.strokeColorToken;
      return buildRnSelfClosingSnippet('EgSymbol', payload, {
        defaults: { name: defaults.name, size: defaults.size },
      });
    },
  };
}

function avatarBodyDoc(): RnDocConfig {
  const avatarSizeOptions = SHOWCASE_AVATAR_SIZE_OPTIONS;
  const colorIndexOptions = [
    { value: 'auto', label: '自动（按 name）' },
    ...Array.from({ length: AVATAR_NATIVE_PALETTE_SIZE }, (_, index) => ({
      value: String(index),
      label: formatAvatarPaletteName(index),
    })),
  ];
  const defaults = {
    name: 'Nancy',
    initials: '',
    size: 'lg',
    variant: 'initials',
    colorIndexMode: 'auto',
    randomColor: false,
  };
  return {
    componentTag: 'EgAvatar',
    previewSlug: 'avatar-body',
    importCode: `import { EgAvatar } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'name', label: '姓名' },
      { kind: 'text', key: 'initials', label: '缩写', placeholder: '留空则取首字' },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...avatarSizeOptions],
      },
      {
        kind: 'select',
        key: 'variant',
        label: '类型',
        options: [
          { value: 'initials', label: '首字（web3-avatar）' },
          { value: 'robot', label: 'eds-avatar-0' },
        ],
      },
      {
        kind: 'select',
        key: 'colorIndexMode',
        label: '原色盘',
        options: colorIndexOptions,
      },
      { kind: 'boolean', key: 'randomColor', label: '随机 web3-avatar' },
    ],
    propRows: [
      { name: 'name', type: 'string', defaultValue: 'undefined', description: '姓名 seed' },
      { name: 'initials', type: 'string', defaultValue: 'undefined', description: '显式首字' },
      { name: 'size', type: 'EgAvatarSize', defaultValue: "'lg'", description: '尺寸 token' },
      { name: 'variant', type: "'initials' | 'robot'", defaultValue: "'initials'", description: '首字 / 机器人' },
      { name: 'source', type: 'ImageSourcePropType', defaultValue: 'undefined', description: '图片头像（企业 Logo 等），优先于 variant' },
      { name: 'colorIndex', type: 'number', defaultValue: 'undefined', description: '0–19 原色索引' },
      { name: 'randomColor', type: 'boolean', defaultValue: 'false', description: '随机原色' },
      { name: 'colorSeed', type: 'string', defaultValue: 'undefined', description: '映射 seed' },
    ],
    propQueryKeys: ['name', 'initials', 'size', 'variant', 'colorIndexMode', 'randomColor'],
    buildUsageSnippet: (state) => {
      const payload: Record<string, unknown> = {
        name: state.name,
        size: state.size,
        variant: state.variant,
      };
      if (state.initials) payload.initials = state.initials;
      if (state.randomColor) {
        payload.randomColor = true;
      } else if (state.colorIndexMode !== 'auto') {
        payload.colorIndex = Number(state.colorIndexMode);
      }
      return buildRnSelfClosingSnippet('EgAvatar', payload, {
        defaults: { name: defaults.name, size: defaults.size, variant: defaults.variant },
      });
    },
  };
}

function avatarPreset0Doc(): RnDocConfig {
  const defaults = { size: 'lg' };
  return {
    componentTag: 'EgAvatarPreset0',
    previewSlug: 'avatar-preset-0',
    importCode: `import { EgAvatarPreset0 } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...SHOWCASE_AVATAR_SIZE_OPTIONS_TO_2XL],
      },
    ],
    propRows: [
      { name: 'size', type: 'EgAvatarSize', defaultValue: "'lg'", description: '尺寸' },
    ],
    propQueryKeys: ['size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgAvatarPreset0', state, { defaults }),
  };
}

function avatarPreset1Doc(): RnDocConfig {
  const defaults = { name: 'Nancy', size: 'lg' };
  return {
    componentTag: 'EgAvatarPreset1',
    previewSlug: 'avatar-preset-1',
    importCode: `import { EgAvatarPreset1 } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'name', label: '姓名' },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...SHOWCASE_AVATAR_SIZE_OPTIONS_TO_2XL],
      },
    ],
    propRows: [
      { name: 'name', type: 'string', defaultValue: 'undefined', description: '姓名' },
      { name: 'size', type: 'EgAvatarSize', defaultValue: "'lg'", description: '尺寸' },
    ],
    propQueryKeys: ['name', 'size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgAvatarPreset1', state, { defaults }),
  };
}

function cregisTabBarDoc(): RnDocConfig {
  const tabIndexOptions = [
    { value: '0', label: '主页' },
    { value: '1', label: '钱包' },
    { value: '2', label: '协作' },
    { value: '3', label: '交易记录' },
  ] as const;
  const defaults = { defaultSelectedIndex: 0, disabled: false };
  return {
    componentTag: 'EgCregisTabBar',
    previewSlug: 'tab-bar-cregis',
    importCode: `// iOS 26+ 系统 Tab 条：根 _layout 用 Layout · 页内容器用 NativeView
import { EgCregisTabBarNativeLayout, EgTabBarNativeView, CREGIS_TAB_BAR_NATIVE_TABS } from '@eds/mobile-components';
// Android / iOS ≤25：RN
import { EgCregisTabBar } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'defaultSelectedIndex',
        label: '默认选中',
        options: [...tabIndexOptions],
      },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
    ],
    propRows: [
      { name: 'items', type: 'EgTabBarItemData[]', defaultValue: 'CREGIS_TAB_BAR_ITEMS', description: '可选覆盖；默认主页 / 钱包 / 协作 / 交易记录' },
      { name: 'selectedIndex', type: 'number', defaultValue: 'undefined', description: '受控选中索引' },
      { name: 'defaultSelectedIndex', type: 'number', defaultValue: '0', description: '非受控默认选中' },
      { name: 'onSelectedIndexChange', type: '(index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['defaultSelectedIndex', 'disabled'],
    buildUsageSnippet: (state) => {
      const index = Number(state.defaultSelectedIndex ?? 0);
      return buildRnSelfClosingSnippet('EgCregisTabBar', { ...state, defaultSelectedIndex: index }, {
        defaults,
      });
    },
  };
}

function tabBarBaseDoc(): RnDocConfig {
  const tabIndexOptions = [
    { value: '0', label: 'Tab 1' },
    { value: '1', label: 'Tab 2' },
    { value: '2', label: 'Tab 3' },
    { value: '3', label: 'Tab 4' },
    { value: '4', label: 'Tab 5' },
  ] as const;
  const defaults = { defaultSelectedIndex: 0, disabled: false };
  return {
    componentTag: 'EgTabBar',
    previewSlug: 'tab-bar-base',
    importCode: `// iOS 26+ 系统 Tab 条：根 _layout 用 Layout · 页内容器用 NativeView
import { EgTabBarNativeLayout, EgTabBarNativeView } from '@eds/mobile-components';
// Android / iOS ≤25：RN
import { EgTabBar } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'defaultSelectedIndex',
        label: '默认选中',
        options: [...tabIndexOptions],
      },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
    ],
    propRows: [
      { name: 'items', type: 'EgTabBarItemData[]', defaultValue: '5 × Label', description: 'Tab 配置' },
      { name: 'selectedIndex', type: 'number', defaultValue: 'undefined', description: '受控选中索引' },
      { name: 'defaultSelectedIndex', type: 'number', defaultValue: '0', description: '非受控默认选中' },
      { name: 'onSelectedIndexChange', type: '(index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['defaultSelectedIndex', 'disabled'],
    buildUsageSnippet: (state) => {
      const index = Number(state.defaultSelectedIndex ?? 0);
      return buildRnSelfClosingSnippet('EgTabBar', { ...state, defaultSelectedIndex: index }, {
        defaults,
      });
    },
  };
}

function tabBarTextDoc(): RnDocConfig {
  const defaults = { ...tabBarTextCustomizeDefaults };
  const tabCount = readTabBarTextTabCount(defaults);
  const tabIndexOptions = buildTabBarTextDefaultSelectedOptions(tabCount);
  return {
    componentTag: 'EgTabBarText',
    previewSlug: 'tab-bar-text',
    importCode: `import { EgTabBarText } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: tabBarTextCustomizeControls.map((control) => {
      if (control.kind === 'select' && control.key === 'defaultSelectedIndex') {
        return { ...control, options: tabIndexOptions };
      }
      return control;
    }),
    propRows: [
      { name: 'tabCount', type: 'number', defaultValue: '3', description: '未传 items 时生成 Tab 数（1–6）' },
      { name: 'items', type: 'EgTabBarItemData[]', defaultValue: 'undefined', description: '覆盖默认 Label × n' },
      { name: 'defaultSelectedIndex', type: 'number', defaultValue: '0', description: '非受控默认选中' },
      { name: 'selectedIndex', type: 'number', defaultValue: 'undefined', description: '受控选中索引' },
      { name: 'onSelectedIndexChange', type: '(index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['tabCount', 'defaultSelectedIndex', 'disabled'],
    buildUsageSnippet: (state) => {
      const count = readTabBarTextTabCount(state);
      const index = Math.min(count - 1, Math.max(0, Number(state.defaultSelectedIndex ?? 0)));
      return buildRnSelfClosingSnippet(
        'EgTabBarText',
        {
          ...stripTabBarTextCustomizeMeta(state),
          tabCount: count,
          defaultSelectedIndex: index,
        },
        { defaults: { ...defaults, tabCount: String(count), defaultSelectedIndex: String(index) } },
      );
    },
  };
}

function egTabDoc(): RnDocConfig {
  const defaults = { ...tabSlideCustomizeDefaults };
  const previewItems = buildEgTabPreviewItems(readTabSegmentCount(defaults));
  return {
    componentTag: 'EgTab',
    previewSlug: 'tab-tabs',
    importCode: `import { EgTab } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: tabSlideCustomizeControls,
    propRows: [
      { name: 'items', type: 'EgTabItem[]', defaultValue: '3 × Label', description: 'Tab 项（id · label）' },
      { name: 'selectedId', type: 'string', defaultValue: 'undefined', description: '受控选中 id' },
      { name: 'defaultSelectedId', type: 'string', defaultValue: "'1'", description: '非受控默认选中' },
      { name: 'onSelect', type: '(id: string, index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'swipeToSwitch', type: 'boolean', defaultValue: 'true', description: '左右 Swipe / Fling 切 Tab（Tab 条 + 正文）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['segmentCount'],
    buildUsageSnippet: (state) => {
      const count = readTabSegmentCount(state);
      const items = buildEgTabPreviewItems(count);
      return buildRnSelfClosingSnippet(
        'EgTab',
        {
          ...stripTabSlideCustomizeMeta(state),
          defaultSelectedId: '1',
          items,
        },
        {
          defaults: { defaultSelectedId: '1', items: previewItems },
          omitKeys: ['segmentCount'],
        },
      );
    },
  };
}

function egToggleDoc(): RnDocConfig {
  const defaults = { ...tabSlideCustomizeDefaults };
  const previewItems = buildEgTogglePreviewItems(readTabSegmentCount(defaults));
  return {
    componentTag: 'EgToggle',
    previewSlug: 'tab-block',
    importCode: `import { EgToggle } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: tabSlideCustomizeControls,
    propRows: [
      { name: 'items', type: 'EgToggleItem[]', defaultValue: '3 × Label', description: '胶囊项（id · label · count?）' },
      { name: 'selectedId', type: 'string', defaultValue: "'1'", description: '选中 id' },
      { name: 'onSelect', type: '(id: string, index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'children', type: 'ReactNode', defaultValue: 'undefined', description: '正文 · layout-content' },
      { name: 'swipeToSwitch', type: 'boolean', defaultValue: 'true', description: '左右 Swipe / Fling 切分段（胶囊条 + 正文）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['segmentCount'],
    buildUsageSnippet: (state) => {
      const count = readTabSegmentCount(state);
      const items = buildEgTogglePreviewItems(count);
      return buildRnSelfClosingSnippet(
        'EgToggle',
        {
          ...stripTabSlideCustomizeMeta(state),
          selectedId: '1',
          items,
        },
        {
          defaults: { selectedId: '1', items: previewItems },
          omitKeys: ['segmentCount'],
        },
      );
    },
  };
}

function egSegmentedControlDoc(): RnDocConfig {
  const defaults = { ...segmentedControlCustomizeDefaults };
  const previewSegments = buildEgSegmentedControlPreviewSegments(readTabSegmentCount(defaults));
  return {
    componentTag: 'EgSegmentedControl',
    previewSlug: 'tab-segmented-control',
    importCode: `import { EgSegmentedControl } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: segmentedControlCustomizeControls,
    propRows: [
      { name: 'segments', type: '(string | EgSegmentedControlSegment)[]', defaultValue: '3 × Label', description: '分段文案' },
      {
        name: 'size',
        type: "'lg' | 'md' | 'sm'",
        defaultValue: "'lg'",
        description: 'Figma 493:4341 · 轨道 36 / 28 / 24px · 轨道与项间距 spacing-05 (2px)',
      },
      {
        name: 'widthMode',
        type: "'hug' | 'fill'",
        defaultValue: "'hug'",
        description: '自适应内容宽 · 全宽均分段宽',
      },
      { name: 'selectedIndex', type: 'number', defaultValue: 'undefined', description: '受控选中索引' },
      { name: 'defaultSelectedIndex', type: 'number', defaultValue: '0', description: '非受控默认选中' },
      { name: 'onSelect', type: '(index: number, segment: EgSegmentedControlSegment) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['segmentCount', 'size', 'widthMode'],
    buildUsageSnippet: (state) => {
      const count = readTabSegmentCount(state);
      const segments = buildEgSegmentedControlPreviewSegments(count);
      return buildRnSelfClosingSnippet(
        'EgSegmentedControl',
        {
          ...stripTabSlideCustomizeMeta(state),
          defaultSelectedIndex: 0,
          segments,
        },
        {
          defaults: {
            size: 'lg',
            widthMode: 'hug',
            defaultSelectedIndex: 0,
            segments: previewSegments,
          },
          omitKeys: ['segmentCount'],
        },
      );
    },
  };
}

function tabBarItemDoc(): RnDocConfig {
  const defaults = { label: 'Label', selected: true };
  return {
    componentTag: 'EgTabBarItem',
    previewSlug: 'tab-bar-item',
    importCode: `import { EgTabBarItem } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'label', label: '文案' },
      { kind: 'boolean', key: 'selected', label: '选中' },
    ],
    propRows: [
      { name: 'label', type: 'string', defaultValue: 'undefined', description: 'Tab 文案' },
      { name: 'selected', type: 'boolean', defaultValue: 'false', description: '选中态' },
      { name: 'embedded', type: 'boolean', defaultValue: 'false', description: '嵌入 EgTabBar（指示器负责底）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['label', 'selected'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgTabBarItem', state, { defaults }),
  };
}

const BUTTON_IMPORT = "import { EgButton } from '@eds/mobile-components';";

function buttonDoc(
  componentTag: string,
  previewSlug: string,
  options?: { label?: string; defaultTone?: ButtonShowcaseTone },
): RnDocConfig {
  const label = options?.label ?? '按钮';
  const defaultTone = options?.defaultTone ?? 'brand';
  const customizeDefaults = { ...buttonShowcaseDefaults, tone: defaultTone, label };

  return {
    componentTag,
    previewSlug,
    importCode: componentTag === 'EgButton' ? BUTTON_IMPORT : `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults,
    customizeControls: buttonCustomizeControls,
    propRows: [
      {
        name: 'tone',
        type: "'brand' | 'decor' | 'danger' | 'option'",
        defaultValue: `'${defaultTone}'`,
        description: '色调（EgBrand / Decor / Danger / EgOptionButton 边框）',
      },
      {
        name: 'variant',
        type: "'solid' | 'outline' | 'text'",
        defaultValue: "'solid'",
        description: '风格 · RN 映射 figmaType primary / secondary / tertiary',
      },
      { name: 'size', type: "'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'lg'", description: '尺寸' },
      { name: 'width', type: "'hug' | 'fill'", defaultValue: "'hug'", description: 'Hug 自适应 · Fill 撑满容器' },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '按钮文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '加载态' },
      {
        name: 'active',
        type: 'boolean',
        defaultValue: 'false',
        description: '选中（EgOptionButton / subtle solid）',
      },
      {
        name: 'labelStyle',
        type: "'standard' | 'brand' | 'decor' | 'danger'",
        defaultValue: "'standard'",
        description: '边框按钮文案色 · 不改描边与交互 · brand→text-brand · decor→text-decor · danger→status-danger',
      },
      {
        name: 'figmaType',
        type: "'primary' | 'secondary' | 'tertiary'",
        defaultValue: "'primary'",
        description: '由 variant 推导 · solid→primary · outline→secondary · text→tertiary',
      },
    ],
    propQueryKeys: [
      'tone',
      'variant',
      'size',
      'width',
      'label',
      'disabled',
      'loading',
      'active',
      'labelStyle',
    ],
    buildUsageSnippet: (state) => {
      const tone = String(state.tone ?? defaultTone);
      const tag = buttonShowcaseExportForTone(tone);
      const figmaType = buttonShowcaseVariantToFigmaType(String(state.variant ?? 'solid'));
      const snippetProps: Record<string, unknown> = {
        figmaType,
        size: state.size,
        label: state.label,
        disabled: state.disabled,
        loading: state.loading,
      };
      if (state.active) {
        snippetProps.active = true;
      }
      if (tone === 'option') {
        snippetProps.labelStyle = state.labelStyle ?? 'standard';
      } else if (state.labelStyle && state.labelStyle !== 'standard') {
        snippetProps.labelStyle = state.labelStyle;
      }
      if (state.width === 'fill') {
        snippetProps.style = { alignSelf: 'stretch', width: '100%' };
      }
      return buildRnSelfClosingSnippet(tag, snippetProps, {
        defaults: {
          figmaType: buttonShowcaseVariantToFigmaType(String(customizeDefaults.variant)),
          size: customizeDefaults.size,
          label: customizeDefaults.label,
          disabled: customizeDefaults.disabled,
          loading: customizeDefaults.loading,
        },
      });
    },
  };
}

import { familyBodyPreviewSlug } from './familyBodyPreviewSlug.js';

export { familyBodyPreviewSlug } from './familyBodyPreviewSlug.js';

const inputCustomizeControls: DocCustomizeControl[] = [
  ...fieldCustomizeControls,
  {
    kind: 'boolean',
    key: 'showPaste',
    label: '粘贴',
    exclusiveKeys: ['showUnit', 'showMax'],
  },
  {
    kind: 'boolean',
    key: 'showUnit',
    label: '单位',
    exclusiveKey: 'showPaste',
  },
  {
    kind: 'text',
    key: 'unit',
    label: '单位文案',
    visibleWhen: (state) => Boolean(state.showUnit),
  },
  {
    kind: 'boolean',
    key: 'showMax',
    label: 'Max',
    exclusiveKey: 'showPaste',
  },
];

const inputCustomizeDefaults = {
  ...fieldCustomizeDefaults,
  showPaste: false,
  showUnit: false,
  showMax: false,
  unit: 'Unit',
} as const;

const inputPropRows: DocPropRow[] = [
  ...fieldPropRows,
  { name: 'showPaste', type: 'boolean', defaultValue: 'false', description: '显示 Paste（Body Small Strong · brand）' },
  { name: 'showUnit', type: 'boolean', defaultValue: 'false', description: '显示单位后缀' },
  { name: 'unit', type: 'string', defaultValue: "'Unit'", description: '单位文案' },
  { name: 'showMax', type: 'boolean', defaultValue: 'false', description: '显示 Max（Body Medium Strong · brand）' },
];

function inputDoc(componentTag: string, previewSlug: string): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...inputCustomizeDefaults, placeholder: 'Input' },
    customizeControls: inputCustomizeControls,
    propRows: inputPropRows,
    propQueryKeys: [
      'size',
      'event',
      'placeholder',
      'disabled',
      'showPaste',
      'showUnit',
      'showMax',
      'unit',
    ],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, {
        defaults: { ...inputCustomizeDefaults, placeholder: 'Input' },
      }),
  };
}

function egGlassShowcaseDoc(): RnDocConfig {
  const defaultBox = 'glass-button-box';
  const customizeDefaults = defaultBlurGlassCustomizeState(defaultBox);
  return {
    componentTag: 'EgGlass',
    previewSlug: 'glass-eg',
    importCode: `import { EgGlass } from '@eds/mobile-components';`,
    customizeDefaults,
    customizeControls: blurGlassCustomizeControls,
    propRows: [
      {
        name: 'box',
        type: 'GlassBoxClassName',
        defaultValue: JSON.stringify(defaultBox),
        description: 'Effect Glass Box class（button / sheets / tabbar …）',
      },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '外观' },
      { name: 'style', type: 'StyleProp<ViewStyle>', defaultValue: '—', description: '布局尺寸；材质由 box + mode 解析' },
      {
        name: 'glass-mask-box · 选用顺序',
        type: '—',
        defaultValue: '—',
        description:
          '① iOS 26+ → 系统 Scroll Edge（静止 hidden · 滚入栏下 soft）② iOS 26 以下 → 遮罩浅 `EgScrollEdgeEffect`（RN 栈默认 · `GlassMaskBackdrop`）③ Android → 遮罩深（强制毛玻璃）',
      },
      {
        name: 'glass-mask-box · 兜底逻辑',
        type: '—',
        defaultValue: '—',
        description:
          'iOS 26 以下遮罩浅用不了（expo-blur / expo-linear-gradient 原生模块未链接）时，`GlassMaskBackdrop` 自动改绘 `EgGlass box="glass-mask-box"`（遮罩深 · BlurGlass · eds-blur-glass）',
      },
    ],
    propQueryKeys: ['mode', 'box'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(
        'EgGlass',
        { box: state.box, mode: state.mode },
        {
          defaults: { box: defaultBox, mode: 'light' },
        },
      ),
  };
}

function egScrollEdgeShowcaseDoc(): RnDocConfig {
  const customizeDefaults = defaultScrollEdgeCustomizeState();
  return {
    componentTag: 'EgScrollEdgeEffect',
    previewSlug: SHOWCASE_SCROLL_EDGE_EG_SLUG,
    importCode: `import { EgNavBar, EgScrollEdgeEffect, useEgNavBarScroll } from '@eds/mobile-components';`,
    customizeDefaults,
    customizeControls: scrollEdgeCustomizeControls,
    propRows: [
      {
        name: 'effect',
        type: "'automatic' | 'soft' | 'hard' | 'hidden'",
        defaultValue: "'automatic'",
        description:
          'iOS 26 scrollEdgeEffectStyle 同名 · glass-mask-box · 顶栏无内容侧虚化带 · soft 底栏淡出无分割线 · hard 更不透明 + 分割线',
      },
      { name: 'edge', type: "'top' | 'bottom'", defaultValue: "'top'", description: '滚动边缘位置' },
      {
        name: 'container',
        type: "'page' | 'sheet'",
        defaultValue: "'page'",
        description: 'automatic 解析：page → soft · sheet → hard',
      },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '外观' },
      {
        name: 'scrollEdgeEffect（EgNavBar）',
        type: 'EgNavBarScrollEdgeEffect',
        defaultValue: 'undefined',
        description: '顶栏内置顶部边缘 — 页面 / Sheet 缺省滚入栏下 soft（iOS 26 以下遮罩浅 · Android 遮罩深）',
      },
    ],
    propQueryKeys: [
      'mode',
      'container',
      'topEdgeStyle',
      'topEdgeHidden',
      'bottomEdgeStyle',
      'bottomEdgeHidden',
    ],
    buildUsageSnippet: (state) => {
      const top = resolveScrollEdgeStyle(state, 'top');
      const bottom = resolveScrollEdgeStyle(state, 'bottom');
      const sheet = state.container === 'sheet';
      return `const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();

<EgNavBar${sheet ? ' chromeContext="overlay"' : ''} title="${String(state.title ?? '标题')}" scrollEdgeEffect="${top}" scrollOffset={scrollOffset} mode="${String(state.mode ?? 'light')}" />

<EgScrollEdgeEffect edge="bottom" effect="${bottom}"${sheet ? ' container="sheet"' : ''} mode="${String(state.mode ?? 'light')}" />

<ScrollView onScroll={onScroll} scrollEventThrottle={scrollEventThrottle}>
  {/* content */}
</ScrollView>`;
    },
  };
}

export const rnDocBySlug: Record<string, RnDocConfig> = {
  'input-body': inputDoc('EgInput', 'input-input'),
  'input-input': inputDoc('EgInput', 'input-input'),
  'search-body': {
    ...fieldDoc('EgSearch', 'input-search', 'Search'),
    customizeDefaults: { size: 'md', event: 'default', placeholder: 'Search', disabled: false },
    propRows: [
      { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: '控件尺寸（Figma Search 为 md / 48px）' },
      {
        name: 'event',
        type: "'default' | 'tap' | 'entering' | 'done'",
        defaultValue: "'default'",
        description: 'Default=居中 pill；Tap=展开+光标在前；Entering=输入中；Done=已填内容',
      },
      { name: 'placeholder', type: 'string', defaultValue: "'Search'", description: '占位文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
  },
  'input-search': {
    ...fieldDoc('EgSearch', 'input-search', 'Search'),
    customizeDefaults: { size: 'md', event: 'default', placeholder: 'Search', disabled: false },
    propRows: [
      { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: '控件尺寸（Figma Search 为 md / 48px）' },
      {
        name: 'event',
        type: "'default' | 'tap' | 'entering' | 'done'",
        defaultValue: "'default'",
        description: 'Default=居中 pill；Tap=展开+光标在前；Entering=输入中；Done=已填内容',
      },
      { name: 'placeholder', type: 'string', defaultValue: "'Search'", description: '占位文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
  },
  'textarea-body': textareaFieldDoc('EgTextarea', 'input-textarea'),
  'input-textarea': textareaFieldDoc('EgTextarea', 'input-textarea'),
  'input-quick-input': fieldDoc('EgQuickInput', 'input-quick-input', 'Quick input'),
  'input-pointer': {
    componentTag: 'EgInputPointer',
    previewSlug: 'input-pointer',
    importCode: `import { EgInputPointer } from '@eds/mobile-components';`,
    customizeDefaults: {},
    customizeControls: [],
    propRows: [{ name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' }],
    propQueryKeys: [],
    buildUsageSnippet: () => '<EgInputPointer />',
  },
  'button-body': buttonDoc('EgButton', 'button-brand'),
  'button-link': {
    componentTag: 'EgLink',
    previewSlug: 'button-link',
    importCode: `import { EgLink } from '@eds/mobile-components';`,
    customizeDefaults: { tone: 'brand', size: 'md', label: 'Link' },
    customizeControls: [
      {
        kind: 'select',
        key: 'tone',
        label: '色调',
        options: [...LINK_BUTTON_SHOWCASE_TONES],
      },
      { kind: 'select', key: 'size', label: '尺寸', options: [...SHOWCASE_SIZE_OPTIONS_LG_TO_SM] },
      { kind: 'text', key: 'label', label: '文案' },
    ],
    propRows: [
      {
        name: 'tone',
        type: "'brand' | 'decor' | 'danger' | 'option' | 'subtle' | 'sameWhite'",
        defaultValue: "'brand'",
        description: '色调 · Showcase「标准」对应 subtle / option',
      },
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '链接文案' },
    ],
    propQueryKeys: ['tone', 'size', 'label'],
    buildUsageSnippet: (state) => {
      const tone = String(state.tone ?? 'brand');
      const snippetTone = tone === 'option' ? 'subtle' : tone;
      return buildRnSelfClosingSnippet(
        'EgLink',
        { ...state, tone: snippetTone },
        { defaults: { tone: 'brand', size: 'md', label: 'Link' } },
      );
    },
  },
  'tag-body': egTagDoc('EgTag', 'tag-color'),
  'tag-color': egTagDoc('EgTag', 'tag-color'),
  'tag-color-alt': colorTagAltDoc('EgTagAlt', 'tag-color-alt'),
  'tag-system': systemTagDoc('EgSystemTag', 'tag-system'),
  'tag-system-alt': systemTagDoc('EgSystemTagAlt', 'tag-system-alt'),
  'menu-body': menuBodyDoc(),
  'dropdown-body': menuBodyDoc(),
  'dropdown-trigger': menuTriggerSceneDoc(),
  'sheets-body': sheetsBodyDoc(),
  'data-list-body': dataListBodyDoc(),
  'item-body': itemBodyDoc(),
  'tab-bar-body': tabBarBaseDoc(),
  'tab-bar-base': tabBarBaseDoc(),
  'tab-bar-cregis': cregisTabBarDoc(),
  'tab-bar-text': tabBarTextDoc(),
  'tab-bar-item': tabBarItemDoc(),
  'tab-tabs': egTabDoc(),
  'tab-block': egToggleDoc(),
  'tab-segmented-control': egSegmentedControlDoc(),
  'toggle-body': switchDoc('EgSwitch', 'toggle-switch'),
  'toggle-switch': switchDoc('EgSwitch', 'toggle-switch'),
  'toggle-checkbox': toggleMarkDoc('EgCheckbox', 'toggle-checkbox', 'checked', 'defaultChecked'),
  'toggle-radio': toggleMarkDoc('EgRadio', 'toggle-radio', 'checked', 'defaultChecked'),
  'toggle-decide': toggleMarkDoc('EgDecide', 'toggle-decide', 'decided', 'defaultDecided'),
  'button-combo-action': minimalDoc('EgComboActionButton', 'button-combo-action'),
  'button-combo-action-alt': minimalDoc('EgComboActionButtonAlt', 'button-combo-action-alt'),
  'button-icon-container': symbolActionDoc(),
  'button-glass': {
    componentTag: 'EgGlassCapsule',
    previewSlug: 'button-glass',
    importCode: `// iOS 26+：原生 Liquid Glass（GlassView）；Android / iOS ≤25：RN glass-button-box
import { EgGlassCapsule } from '@eds/mobile-components';`,
    customizeDefaults: {
      kind: 'text',
      size: 'md',
      label: '编辑',
      icon: 'eds-list-lattice-mobile',
      iconCount: '1',
      iconAlt: 'eds-add',
      iconThird: 'eds-more-ios',
      disabled: false,
      showAvatarSlot: false,
    },
    customizeControls: [
      {
        kind: 'select',
        key: 'kind',
        label: '类型',
        options: [
          { value: 'text', label: '文本胶囊' },
          { value: 'icon', label: '圆形图标' },
        ],
      },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...SHOWCASE_SIZE_OPTIONS_LG_TO_XS],
        visibleWhen: (state) => state.kind === 'text' || state.kind === undefined,
      },
      {
        kind: 'text',
        key: 'label',
        label: '文案',
        visibleWhen: (state) => state.kind === 'text' || state.kind === undefined,
      },
      {
        kind: 'select',
        key: 'iconCount',
        label: '数量',
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
        ],
        visibleWhen: (state) => state.kind === 'icon',
      },
      {
        kind: 'text',
        key: 'icon',
        label: 'Symbol',
        visibleWhen: (state) => state.kind === 'icon',
      },
      {
        kind: 'text',
        key: 'iconAlt',
        label: 'Symbol 2',
        visibleWhen: (state) => {
          const count = String(state.iconCount ?? '1');
          return state.kind === 'icon' && (count === '2' || count === '3');
        },
      },
      {
        kind: 'text',
        key: 'iconThird',
        label: 'Symbol 3',
        visibleWhen: (state) => state.kind === 'icon' && String(state.iconCount ?? '1') === '3',
      },
      {
        kind: 'boolean',
        key: 'showAvatarSlot',
        label: '头像槽（EgAvatar lg）',
        visibleWhen: (state) => {
          if (state.kind === 'text' || state.kind === undefined) return true;
          if (state.kind !== 'icon') return false;
          return String(state.iconCount ?? '1') === '1';
        },
      },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
    ],
    propRows: [
      {
        name: 'kind',
        type: "'text' | 'icon'",
        defaultValue: "'text'",
        description: '文本胶囊 / 圆形图标（业务只引 EgGlassCapsule；平台分流见 import 注释）',
      },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '文本按钮文案' },
      {
        name: 'size',
        type: "'lg' | 'md' | 'sm' | 'xs'",
        defaultValue: "'md'",
        description:
          'RN / iOS 26+ 原生：Pressable 边距同 token（文本同 EgButton；icon spacing-1 / 双 icon spacing-4）；勿在 GlassView 上叠 padding',
      },
      {
        name: 'avatarSlot',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'icon — count 1 替换 icon；count 2 替换右侧 iconAlt（EgAvatar lg）',
      },
      { name: 'icon', type: 'string', defaultValue: 'undefined', description: '主 icon symbol' },
      {
        name: 'iconCount',
        type: '1 | 2',
        defaultValue: '1',
        description: 'Icon 数量（最大 2）',
      },
      { name: 'iconAlt', type: 'string', defaultValue: 'undefined', description: '第二个 symbol（iconCount=2）' },
      { name: 'variant', type: "'regular' | 'prominent' | 'clear'", defaultValue: "'regular'", description: 'iOS GlassView 档位 · 默认 regular（对齐系统控件）；clear 偏亮/发白' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['kind', 'size', 'label', 'avatarSlot', 'icon', 'iconCount', 'iconAlt', 'disabled'],
    buildUsageSnippet: (state) => {
      const kind = String(state.kind ?? 'text');
      if (kind === 'icon') {
        const count = String(state.iconCount ?? '1');
        if (count === '2' || count === '3' || count === '2-split') {
          const icons = [
            state.icon ?? 'eds-list-lattice-mobile',
            state.iconAlt ?? 'eds-add',
            count === '3' ? state.iconThird ?? 'eds-more-ios' : undefined,
          ].filter((name) => String(name).trim() !== '');
          const rows = icons.map((name) =>
            buildRnSelfClosingSnippet(
              'EgGlassCapsule',
              { kind: 'icon', icon: name, iconCount: 1, disabled: state.disabled },
              { defaults: { kind: 'icon', icon: 'eds-list-lattice-mobile', iconCount: 1 } },
            ),
          );
          return `// ${count} 颗独立玻璃圆钮（split）\n${rows.join('\n')}`;
        }
        return buildRnSelfClosingSnippet('EgGlassCapsule', state, {
          defaults: { kind: 'icon', icon: 'eds-list-lattice-mobile', iconCount: 1 },
          omitKeys: ['iconCount', 'iconAlt', 'iconThird', 'showAvatarSlot'],
        });
      }
      return buildRnSelfClosingSnippet('EgGlassCapsule', state, {
        defaults: { kind: 'text', size: 'md', label: '编辑' },
      });
    },
  },
  'tab-bar-nav-bar': {
    componentTag: 'EgNavBar',
    previewSlug: 'tab-bar-nav-bar',
    importCode: `// iOS 26+：<Stack.Screen options={egNavBarNativeStackOptions({ title })} />
import { egNavBarNativeStackOptions } from '@eds/mobile-components';
// Android / iOS ≤25：RN
import { EgNavBar, useEgNavBarScroll } from '@eds/mobile-components';`,
    customizeDefaults: {
      title: '标题',
      showLeft: true,
      showTitle: true,
      showRight: true,
      rightIconCount: 1,
      background: 'auto',
      scrollEdgeEffect: 'follow',
      statusBarZone: true,
    },
    customizeControls: [
      { kind: 'boolean', key: 'showLeft', label: '左侧（返回）' },
      { kind: 'boolean', key: 'showTitle', label: '标题' },
      {
        kind: 'text',
        key: 'title',
        label: '标题文案（隐藏时 iOS 26+ 仍须非空 · VoiceOver）',
      },
      { kind: 'boolean', key: 'showRight', label: '右侧' },
      {
        kind: 'select',
        key: 'rightIconCount',
        label: '右侧数量',
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2 拆分' },
        ],
        visibleWhen: (state) => state.showRight !== false,
      },
      {
        kind: 'select',
        key: 'background',
        label: '背景',
        options: [
          { value: 'auto', label: '自动（滚动显现）' },
          { value: 'visible', label: '显示' },
          { value: 'hidden', label: '隐藏' },
        ],
      },
      {
        kind: 'select',
        key: 'scrollEdgeEffect',
        label: 'iOS 26+ scroll edge（全屏演示生效）',
        options: [{ value: 'follow', label: '跟随背景' }, ...SCROLL_EDGE_EFFECT_OPTIONS],
      },
      { kind: 'boolean', key: 'statusBarZone', label: '状态栏区（safeArea.top）' },
    ],
    propRows: [
      {
        name: 'title',
        type: 'string',
        defaultValue: 'undefined',
        description:
          '中间标题 · 17 / 600。iOS 26+ 系统栏不可为空串；showTitle: false 时 EDS 透明隐藏，scroll edge 仍生效',
      },
      {
        name: 'left',
        type: 'EgNavBarAction',
        defaultValue: "{ icon: 'eds-arrow-left-ios' }",
        description: '左侧 icon 胶囊（EgGlassCapsule）',
      },
      { name: 'right', type: 'EgNavBarAction', defaultValue: 'undefined', description: '右侧；iconCount=2 默认两颗独立玻璃钮（split），combined 为单胶囊' },
      { name: 'showLeft', type: 'boolean', defaultValue: 'true', description: '显示左侧' },
      {
        name: 'showTitle',
        type: 'boolean',
        defaultValue: 'true',
        description: '标题可见性；false 时不删 title（iOS 26+ scroll edge 依赖非空 title）',
      },
      { name: 'showRight', type: 'boolean', defaultValue: 'true', description: '显示右侧' },
      {
        name: 'background',
        type: "'auto' | 'visible' | 'hidden'",
        defaultValue: "'auto'",
        description:
          'RN ScrollEdgeEffect 背景（与底栏同栈，不叠 BlurGlass）；auto = 内容滚入栏下才显现',
      },
      {
        name: 'scrollEdgeEffect',
        type: "'automatic' | 'hard' | 'soft' | 'hidden'",
        defaultValue: 'undefined',
        description: 'iOS 26+ 系统栏 scroll edge · soft 透明渐变模糊（页面顶栏缺省）· hard 更不透明 + 底线（Sheet overlay）· hidden 无 · automatic 交系统；缺省按 background 映射（auto→静止 hidden · 滚入栏下 soft · visible→soft · hidden→hidden · useEgNavBarScroll 驱动）。egNavBarNativeStackOptions 同名；expo-router 另传 scrollEdgeActive',
      },
      {
        name: 'scrollOffset',
        type: 'SharedValue<number>',
        defaultValue: 'undefined',
        description: 'auto 背景驱动 — useEgNavBarScroll().scrollOffset',
      },
      { name: 'contentUnder', type: 'boolean', defaultValue: 'false', description: 'auto 且无 scrollOffset 时手动告知栏下有内容' },
      { name: 'topInset', type: 'number', defaultValue: 'safeArea.top', description: '状态栏区高度（不写死 20）' },
      {
        name: 'manageStatusBar',
        type: 'boolean',
        defaultValue: 'true',
        description: '透明沉浸 StatusBar（修复 Android 状态栏一片黑）',
      },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: [
      'title',
      'showLeft',
      'showTitle',
      'showRight',
      'rightIconCount',
      'background',
      'scrollEdgeEffect',
      'statusBarZone',
    ],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(
        'EgNavBar',
        {
          title: state.title,
          showLeft: state.showLeft,
          showTitle: state.showTitle,
          showRight: state.showRight,
          background: state.background,
          scrollEdgeEffect: state.scrollEdgeEffect === 'follow' ? undefined : state.scrollEdgeEffect,
        },
        { defaults: { title: '标题', showLeft: true, showTitle: true, showRight: true, background: 'auto' } },
      ),
  },
  'input-combo-input-group': minimalDoc('EgInputGroup', 'input-combo-input-group'),
  'input-combo-text-input': minimalDoc('EgComboTextInput', 'input-combo-text-input'),
  'input-combo-textarea-input': minimalDoc('EgComboTextareaInput', 'input-combo-textarea-input'),
  'feedback-message': messageDoc(),
  divider: dividerDoc(),
  'glass-eg': egGlassShowcaseDoc(),
  'glass-scroll-edge': egScrollEdgeShowcaseDoc(),
  'avatar-body': avatarBodyDoc(),
  'symbol-body': symbolBodyDoc(),
  'avatar-preset-0': avatarPreset0Doc(),
  'avatar-preset-1': avatarPreset1Doc(),
};

/** 旧 slug 深链 → 统一 EgButton 文档（默认 tone 对齐原场景）。 */
const BUTTON_LEGACY_DOC_TONE: Record<string, ButtonShowcaseTone> = {
  'button-brand': 'brand',
  'button-decor': 'decor',
  'button-danger': 'danger',
  'button-option': 'option',
};

function resolveButtonLegacyDoc(slug: string): RnDocConfig | null {
  const tone = BUTTON_LEGACY_DOC_TONE[slug];
  const base = rnDocBySlug['button-body'];
  if (!tone || !base) {
    return null;
  }
  return {
    ...base,
    componentTag: buttonShowcaseExportForTone(tone),
    customizeDefaults: { ...base.customizeDefaults, tone },
  };
}

export function resolveRnDocConfig(slug: string, exportName?: string): RnDocConfig | null {
  const legacyButton = resolveButtonLegacyDoc(slug);
  if (legacyButton) {
    return legacyButton;
  }

  if (rnDocBySlug[slug]) {
    return rnDocBySlug[slug];
  }

  const baseSlug = familyBodyPreviewSlug[slug];
  if (baseSlug && rnDocBySlug[baseSlug]) {
    return rnDocBySlug[baseSlug];
  }

  if (exportName) {
    const byComponentTag = Object.values(rnDocBySlug).find(
      (config) => config.componentTag === exportName,
    );
    if (byComponentTag) {
      return byComponentTag;
    }
    return minimalDoc(exportName, slug);
  }

  if (slug.endsWith('-body')) {
    return familyDoc(slug.slice(0, -'-body'.length));
  }

  return null;
}
