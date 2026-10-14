import { getThemeColors } from '../theme/index.js';

function applyAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Resolve semantic color tokens that reference `--eds-brand` for RN StyleSheet. */
export function resolveColor(colors: Record<string, string>, token: string): string {
  const raw = colors[token];
  const fallbackColors = getThemeColors('light');
  if (!raw) return fallbackColors.base as string;
  if (raw.startsWith('#')) return raw;

  if (raw.includes('var(--eds-brand)')) {
    const opacityMatch = raw.match(/\/\s*([\d.]+)\)/);
    const alpha = opacityMatch ? Number.parseFloat(opacityMatch[1]) : 1;
    const brand = (colors.brand ?? fallbackColors.brand) as string;
    return alpha >= 1 ? brand : applyAlpha(brand, alpha);
  }

  return raw;
}
