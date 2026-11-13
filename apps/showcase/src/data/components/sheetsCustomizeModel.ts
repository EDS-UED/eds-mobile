import type { EgNavBarScrollEdgeEffect, EgSheetsDetent } from '@eds/mobile-components';

import { buildRnSelfClosingSnippet } from './buildRnUsageSnippet.js';
import type { DocCustomizeControl } from './types.js';

const DETENT_KEYS: { detent: EgSheetsDetent; key: string }[] = [
  { detent: 'small', key: 'detentSmall' },
  { detent: 'medium', key: 'detentMedium' },
  { detent: 'large', key: 'detentLarge' },
  { detent: 'adaptive', key: 'detentAdaptive' },
];

const SCROLL_EDGE_EFFECTS: EgNavBarScrollEdgeEffect[] = ['automatic', 'hard', 'soft', 'hidden'];

/** iOS 26+ 系统 scroll edge effect 选项 — EgSheets / EgNavBar 定制共用。 */
export const SCROLL_EDGE_EFFECT_OPTIONS = [
  { value: 'soft', label: 'soft · 透明渐变模糊 · 无底线' },
  { value: 'hard', label: 'hard · 半不透明底 · 有底线' },
  { value: 'automatic', label: 'automatic · 系统决定' },
  { value: 'hidden', label: 'hidden · 无效果' },
];

export function parseScrollEdgeEffect(value: unknown): EgNavBarScrollEdgeEffect | undefined {
  return SCROLL_EDGE_EFFECTS.find((item) => item === value);
}

export const sheetsCustomizeDefaults: Record<string, unknown> = {
  title: '标题',
  showTitle: true,
  showLeft: false,
  showRight: true,
  detentSmall: false,
  detentMedium: true,
  detentLarge: true,
  detentAdaptive: false,
  initialDetent: 'medium',
  dismissible: true,
  scrollEdgeEffect: 'soft',
  content: 'slot',
  showActions: true,
};

export type SheetsContentKind = 'slot' | 'long';

export const sheetsCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'title', label: '标题', placeholder: '标题' },
  { kind: 'boolean', key: 'showTitle', label: '显示标题' },
  { kind: 'boolean', key: 'showLeft', label: '左侧返回', row: 2 },
  { kind: 'boolean', key: 'showRight', label: '右侧关闭', row: 2 },
  { kind: 'heading', key: 'detentHeading', label: '档位' },
  { kind: 'boolean', key: 'detentSmall', label: '小 28%', row: 3 },
  { kind: 'boolean', key: 'detentMedium', label: '中 50%', row: 3 },
  { kind: 'boolean', key: 'detentLarge', label: '大 · 贴系统条 spacing-0', row: 3 },
  { kind: 'boolean', key: 'detentAdaptive', label: '自适应', row: 4 },
  {
    kind: 'select',
    key: 'initialDetent',
    label: '初始档位',
    options: [
      { value: 'small', label: '小' },
      { value: 'medium', label: '中' },
      { value: 'adaptive', label: '自适应' },
      { value: 'large', label: '大' },
    ],
  },
  { kind: 'boolean', key: 'dismissible', label: '遮罩 / 下拉收起' },
  {
    kind: 'select',
    key: 'scrollEdgeEffect',
    label: '顶栏背景 · iOS 26+ 滚动时 scroll edge（静止 hidden）',
    options: SCROLL_EDGE_EFFECT_OPTIONS,
  },
  {
    kind: 'select',
    key: 'content',
    label: '内容插槽',
    options: [
      { value: 'slot', label: '插槽占位' },
      { value: 'long', label: '长文本（测滚动）' },
    ],
  },
  { kind: 'boolean', key: 'showActions', label: '底部 Action' },
];

export type SheetsPreviewProps = {
  title: string;
  showTitle: boolean;
  showLeft: boolean;
  showRight: boolean;
  detents: EgSheetsDetent[];
  initialDetent: EgSheetsDetent;
  dismissible: boolean;
  scrollEdgeEffect: EgNavBarScrollEdgeEffect;
  content: SheetsContentKind;
  showActions: boolean;
};

export function buildSheetsPropsFromCustomize(state: Record<string, unknown>): SheetsPreviewProps {
  const merged = { ...sheetsCustomizeDefaults, ...state };
  const picked = DETENT_KEYS.filter(({ key }) => Boolean(merged[key])).map(({ detent }) => detent);
  const detents: EgSheetsDetent[] = picked.length > 0 ? picked : ['medium', 'large'];
  const initialRaw = String(merged.initialDetent) as EgSheetsDetent;
  return {
    title: String(merged.title ?? ''),
    showTitle: Boolean(merged.showTitle),
    showLeft: Boolean(merged.showLeft),
    showRight: Boolean(merged.showRight),
    detents,
    initialDetent: detents.includes(initialRaw) ? initialRaw : detents[0]!,
    dismissible: Boolean(merged.dismissible),
    scrollEdgeEffect: parseScrollEdgeEffect(merged.scrollEdgeEffect) ?? 'soft',
    content: merged.content === 'long' ? 'long' : 'slot',
    showActions: Boolean(merged.showActions),
  };
}

export function buildSheetsUsageSnippet(state: Record<string, unknown>): string {
  const props = buildSheetsPropsFromCustomize(state);
  const defaults = buildSheetsPropsFromCustomize({});
  const { content: _content, showActions, ...rest } = props;
  const snippet = buildRnSelfClosingSnippet(
    'EgSheets',
    {
      ...rest,
      detents: props.detents.join() === defaults.detents.join() ? undefined : props.detents,
      initialDetent: props.initialDetent === defaults.initialDetent ? undefined : props.initialDetent,
    },
    {
      defaults: {
        title: '',
        showTitle: true,
        showLeft: false,
        showRight: true,
        dismissible: true,
        scrollEdgeEffect: 'soft',
      },
    },
  );
  const actionsProp = showActions
    ? '\n  // actions 缺省为 EgBrandButton「确认」；传入即替换（按钮数量 / 样式 / 组合自定义）'
    : '\n  showActions={false}';
  return snippet
    .replace('<EgSheets', `<EgSheets\n  visible={open}\n  onDismiss={() => setOpen(false)}${actionsProp}`)
    .replace(/\s*\/>\s*$/, '\n>\n  {/* 内容插槽 */}\n</EgSheets>');
}
