import type {
  EgNavBarScrollEdgeEffect,
  EgSheetsActionsBlankCompensation,
  EgSheetsDetent,
} from '@eds/mobile-components';

import { buildRnSelfClosingSnippet } from './buildRnUsageSnippet.js';
import { SHOWCASE_SHEETS_DETENT_SIZE_OPTIONS } from './showcaseSizeOptions.js';
import type { DocCustomizeControl } from './types.js';

const DETENT_KEYS: { detent: EgSheetsDetent; key: string }[] = [
  { detent: 'small', key: 'detentSmall' },
  { detent: 'medium', key: 'detentMedium' },
  { detent: 'large', key: 'detentLarge' },
  { detent: 'adaptive', key: 'detentAdaptive' },
];

const SCROLL_EDGE_EFFECTS: EgNavBarScrollEdgeEffect[] = ['automatic', 'hard', 'soft', 'hidden'];

/** scroll edge effect 选项（iOS 26 同名）— EgSheets / EgNavBar 定制共用。 */
export const SCROLL_EDGE_EFFECT_OPTIONS = [
  { value: 'soft', label: 'soft · 渐变淡出 · 无底线' },
  { value: 'hard', label: 'hard · 渐变更实 · 有底线' },
  { value: 'automatic', label: 'automatic · 页面 soft / Sheet hard' },
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
  showDragIndicator: false,
  scrollEdgeEffect: 'soft',
  content: 'slot',
  showActions: true,
  actionsBlankCompensation: '',
  flushToEdges: false,
};

const ACTIONS_BLANK_COMPENSATION_KEYS = [
  'spacing-1',
  'spacing-2',
  'spacing-3',
  'spacing-4',
  'spacing-5',
  'spacing-6',
  'spacing-8',
  'spacing-10',
  'spacing-12',
  'spacing-14',
  'spacing-16',
] as const satisfies readonly EgSheetsActionsBlankCompensation[];

export const ACTIONS_BLANK_COMPENSATION_OPTIONS = [
  { value: '', label: '不设置（默认）' },
  ...ACTIONS_BLANK_COMPENSATION_KEYS.map((value) => ({
    value,
    label: `${value} · 扣减对应 px`,
  })),
];

export function parseActionsBlankCompensation(
  value: unknown,
): EgSheetsActionsBlankCompensation | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  const key = String(value);
  return ACTIONS_BLANK_COMPENSATION_KEYS.find((item) => item === key);
}

export type SheetsContentKind = 'slot' | 'long';

export const sheetsCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'title', label: '标题', placeholder: '标题' },
  { kind: 'boolean', key: 'showTitle', label: '显示标题' },
  { kind: 'boolean', key: 'showLeft', label: '左侧返回', row: 2 },
  { kind: 'boolean', key: 'showRight', label: '右侧关闭', row: 2 },
  { kind: 'heading', key: 'detentHeading', label: '档位' },
  { kind: 'boolean', key: 'detentSmall', label: 'SM 28%', row: 3 },
  { kind: 'boolean', key: 'detentMedium', label: 'MD 50%', row: 3 },
  { kind: 'boolean', key: 'detentLarge', label: 'LG · spacing-0', row: 3 },
  { kind: 'boolean', key: 'detentAdaptive', label: '自适应', row: 4 },
  {
    kind: 'select',
    key: 'initialDetent',
    label: '初始档位',
    options: [
      ...SHOWCASE_SHEETS_DETENT_SIZE_OPTIONS,
      { value: 'adaptive', label: '自适应' },
    ],
  },
  { kind: 'boolean', key: 'flushToEdges', label: '贴边' },
  { kind: 'boolean', key: 'dismissible', label: '遮罩 / 下拉收起' },
  { kind: 'boolean', key: 'showDragIndicator', label: '拖拽指示条' },
  {
    kind: 'select',
    key: 'scrollEdgeEffect',
    label: '顶栏 scroll edge（滚入栏下显现）',
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
  {
    kind: 'select',
    key: 'actionsBlankCompensation',
    label: '留白补偿（仅 Action + adaptive）',
    options: ACTIONS_BLANK_COMPENSATION_OPTIONS,
  },
];

export type SheetsPreviewProps = {
  title: string;
  showTitle: boolean;
  showLeft: boolean;
  showRight: boolean;
  detents: EgSheetsDetent[];
  initialDetent: EgSheetsDetent;
  dismissible: boolean;
  showDragIndicator: boolean;
  scrollEdgeEffect: EgNavBarScrollEdgeEffect;
  content: SheetsContentKind;
  showActions: boolean;
  actionsBlankCompensation?: EgSheetsActionsBlankCompensation;
  flushToEdges: boolean;
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
    showDragIndicator: Boolean(merged.showDragIndicator),
    scrollEdgeEffect: parseScrollEdgeEffect(merged.scrollEdgeEffect) ?? 'soft',
    content: merged.content === 'long' ? 'long' : 'slot',
    showActions: Boolean(merged.showActions),
    actionsBlankCompensation: parseActionsBlankCompensation(merged.actionsBlankCompensation),
    flushToEdges: Boolean(merged.flushToEdges),
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
        showDragIndicator: false,
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
