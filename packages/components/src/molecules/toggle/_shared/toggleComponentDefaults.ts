import type { ToggleSize } from '../../../shared/types.js';

/** Toggle 族 — Checkbox / Radio / Decide 默认尺寸。 */
export const EG_TOGGLE_MARK_DEFAULT_SIZE: ToggleSize = 'md';

/** EgSwitch — 业务默认档（与 Figma Switch 默认 LG 一致）。 */
export const EG_SWITCH_DEFAULT_SIZE: ToggleSize = 'lg';

export const EG_SWITCH_DEFAULT_VALUE = false;

export const egSwitchComponentDefaults = {
  size: EG_SWITCH_DEFAULT_SIZE,
  defaultValue: EG_SWITCH_DEFAULT_VALUE,
} as const;

export const egToggleMarkComponentDefaults = {
  size: EG_TOGGLE_MARK_DEFAULT_SIZE,
  defaultChecked: false,
  defaultDecided: false,
} as const;

/** 归一化 `size` — 非法/空 → {@link EG_SWITCH_DEFAULT_SIZE}。 */
export function resolveEgSwitchSize(size: unknown): ToggleSize {
  if (size === 'sm' || size === 'md' || size === 'lg') {
    return size;
  }
  return EG_SWITCH_DEFAULT_SIZE;
}