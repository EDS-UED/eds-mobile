import type { ShowcaseCatalogEntry } from '@/data/components/showcaseCatalog';
import { isShowcaseEntryImplemented } from '@/data/components/showcaseCatalog';

import { assembleComponentAnnotationDoc, type ComponentSelfAnnotationSpec } from './componentAnnotationAssemble';

type FamilySpec = ComponentSelfAnnotationSpec;

const FAMILY_SPECS: Record<string, FamilySpec> = {
  avatar: {
    style: ['图形/字母 `typography-body-medium` · 槽底 `material-card-shallow`。'],
    layout: ['圆形或圆角矩形槽；边长 `symbol-*` 档。'],
  },
  button: {
    style: ['按场景 preset：Brand/Danger/Decor/Link 色票 · 字 `typography-body-medium(-heavy)`。'],
    layout: ['高度 `button-*` · 水平 `spacing-5` / 图标间距 `spacing-1` · `spacing-4`。'],
    motion: ['按压 `EdsSemanticAnima(\'press\')`。'],
  },
  crypto: {
    style: ['加密资产 SVG · 保留资产配色。'],
    layout: ['正方槽 `symbol-*`。'],
  },
  divider: {
    style: ['线色 `stroke-divider-shallow` / `stroke-divider-deep`。'],
    layout: ['线宽 1px · 水平撑满父内容区。'],
  },
  dropdown: {
    style: ['菜单项 `typography-body-medium` · 选中 `text-face-primary`。'],
    layout: ['浮层内边距 `spacing-4` · 圆角 `radius-lg` + smooth。'],
    motion: ['出现 `EdsSemanticAnima(\'menu\')`。'],
    platform: ['触发器本组件仅负责锚点；浮层 Menu 平台分流见 Menu 详情。'],
  },
  feedback: {
    style: ['状态字 `typography-body-medium` · 语义色 `text-semantic-*`。'],
    layout: ['相对宿主定位；点直径/角标 inset 随场景。'],
  },
  icon: {
    style: ['SVG 描边/填充 · `text-base-primary` / `text-brand`。'],
    layout: ['正方 `symbol-*`。'],
  },
  index: {
    style: ['索引字 `typography-detail` · `text-base-tertiary`。'],
    layout: ['贴边 `spacing-2` · 行距 `spacing-3`。'],
  },
  input: {
    style: ['字 `typography-body-medium` · 值 `text-base-primary` · 占位 `text-base-tertiary` · 描边 `stroke-input`。'],
    layout: ['高度 `input-*` · 内边距 `spacing-4` / `spacing-5`。'],
    motion: ['focus `event-focus`（无整页 semantic）。'],
  },
  search: {
    style: ['底 `glass-gray-box` · 字/占位同 Input · 图标 `symbol-sm`（20px）。'],
    layout: ['高度 `input-md` · 圆角 `radius-full` · 默认外边距上/下/右 `spacing-6`。'],
  },
  textarea: {
    style: ['多行字 `typography-body-medium` · 描边/占位同 Input。'],
    layout: ['最小高度高档 `input-*` · 内边距 `spacing-4`。'],
  },
  link: {
    style: ['字 `typography-body-medium` · `text-brand` · 无填充底。'],
    layout: ['行内宽随文案 · 点按区 `spacing-4`。'],
    motion: ['按压 `EdsSemanticAnima(\'press\')`。'],
  },
  popovers: {
    style: ['气泡底 `material-card-moderate` · 字 `body-small` / `body-medium`。'],
    layout: ['箭头 inset `spacing-3` · 最大宽扣页边 `spacing-5`。'],
    motion: ['露出 `EdsSemanticAnima(\'slide\')` 或 popover recipe。'],
  },
  tab: {
    style: ['标签 `typography-body-medium` · 选中/未选字色 face / secondary。'],
    layout: ['段内 `spacing-1` · 胶囊 `radius-full`。'],
    motion: ['切换 `EdsSemanticAnima(\'layout-content\')`。'],
  },
  'toggle-block': {
    style: ['胶囊项字 `typography-body-medium` · 选中 face · 红点 `text-semantic-danger`。'],
    layout: ['横滚胶囊 `radius-full` · 项 `spacing-3` · 正文顶距 `spacing-4`。'],
    motion: ['切换 `EdsSemanticAnima(\'layout-content\')`。'],
  },
  'tab-bar': {
    style: ['项字 `typography-body-small` / heavy · 选中 `text-face-primary`。'],
    layout: ['栏高 token · 项 `spacing-4`。'],
    motion: ['点按 `EdsSemanticAnima(\'press\')`。'],
  },
  tag: {
    style: ['Color：色块 semantic · System：浅底 + `text-semantic-*`。'],
    layout: ['内边距 `spacing-2` · `spacing-3` · `radius-full`。'],
  },
  text: {
    style: ['Display / Title / Headline / Body / Detail / Footnote 字阶 class。'],
    layout: ['块级宽随父；行高走 typography token。'],
  },
  toggle: {
    style: ['轨道/壳 semantic 色；Switch 轨/拇指、Mark 勾/点各色票见子组件详情。'],
    layout: ['Switch 轨 scale · Mark 方壳 `toggle-mark-*`。'],
  },
  menu: {
    style: ['行字 `typography-body-medium` · 分组标题 `text-base-secondary`。'],
    layout: ['行内边距 `spacing-4` · 分组间距 `spacing-6`。'],
    motion: ['`EdsSemanticAnima(\'menu\')`。'],
    platform: ['iOS 26+ 系统 Menu 宿主；Android / ≤25 RN overlay（浮层本体，不含触发钮样式）。'],
  },
  sheets: {
    style: ['面板底 `material-card-shallow` / glass-mask · 把手/标题 `text-base-primary`。'],
    layout: ['档位高度 token · 内容左右 `spacing-5` · 顶栏占位含 safe area。'],
    motion: ['升起/降下 `EdsSemanticAnima(\'slide\')` · 拖拽关闭 recipe。'],
    platform: ['顶栏 scroll edge 绘制见 `EgScrollEdgeEffect`（非本组件布局栏）。'],
  },
  'data-list': {
    style: ['行主/副字 `typography-body-medium` / `body-small` · 副文 `text-base-secondary`。'],
    layout: ['行竖向 `spacing-4` · DL-bleed 左右 token。'],
    motion: ['行可点时 `EdsSemanticAnima(\'press\')`。'],
  },
  item: {
    style: ['主字 `typography-body-medium` · 值 `body-small` · `text-base-secondary`。'],
    layout: ['行高 `input-md` 对齐 · 组内 `spacing-4` · 组圆角 `radius-lg`。'],
    motion: ['可点行 `EdsSemanticAnima(\'press\')`。'],
  },
  page: {
    style: ['滚动区背景 `box-page`（`backgroundColor` / `style` 可覆盖）。'],
    layout: ['水平 `spacing-5` · 底 `spacing-10` · 顶 `contentPaddingTop` 默认 lg（12px）。'],
  },
  'page-shot': {
    style: ['弹层全屏区背景 `box-page` · 与 EgPage 同色票。'],
    layout: ['全屏宿主；内层仍用 EgPage content 边距契约（由组合方式决定）。'],
    motion: ['壳层 `EdsSemanticAnima(\'page-shot\')` 展开/收回（触发帧由业务传入）。'],
  },
  'nav-bar': {
    style: ['标题 `typography-body-medium-heavy` · 栏项玻璃钮色票同 Glass Capsule。'],
    layout: ['栏高 `EG_NAV_BAR_*` · 左右 `spacing-5` · 含 safe top。'],
    motion: ['栏项 `EdsSemanticAnima(\'press\')` · `background=auto` 随滚动淡入底。'],
    platform: ['iOS 26+ 页面栈用系统栏（本 RN 组件用于 ≤25 / 叠加场景）。'],
  },
  glass: {
    style: ['blur + tint 来自 `glass.surface` / `effect-glass-*`。'],
    layout: ['圆角 smoothRadius · blur 换算 `nativeBlurIntensity`。'],
    motion: ['按压/闪烁 recipe `glass-press` / `glass-shimmer`（若包在可点壳内）。'],
    platform: ['iOS 26+ 原生材质；Android / ≤25 expo-blur + token 叠层。'],
  },
  'glass-button': {
    style: ['同 Glass Capsule liquid preset · 字 `typography-body-medium`。'],
    layout: ['高度 `button-*` · `radius-full`。'],
    motion: ['`EdsSemanticAnima(\'press\')` + `glass-press`。'],
    platform: ['iOS 26+ Native · 其余 RN。'],
  },
  'symbol-button': {
    style: ['图标 `text-base-primary` · 容器 `material-card-shallow`。'],
    layout: ['正方 `button-md` · 图标 `symbol-md` 居中。'],
    motion: ['`EdsSemanticAnima(\'press\')`。'],
  },
  'scroll-edge': {
    style: ['单层 `glass-mask-box` · soft/hard 不透明度与渐变 token。'],
    layout: ['贴父顶/底/侧；宽同宿主；高由 scroll edge 测算。'],
    motion: ['随 scroll offset 显现（无 press semantic）。'],
    platform: ['RN `EgScrollEdgeEffect` 双端一致。'],
  },
  symbol: {
    style: ['`name` → Icon/Crypto SVG · 色 `color` / `mode`。'],
    layout: ['正方 `symbol-*` · 与父行图标槽对齐。'],
  },
};

export function buildFamilyComponentAnnotation(
  family: string,
  entry: Pick<ShowcaseCatalogEntry, 'slug' | 'exportName'>,
): ReturnType<typeof assembleComponentAnnotationDoc> {
  const spec: FamilySpec =
    FAMILY_SPECS[family] ?? {
      style: [`\`${entry.exportName}\` 色/字走 EDS semantic token（族 \`${family}\`）。`],
      layout: ['间距/圆角/控件高走 Figma Scale → `spacing-*` · `radius-*` · control 档。'],
    };

  const implemented = isShowcaseEntryImplemented(entry);
  return assembleComponentAnnotationDoc(spec, implemented);
}