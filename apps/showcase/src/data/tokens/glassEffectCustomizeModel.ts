/**
 * Components 详情定制（非 Effect 令牌页）：
 * - **BlurGlass** — `EgGlass` + Effect Glass Box
 * - **ScrollEdgeEffect** — `EgScrollEdgeEffect` · `glass-mask-box` 材质
 */
import type { EgScrollEdgeEffectStyle, GlassBoxClassName } from '@eds/mobile-components';

import type { DocCustomizeControl } from '@/data/components';

/** Effect Glass Box 场景 — BlurGlass 预览。 */
export const GLASS_BLUR_BOX_OPTIONS: { value: GlassBoxClassName; label: string }[] = [
  { value: 'glass-button-box', label: 'Button Box' },
  { value: 'glass-menu-box', label: 'Menu Box' },
  { value: 'glass-sheets-box', label: 'Sheets Box' },
  { value: 'glass-tabbar-box', label: 'TabBar Box' },
  { value: 'glass-tabbar-bg', label: 'TabBar BG' },
  { value: 'glass-mask-box', label: 'Mask Box' },
  { value: 'glass-gray-box', label: 'Gray Box' },
];

/** iOS 26 `scrollEdgeEffectStyle(_:for:)` 三档；隐藏走 `scrollEdgeEffectHidden` 开关。 */
export const SCROLL_EDGE_STYLE_OPTIONS: { value: Exclude<EgScrollEdgeEffectStyle, 'hidden'>; label: string }[] = [
  { value: 'automatic', label: 'automatic' },
  { value: 'soft', label: 'soft' },
  { value: 'hard', label: 'hard' },
];

/** `automatic` 的解析宿主 — 普通页面 soft · Sheet hard。 */
export const SCROLL_EDGE_CONTAINER_OPTIONS = [
  { value: 'page', label: '页面' },
  { value: 'sheet', label: 'Sheet' },
] as const;

/** EgGlass 详情默认 — BlurGlass。 */
export function defaultBlurGlassCustomizeState(box: GlassBoxClassName = 'glass-button-box'): Record<string, unknown> {
  return { box, mode: 'light' };
}

/** EgScrollEdgeEffect 详情默认 — 顶 hard · 底 soft。 */
export function defaultScrollEdgeCustomizeState(): Record<string, unknown> {
  return {
    mode: 'light',
    container: 'page',
    topEdgeStyle: 'hard',
    topEdgeHidden: false,
    bottomEdgeStyle: 'soft',
    bottomEdgeHidden: false,
    title: '标题',
    showTitle: true,
    showLeft: true,
    showRight: true,
    rightIconCount: '1',
  };
}

export const blurGlassCustomizeControls: DocCustomizeControl[] = [
  { kind: 'select', key: 'box', label: 'Box', options: GLASS_BLUR_BOX_OPTIONS },
  {
    kind: 'select',
    key: 'mode',
    label: '外观',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
  },
];

export const scrollEdgeCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'mode',
    label: '外观',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
  },
  { kind: 'heading', key: 'topEdgeHeading', label: '顶部边缘' },
  {
    kind: 'select',
    key: 'topEdgeStyle',
    label: '样式',
    options: SCROLL_EDGE_STYLE_OPTIONS,
    visibleWhen: (state) => state.topEdgeHidden !== true,
  },
  { kind: 'boolean', key: 'topEdgeHidden', label: '隐藏' },
  { kind: 'heading', key: 'bottomEdgeHeading', label: '底部边缘' },
  {
    kind: 'select',
    key: 'bottomEdgeStyle',
    label: '样式',
    options: SCROLL_EDGE_STYLE_OPTIONS,
    visibleWhen: (state) => state.bottomEdgeHidden !== true,
  },
  { kind: 'boolean', key: 'bottomEdgeHidden', label: '隐藏' },
  { kind: 'heading', key: 'scrollEdgeHostHeading', label: '宿主' },
  {
    kind: 'select',
    key: 'container',
    label: '容器（automatic 解析）',
    options: [...SCROLL_EDGE_CONTAINER_OPTIONS],
  },
  { kind: 'boolean', key: 'showLeft', label: '返回' },
  { kind: 'boolean', key: 'showTitle', label: '标题' },
  {
    kind: 'text',
    key: 'title',
    label: '标题文案',
    visibleWhen: (state) => state.showTitle !== false,
  },
  { kind: 'boolean', key: 'showRight', label: '右侧操作' },
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
];

export function resolveScrollEdgeStyle(
  state: Record<string, unknown>,
  edge: 'top' | 'bottom',
): EgScrollEdgeEffectStyle {
  if (state[`${edge}EdgeHidden`] === true) return 'hidden';
  const value = state[`${edge}EdgeStyle`];
  return SCROLL_EDGE_STYLE_OPTIONS.find((option) => option.value === value)?.value ?? 'automatic';
}
