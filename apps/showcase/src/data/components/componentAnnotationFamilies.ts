import type { ShowcaseCatalogEntry } from '@/data/components/showcaseCatalog';
import { isShowcaseEntryImplemented } from '@/data/components/showcaseCatalog';

import type { ShowcaseComponentAnnotationDoc, ShowcaseComponentAnnotationSection } from './componentAnnotationTypes';

const GLOBAL_STYLE_TAIL = [
  '主文案 `text-base-primary`',
  '次要文案 `text-base-secondary`（60%）',
  '辅助/占位 `text-base-tertiary`',
  '品牌/焦点 `text-brand` · `event-focus-brand`',
  '浅底 `material-card-shallow`',
  '页面底 `box-page-card`',
  '卡片衬底 `box-page`',
];

const GLOBAL_LAYOUT_TAIL = [
  'Showcase 分组卡左右 `spacing-5`',
  'Showcase 分组卡上下 `spacing-4`',
  '块圆角 `radius-xl` + smoothRadius',
];

const GLOBAL_PLATFORM_RN = [
  '默认 RN：`StyleSheet` + `mobileTheme`',
  '无 spec 声明时不写 `Platform.OS` 双实现',
];

const GLOBAL_PLATFORM_GLASS = [
  'iOS 26+：系统 Liquid Glass（材质 + 交互）',
  'Android · iOS ≤25：expo-blur + token 叠层',
  '双端共用同一套 token 数值',
];

const SCAFFOLD_OTHER = [
  'Figma 对齐脚手架',
  '真实现后随 packages/components 源码更新本节',
];

type FamilySpec = {
  style: string[];
  layout: string[];
  motion?: string[];
  platform?: string[];
  other?: string[];
};

