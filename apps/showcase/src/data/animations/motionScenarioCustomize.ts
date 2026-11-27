import type { DocCustomizeControl } from '@/data/components';
import { SHOWCASE_MOTION_PRESS_INTENSITY_OPTIONS } from '@/data/components/showcaseSizeOptions';

export type MotionScenarioId =
  | 'press'
  | 'slide'
  | 'layout-content'
  | 'fade'
  | 'deform'
  | 'offset'
  | 'menu'
  | 'sheets'
  | 'page'
  | 'page-shot';

export type MotionScenarioCustomizeState = {
  pressIntensity: 'xs' | 'sm' | 'md' | 'lg';
  pressScaleDirection: 'up' | 'down';
  slidePressScale: boolean;
  slideFollowDrag: boolean;
  pageHorizontal: boolean;
  pageHorizontalReverse: boolean;
  pageVertical: boolean;
  pageDragDismiss: boolean;
  offsetHorizontal: boolean;
  offsetVertical: boolean;
  offsetTrigger: boolean;
  deformLength: boolean;
  deformShape: boolean;
  deformSwap: boolean;
};

export function defaultMotionScenarioCustomizeState(): MotionScenarioCustomizeState {
  return {
    pressIntensity: 'sm',
    pressScaleDirection: 'up',
    slidePressScale: true,
    slideFollowDrag: true,
    pageHorizontal: true,
    pageHorizontalReverse: false,
    pageVertical: false,
    pageDragDismiss: true,
    offsetHorizontal: true,
    offsetVertical: false,
    offsetTrigger: false,
    deformLength: true,
    deformShape: false,
    deformSwap: false,
  };
}

const OFFSET_MODE_KEYS = ['offsetHorizontal', 'offsetVertical', 'offsetTrigger'] as const;
type OffsetModeKey = (typeof OFFSET_MODE_KEYS)[number];

export function mergeOffsetMode(
  prev: MotionScenarioCustomizeState,
  next: Record<string, unknown>,
): Pick<MotionScenarioCustomizeState, OffsetModeKey> {
  const pick = (active: OffsetModeKey) =>
    Object.fromEntries(OFFSET_MODE_KEYS.map((key) => [key, key === active])) as Pick<
      MotionScenarioCustomizeState,
      OffsetModeKey
    >;
  const turnedOn = OFFSET_MODE_KEYS.find((key) => next[key] === true && !prev[key]);
  if (turnedOn) return pick(turnedOn);
  const turnedOff = OFFSET_MODE_KEYS.find((key) => next[key] === false && prev[key]);
  if (turnedOff) return pick('offsetHorizontal');
  return pick(OFFSET_MODE_KEYS.find((key) => prev[key]) ?? 'offsetHorizontal');
}

export type OffsetScenarioAxis = 'horizontal' | 'vertical' | 'trigger';

export function offsetAxisOf(state: MotionScenarioCustomizeState): OffsetScenarioAxis {
  if (state.offsetVertical) return 'vertical';
  if (state.offsetTrigger) return 'trigger';
  return 'horizontal';
}

const DEFORM_MODE_KEYS = ['deformLength', 'deformShape', 'deformSwap'] as const;
type DeformModeKey = (typeof DEFORM_MODE_KEYS)[number];

export function mergeDeformMode(
  prev: MotionScenarioCustomizeState,
  next: Record<string, unknown>,
): Pick<MotionScenarioCustomizeState, DeformModeKey> {
  const pick = (active: DeformModeKey) =>
    Object.fromEntries(DEFORM_MODE_KEYS.map((key) => [key, key === active])) as Pick<
      MotionScenarioCustomizeState,
      DeformModeKey
    >;
  const turnedOn = DEFORM_MODE_KEYS.find((key) => next[key] === true && !prev[key]);
  if (turnedOn) return pick(turnedOn);
  const turnedOff = DEFORM_MODE_KEYS.find((key) => next[key] === false && prev[key]);
  if (turnedOff) return pick('deformLength');
  return pick(DEFORM_MODE_KEYS.find((key) => prev[key]) ?? 'deformLength');
}

export type DeformScenarioKind = 'length' | 'shape' | 'swap';

export function deformKindOf(state: MotionScenarioCustomizeState): DeformScenarioKind {
  if (state.deformShape) return 'shape';
  if (state.deformSwap) return 'swap';
  return 'length';
}

