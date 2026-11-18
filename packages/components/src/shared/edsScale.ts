import { mobileTheme } from '../theme/index.js';

/** `scale-1` × unit — 与 spec `scaleBase`（4px）一致。 */
function edsScaleBasePx(): number {
  const unit = mobileTheme.scale['scale-1'];
  const spacingOne = mobileTheme.spacing['spacing-1'];
  if (typeof unit === 'number' && typeof spacingOne === 'number' && unit > 0) {
    return spacingOne / unit;
  }
  return 4;
}

/** Scale 原语 → px（`scale-4` → 16）。间距 / 边距 / gap 请用 `mobileTheme.spacing`。 */
export function edsScalePx(scaleToken: string): number {
  const multiplier = mobileTheme.scale[scaleToken];
  if (typeof multiplier !== 'number' || !Number.isFinite(multiplier)) {
    return 0;
  }
  return multiplier * edsScaleBasePx();
}