const FAMILY_SPECS: Record<string, FamilySpec> = {
  avatar: {
    style: [
      '图形槽尺寸 `symbol-*` / 头像 preset 色 `material-card-shallow`。',
      '标签字：`typography-body-medium` · `text-base-primary`。',
    ],
    layout: ['行高对齐 `input-md` 档；与列表/标题间距 `spacing-4` · `spacing-5`。'],
    motion: ['点按场景 `EdsSemanticAnima(\'press\')`（可点行）。'],
  },
  button: {
    style: [
      '文案：`typography-body-medium-heavy`（Brand / Primary）· Link 用 `body-medium`。',
      '底色/描边：`--eds-brand` 映射 · `material-button-*` · 禁用 `text-base-tertiary`。',
    ],
    layout: ['高度 token `button-xl` … `button-xs`；水平 `spacing-5` 起、图标间距 `spacing-1` / `spacing-4`。'],
    motion: ['`EdsSemanticAnima(\'press\')` · recipe `glass-press`（玻璃钮）。'],
    platform: [
      'EgButtonGlass：iOS 26+ `GlassView`；其余 `glass-button-box` RN。',
      ...GLOBAL_PLATFORM_GLASS.slice(0, 1),
    ],
  },
  crypto: {
    style: ['图标资产 `EgCrypto` · 色 `text-base-primary` / 品牌色。'],
    layout: ['槽宽 `symbol-sm` / `spacing-4` 与列表图标列对齐。'],
  },
  divider: {
    style: ['线色 `stroke-divider-shallow` / `stroke-divider-deep`（module 分割线）。'],
    layout: ['缩进随宿主行 `spacing-5` 或图标后文案列（EgItem `getEgItemDividerInset`）。'],
  },
  dropdown: {
    style: ['菜单项 `typography-body-medium` · 选中 `text-face-primary`。'],
    layout: ['浮层内边距 `spacing-4` · 圆角 `radius-lg` smooth。'],
    motion: ['展开 `EdsSemanticAnima(\'menu\')` / EgMenu 场景 recipe。'],
    platform: ['EgMenu：iOS 26+ 系统 Menu；其余 RN 浮层 + 同一动效语义。'],
  },
  feedback: {
    style: ['状态字 `typography-body-medium` · 语义色 `text-semantic-*` · Toast 浅底 `material-card-shallow`。'],
    layout: ['间距 `spacing-4` · 安全区底 `spacing-10` 避让。'],
    motion: ['入出场 `motion-fade` / slide 场景（按组件 recipe）。'],
  },
  icon: {
    style: ['EgSymbol 描边 token `text-base-primary` / `text-base-secondary`；尺寸 `symbol-xs` … `symbol-xl`。'],
    layout: ['图标槽固定宽 + `spacing-4` 与主文案间距。'],
  },
  index: {
    style: ['索引条 `typography-detail` · `text-base-tertiary`。'],
    layout: ['贴边 `spacing-2` · 与列表 `spacing-3` 行距。'],
  },
  input: {
    style: [
      '占位/输入：`typography-body-medium` · 值 `text-base-primary` · 占位 `text-base-tertiary`。',
      '描边/底：`stroke-input` · focus `event-focus-brand`。',
    ],
    layout: ['高度 `input-xl` … `input-xs`；水平内边距 `spacing-4` / `spacing-5`。'],
    motion: ['交互态 `event-tap` / `event-focus`（无整页转场）。'],
  },
  popovers: {
    style: ['气泡底 `material-card-moderate` · 字 `body-small` / `body-medium`。'],
    layout: ['箭头 inset `spacing-3` · 最大宽随屏 `spacing-5` 边距。'],
    motion: ['弹出 `EdsSemanticAnima(\'slide\')` 或 popover recipe。'],
  },
  tab: {
    style: ['标签 `typography-body-medium` · 选中 `text-face-primary` / 未选 `text-base-secondary`。'],
    layout: ['段块 `spacing-1` 内边距 · 胶囊 `radius-full`；正文区 layout-content 间距 `spacing-4`。'],
    motion: ['切换 `EdsSemanticAnima(\'layout-content\')`（EgTab / EgTabBlock）。'],
  },
  'tab-bar': {
    style: ['项文案 `typography-body-small` · 选中品牌/面 `text-face-primary`。'],
    layout: ['栏高 token · 项水平 `spacing-4`；浮动 Tab 底留白 consumer 自垫。'],
    motion: ['点按 `EdsSemanticAnima(\'press\')`；切换选中态 spring recipe。'],
    platform: [
      'EgTabBarNative：iOS 26+ `NativeTabs`；其余 RN `EgTabBarText` / `EgCregisTabBar`。',
      '顶栏联动页面栈见 `EgEdsAnimaPage`。',
    ],
  },
  tag: {
    style: [
      'Color Tag：色块 semantic / 品牌 · 字 `typography-body-small-heavy`。',
      'System Tag：状态色 `text-semantic-*` · 浅底 `material-card-shallow`。',
    ],
    layout: ['水平 `spacing-2` · `spacing-3` 内边距 · 胶囊 `radius-full`。'],
  },
  text: {
    style: ['层级 Display / Title / Headline / Body / Detail / Footnote semantic 类。'],
    layout: ['默认随父容器；EDS 封装 `EdsSansText` + `edsFontStyle`。'],
  },
  toggle: {
    style: ['轨道/拇指 semantic 色 · 标签 `typography-body-medium`。'],
    layout: ['Switch 尺寸 token · 与 EgItem 行 `spacing-4` 对齐。'],
    motion: ['切换 `EdsSemanticAnima(\'press\')` + haptic recipe（若启用）。'],
  },
  menu: {
    style: ['与 dropdown 同族 · `typography-body-medium`。'],
    layout: ['分组间距 `spacing-6` · 行 `spacing-4` 内边距。'],
    motion: ['`EdsSemanticAnima(\'menu\')`。'],
    platform: ['iOS 26+ 系统 Menu；Android / iOS ≤25 RN overlay。'],
  },
  sheets: {
    style: ['顶栏/把手 `text-base-primary` · Sheet 底 `material-card-shallow` / glass-mask。'],
    layout: ['档位高度 token · 内容左右 `spacing-5` · 顶栏 scroll edge automatic→hard。'],
    motion: ['出现 `EdsSemanticAnima(\'slide\')` · 拖拽关闭 recipe。'],
    platform: ['顶栏 scroll edge：iOS 26+ 系统；RN 栈 `EgScrollEdgeEffect`（glass-mask-box）。'],
  },
  'data-list': {
    style: ['主/副文案 `typography-body-medium` / `body-small` · 图形槽 preset。'],
    layout: ['行 `spacing-4`/`spacing-5` · DL-bleed 场景 token。'],
    motion: ['行点按 `EdsSemanticAnima(\'press\')`。'],
  },
  item: {
    style: ['EgItem 标签 `typography-body-medium` · 值 `body-small` · `text-base-secondary`。'],
    layout: ['EgItemGroup 内边距 `spacing-1` · 行 `spacing-4` · 圆角 `radius-lg`。'],
    motion: ['`EdsSemanticAnima(\'press\')` · Switch 无整页动效。'],
  },
  page: {
    style: ['页面底 `box-page`（ScrollView）· 业务页底常用 `box-page-card`。'],
    layout: [
      'EgPage：左右 `spacing-5` · 底 `spacing-10` · 顶 `contentPaddingTop`（默认 lg 12px）。',
    ],
    motion: ['页面转场 `EdsSemanticAnima(\'page\')` · 返回 `page-back`。'],
    platform: [
      '导航：`createEgPageNavigator` · iOS 26+ 系统栏+转场；≤25 RN `EgNavBar` + page spring。',
      'Scroll edge：`background="auto"` 静止 hidden · 滚入 soft（系统栏 / RN 遮罩一致语义）。',
    ],
  },
  'page-shot': {
    style: ['弹层页同色 `box-page` · 卡片 `material-card-shallow`。'],
    layout: ['自触发元素 frame 展开；内容仍走 EgPage 边距契约。'],
    motion: ['`EdsSemanticAnima(\'page-shot\')` 展开/收回；内可嵌套 `page`。'],
    platform: ['iOS 26+ 弹层内 `ScreenStack` 系统栏；其余 RN Modal + EgNavBar。'],
  },
  'nav-bar': {
    style: ['标题 `typography-body-medium-heavy`（17/600）· 按钮 `EgButtonGlass`。'],
    layout: ['栏高 safe area + `EG_NAV_BAR_*` metrics · 左右 `spacing-5`。'],
    motion: ['栏项 `EdsSemanticAnima(\'press\')`；`background="auto"` 随滚动透明度。'],
    platform: [
      'EgNavBar：iOS 26+ 不写 RN 栏，用 `egNavBarNativeStackOptions`；≤25 RN `EgNavBar` + `EgScrollEdgeEffect`。',
    ],
  },
  glass: {
    style: ['材质 `effect-glass-*` / `glass.surface` preset · 叠层 tint 来自 token。'],
    layout: ['blur 强度 `blur-sm`→`nativeBlurIntensity` · 圆角 smoothRadius。'],
    platform: GLOBAL_PLATFORM_GLASS,
  },
  'scroll-edge': {
    style: ['`glass-mask-box` · 不透明度/渐变随 soft / hard 档。'],
    layout: ['贴栏单侧；宽同内容区，高由 scroll edge 组件测算。'],
    motion: ['随滚动 offset 淡入；无 press 场景。'],
    platform: [
      'RN `EgScrollEdgeEffect`；iOS 26+ 页面栈可与系统 `scrollEdgeEffects` 同名联动。',
    ],
  },
  symbol: {
    style: [
      'EgSymbol 描边色 token · 尺寸 `symbol-*` · Icon + Crypto 资产见族页「资产」网格。',
    ],
    layout: ['与父行图标槽 `EG_ITEM_ICON_SLOT` 对齐。'],
  },
};

