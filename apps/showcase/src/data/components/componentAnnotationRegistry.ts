import type { ShowcaseComponentAnnotationDoc } from './componentAnnotationTypes';
import { assembleComponentAnnotationDoc } from './componentAnnotationAssemble';

/** 按 slug 完整覆盖 — 须遵守：样式/布局/动效只写该 slug 对应组件本体。 */
export const componentAnnotationBySlug: Record<string, ShowcaseComponentAnnotationDoc> = {
  'page-body': assembleComponentAnnotationDoc(
    {
      style: ['`EgPage` 滚动容器默认底 `box-page`；`style` / `backgroundColor` 可覆盖。'],
      layout: [
        '水平内边距 `spacing-5`（20px）',
        '底部内边距 `spacing-10`（40px）',
        '顶部 `contentPaddingTop`（Customize xs–2xl，默认 lg 12px）',
        '`contentContainerStyle` 最后合并覆盖',
      ],
      platform: [
        'iOS 26+ 常与系统 `UINavigationBar` 叠用：`contentInsetAdjustmentBehavior="automatic"`',
        'Scroll edge 静止 hidden · 滚入 soft 由页面栈/栏联动（非 EgPage 绘制）',
      ],
      other: ['详情「预览」展示全屏边距；页面转场在 Navigator / `EgEdsAnimaPage` 文档'],
    },
    true,
  ),
  'page-shot-body': assembleComponentAnnotationDoc(
    {
      style: ['`EgPageShot` 全屏弹层区背景 `box-page`（与页内 Scroll 色一致）。'],
      layout: ['全屏 Modal/Stack 宿主；内页内容仍用 EgPage 边距 props。'],
      motion: ['`EdsSemanticAnima(\'page-shot\')`：自触发元素 frame 展开/收回。'],
      platform: [
        'iOS 26+ 弹层内 `ScreenStack` 系统栏返回/关闭',
        'Android · iOS ≤25：RN Modal + `EgNavBar`',
      ],
      other: ['`EgPageShotTrigger` 负责触发元素与初始 frame'],
    },
    true,
  ),
  'glass-scroll-edge': assembleComponentAnnotationDoc(
    {
      style: ['`EgScrollEdgeEffect` 材质 `glass-mask-box` · soft/hard/automatic 不透明度与 blur token。'],
      layout: ['单层贴顶/底/侧；宽随父；高度由组件按栏/Sheet 占位测算。'],
      motion: ['随列表 scroll offset 淡入；无 press recipe。'],
      platform: ['双端 RN 同实现；iOS 26+ 页面栈可选用系统 scroll edge 同名语义。'],
      other: ['Showcase「全屏演示」→ scroll-edge-demo'],
    },
    true,
  ),
  'glass-eg': assembleComponentAnnotationDoc(
    {
      style: ['`EdsGlassView` / `EgGlass` blur + liquid tint · 高光/描边 `glass.surface`。'],
      layout: ['圆角 `smoothRadius` · 内容区 padding 由 props `style` 传入。'],
      motion: ['可点宿主包一层时 `glass-press` / `glass-shimmer`。'],
      platform: ['iOS 26+ 原生 Liquid Glass；Android / ≤25 expo-blur + token。'],
    },
    true,
  ),
  'button-glass': assembleComponentAnnotationDoc(
    {
      style: ['`EgGlassCapsule` liquid preset · 文案 `typography-body-medium` · `text-base-primary`。'],
      layout: ['高度 `button-*` · 水平 `spacing-4` · `radius-full`。'],
      motion: ['`EdsSemanticAnima(\'press\')` · `glass-press` / `glass-shimmer`。'],
      platform: ['iOS 26+ `EgGlassCapsuleNative`；其余 `EgGlassCapsuleRn`。'],
    },
    true,
  ),
  'menu-body': assembleComponentAnnotationDoc(
    {
      style: ['菜单行 `typography-body-medium` · 危险/禁用色走 semantic。'],
      layout: ['行高 `input-md` 对齐 · 行内 `spacing-4` · 分组间距 `spacing-6`。'],
      motion: ['`EdsSemanticAnima(\'menu\')` 出现/消失。'],
      platform: ['iOS 26+ 系统 Menu；其余 RN 浮层（锚点由触发器组件提供）。'],
    },
    true,
  ),
  'sheets-body': assembleComponentAnnotationDoc(
    {
      style: ['面板底 `material-card-shallow` · 标题/把手 `text-base-primary`。'],
      layout: ['档位高度 token · 内容左右 `spacing-5` · actions 贴底。'],
      motion: ['`EdsSemanticAnima(\'slide\')` · 拖拽关闭。'],
      platform: ['顶栏 scroll edge：`EgScrollEdgeEffect` hard（automatic 档解析）'],
    },
    true,
  ),
  'item-body': assembleComponentAnnotationDoc(
    {
      style: ['主文案 `typography-body-medium` · 值 `body-small` · `text-base-secondary`。'],
      layout: ['`EgItemGroup` 内边距 `spacing-1` · 行 `spacing-4` · 圆角 `radius-lg`。'],
      motion: ['可点行 `EdsSemanticAnima(\'press\')`。'],
    },
    true,
  ),
  'data-list-body': assembleComponentAnnotationDoc(
    {
      style: ['行主/副字 `typography-body-medium` / `body-small`。'],
      layout: ['行 `spacing-4` · DL-bleed 水平 token。'],
      motion: ['可点行 `EdsSemanticAnima(\'press\')`。'],
    },
    true,
  ),
  'symbol-body': assembleComponentAnnotationDoc(
    {
      style: ['`EgSymbol`：`name` → Icon/Crypto SVG · `color` + `mode`。'],
      layout: ['正方 `symbol-xs` … `symbol-xl`（`size` prop）。'],
    },
    true,
  ),
  'button-body': assembleComponentAnnotationDoc(
    {
      style: ['`EgButton` 场景 preset（Brand/Primary 等）底色与字色 token。'],
      layout: ['高度 `button-*` · 内边距 `spacing-5` / 图标 `spacing-1`。'],
      motion: ['`EdsSemanticAnima(\'press\')`。'],
    },
    true,
  ),
  'input-body': assembleComponentAnnotationDoc(
    {
      style: ['字 `typography-body-medium` · 描边 `stroke-input` · focus `event-focus-brand`。'],
      layout: ['高度 `input-*` · 左右 `spacing-4` · `spacing-5`。'],
      motion: ['focus `event-focus`。'],
    },
    true,
  ),
  'search-body': assembleComponentAnnotationDoc(
    {
      style: ['底 `material-card-shallow` · 占位/输入字色同 Input。'],
      layout: ['高 `input-md` · 圆角 `radius-lg` + smooth · 搜索图标槽。'],
    },
    true,
  ),
  'textarea-body': assembleComponentAnnotationDoc(
    {
      style: ['多行 `typography-body-medium` · 描边/占位同 Input。'],
      layout: ['最小高度高档 `input-*` · 内边距 `spacing-4`。'],
    },
    true,
  ),
  'link-body': assembleComponentAnnotationDoc(
    {
      style: ['`EgLink` 字 `text-brand` · `typography-body-medium` · 无底。'],
      layout: ['行内宽随文案。'],
      motion: ['`EdsSemanticAnima(\'press\')`。'],
    },
    true,
  ),
  'glass-button-body': assembleComponentAnnotationDoc(
    {
      style: ['液态玻璃 Capsule preset · 字 `typography-body-medium`。'],
      layout: ['`button-*` 高 · `radius-full`。'],
      motion: ['`EdsSemanticAnima(\'press\')` + glass recipe。'],
      platform: ['iOS 26+ Native · 其余 RN。'],
    },
    true,
  ),
  'symbol-button-body': assembleComponentAnnotationDoc(
    {
      style: ['图标色 `text-base-primary` · 底 `material-card-shallow`。'],
      layout: ['正方 `button-md` · 图标居中 `symbol-md`。'],
      motion: ['`EdsSemanticAnima(\'press\')`。'],
    },
    true,
  ),
  'tab-bar-text': assembleComponentAnnotationDoc(
    {
      style: ['项字 `typography-body-small-heavy` · 选中 `text-face-primary`。'],
      layout: ['栏高 token · 项间距 `spacing-4`（纯文本项无 icon 槽）。'],
      motion: ['点按 `EdsSemanticAnima(\'press\')`。'],
    },
    true,
  ),
  'tab-block': assembleComponentAnnotationDoc(
    {
      style: ['`EgToggle` 胶囊项字 `typography-body-medium` · 红点语义色。'],
      layout: ['横滚 `radius-full` · 正文 `spacing-4` 顶距。'],
      motion: ['切换 `EdsSemanticAnima(\'layout-content\')`。'],
    },
    true,
  ),
};