const PAGE_DIRECTION_KEYS = ['pageHorizontal', 'pageHorizontalReverse', 'pageVertical'] as const;
type PageDirectionKey = (typeof PAGE_DIRECTION_KEYS)[number];

export function mergePageDirection(
  prev: MotionScenarioCustomizeState,
  next: Record<string, unknown>,
): Pick<MotionScenarioCustomizeState, PageDirectionKey> {
  const pick = (active: PageDirectionKey) =>
    Object.fromEntries(PAGE_DIRECTION_KEYS.map((key) => [key, key === active])) as Pick<
      MotionScenarioCustomizeState,
      PageDirectionKey
    >;
  const turnedOn = PAGE_DIRECTION_KEYS.find((key) => next[key] === true && !prev[key]);
  if (turnedOn) return pick(turnedOn);
  const turnedOff = PAGE_DIRECTION_KEYS.find((key) => next[key] === false && prev[key]);
  if (turnedOff) return pick('pageHorizontal');
  return pick(PAGE_DIRECTION_KEYS.find((key) => prev[key]) ?? 'pageHorizontal');
}

export function pageDirectionOf(
  state: MotionScenarioCustomizeState,
): 'horizontal' | 'horizontal-reverse' | 'vertical' {
  if (state.pageVertical) return 'vertical';
  return state.pageHorizontalReverse ? 'horizontal-reverse' : 'horizontal';
}

export function motionScenarioCustomizeControls(scenario: MotionScenarioId): DocCustomizeControl[] {
  if (scenario === 'slide') {
    return [
      { kind: 'boolean', key: 'slidePressScale', label: '点按缩放', row: 0 },
      { kind: 'boolean', key: 'slideFollowDrag', label: '胶囊跟手', row: 0 },
    ];
  }

  if (scenario === 'page') {
    return [
      { kind: 'heading', key: 'pageDirectionHeading', label: '方向' },
      {
        kind: 'boolean',
        key: 'pageHorizontal',
        label: '左右',
        exclusiveKeys: ['pageHorizontalReverse', 'pageVertical'],
      },
      {
        kind: 'boolean',
        key: 'pageHorizontalReverse',
        label: '右左',
        exclusiveKeys: ['pageHorizontal', 'pageVertical'],
      },
      {
        kind: 'boolean',
        key: 'pageVertical',
        label: '上下',
        exclusiveKeys: ['pageHorizontal', 'pageHorizontalReverse'],
      },
      { kind: 'heading', key: 'pageGestureHeading', label: '手势' },
      { kind: 'boolean', key: 'pageDragDismiss', label: '拖拽关闭' },
    ];
  }

  if (scenario === 'press') {
    return [
      {
        kind: 'select',
        key: 'pressIntensity',
        label: '点按强度',
        options: [...SHOWCASE_MOTION_PRESS_INTENSITY_OPTIONS],
      },
      {
        kind: 'select',
        key: 'pressScaleDirection',
        label: '缩放方向',
        options: [
          { label: '放大', value: 'up' },
          { label: '缩小', value: 'down' },
        ],
      },
    ];
  }

  if (scenario === 'deform') {
    return [
      { kind: 'heading', key: 'deformModeHeading', label: '形态' },
      {
        kind: 'boolean',
        key: 'deformLength',
        label: '尺寸',
        exclusiveKeys: ['deformShape', 'deformSwap'],
      },
      {
        kind: 'boolean',
        key: 'deformShape',
        label: '形状',
        exclusiveKeys: ['deformLength', 'deformSwap'],
      },
      {
        kind: 'boolean',
        key: 'deformSwap',
        label: '元素',
        exclusiveKeys: ['deformLength', 'deformShape'],
      },
    ];
  }

  if (scenario === 'offset') {
    return [
      { kind: 'heading', key: 'offsetModeHeading', label: '位移' },
      {
        kind: 'boolean',
        key: 'offsetHorizontal',
        label: '左右',
        exclusiveKeys: ['offsetVertical', 'offsetTrigger'],
      },
      {
        kind: 'boolean',
        key: 'offsetVertical',
        label: '上下',
        exclusiveKeys: ['offsetHorizontal', 'offsetTrigger'],
      },
      {
        kind: 'boolean',
        key: 'offsetTrigger',
        label: '触发器',
        exclusiveKeys: ['offsetHorizontal', 'offsetVertical'],
      },
    ];
  }

  return [];
}