function mergeSections(spec: FamilySpec, implemented: boolean): ShowcaseComponentAnnotationSection[] {
  const sections: ShowcaseComponentAnnotationSection[] = [
    {
      title: '样式',
      lines: ['主题 `mode` → semantic 色表', ...spec.style, ...GLOBAL_STYLE_TAIL],
    },
    {
      title: '布局',
      lines: [...spec.layout, ...GLOBAL_LAYOUT_TAIL],
    },
  ];

  if (spec.motion?.length) {
    sections.push({ title: '动效', lines: spec.motion });
  }

  const platform = spec.platform?.length
    ? [...spec.platform, ...GLOBAL_PLATFORM_RN]
    : [...GLOBAL_PLATFORM_RN];

  sections.push({ title: '多系统差异', lines: platform });

  sections.push({
    title: '其他',
    lines: implemented
      ? (spec.other ?? [
          '实现见 packages/components 对应族目录',
          'Customize / Inspect 与 Live 同源 props',
        ])
      : SCAFFOLD_OTHER,
  });

  return sections;
}

export function buildFamilyComponentAnnotation(
  family: string,
  entry: Pick<ShowcaseCatalogEntry, 'slug' | 'exportName'>,
): ShowcaseComponentAnnotationDoc {
  const spec = FAMILY_SPECS[family] ?? {
    style: [`族 \`${family}\` · 色/字走 EDS semantic token，勿硬编码 hex。`],
    layout: ['间距对齐 Figma Scale → `spacing-*` · 圆角 `radius-*` + smooth。'],
    motion: undefined,
    platform: undefined,
  };

  const implemented = isShowcaseEntryImplemented(entry);
  return { sections: mergeSections(spec, implemented) };
}