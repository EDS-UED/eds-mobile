import { mobileTheme } from '../theme/index.js';
import { edsScalePx } from './edsScale.js';
import type { ControlSize, TagSize, ToggleSize } from './types.js';

const spacing = mobileTheme.spacing;

export function buttonHeight(size: ControlSize): number {
  return spacing[`button-${size}`] as number;
}

export function inputHeight(size: ControlSize): number {
  return spacing[`input-${size}`] as number;
}

export function dropdownHeight(size: ControlSize): number {
  return spacing[`dropdown-${size}`] as number;
}

export function tagHeight(size: TagSize): number {
  return spacing[`tag-${size}`] as number;
}

export function switchTrackHeight(size: ToggleSize): number {
  return spacing[`switch-${size}`] as number;
}

/** Switch track width — scale 原语（sm `scale-8` · md `scale-11` · lg `scale-13`）。 */
export function switchTrackWidth(size: ToggleSize): number {
  switch (size) {
    case 'sm':
      return edsScalePx('scale-8');
    case 'lg':
      return edsScalePx('scale-13');
    case 'md':
    default:
      return edsScalePx('scale-11');
  }
}

/** Switch knob 边长 — scale 原语（sm `scale-4` · md `scale-5-5` · lg `scale-7`）。 */
export function switchThumbSize(size: ToggleSize): number {
  switch (size) {
    case 'sm':
      return edsScalePx('scale-4');
    case 'lg':
      return edsScalePx('scale-7');
    case 'md':
    default:
      return edsScalePx('scale-5-5');
  }
}

export function checkboxSize(size: ToggleSize): number {
  return spacing[`checkbox-${size}`] as number;
}

export function radioSize(size: ToggleSize): number {
  return spacing[`radio-${size}`] as number;
}

/** Button 胶囊 — 左右内边距（宽高由边距 + 文案决定，无固定 button-* 高度）。 */
export function buttonPaddingHorizontal(size: ControlSize): number {
  switch (size) {
    case 'xl':
    case 'lg':
      return spacing['spacing-7'] as number;
    case 'md':
    case 'sm':
      return spacing['spacing-4'] as number;
    case 'xs':
    default:
      return spacing['spacing-3'] as number;
  }
}

export function buttonPaddingVertical(size: ControlSize): number {
  switch (size) {
    case 'xl':
    case 'lg':
      return spacing['spacing-4'] as number;
    case 'md':
      return spacing['spacing-2-5'] as number;
    case 'sm':
      return spacing['spacing-2'] as number;
    case 'xs':
    default:
      return spacing['spacing-1'] as number;
  }
}

export function fieldPaddingHorizontal(size: ControlSize): number {
  return size === 'xs' || size === 'sm'
    ? (spacing['spacing-3'] as number)
    : (spacing['spacing-4'] as number);
}

export function iconSizeForControl(size: ControlSize): number {
  return size === 'xs' || size === 'sm'
    ? (spacing['symbol-xs'] as number)
    : (spacing['symbol-sm'] as number);
}
