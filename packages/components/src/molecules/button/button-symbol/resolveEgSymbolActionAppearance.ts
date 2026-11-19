import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors } from '../../../theme/index.js';
import type { EgSymbolActionTone } from './EgSymbolAction.types.js';

type ThemeColors = ReturnType<typeof getThemeColors>;

export type EgSymbolActionAppearance = {
  backgroundColor: string;
  strokeColorToken: string;
  spinnerColorToken: string;
};

/** 色调 → 容器底 / 图标 stroke token（对齐 Figma iCon Container）。 */
export function resolveEgSymbolActionAppearance(
  colors: ThemeColors,
  tone: EgSymbolActionTone,
  pressed: boolean,
): EgSymbolActionAppearance {
  switch (tone) {
    case 'brand':
      return {
        backgroundColor: resolveColor(colors, 'material-brand'),
        strokeColorToken: 'stroke-same-white',
        spinnerColorToken: 'text-same-white',
      };
    case 'decor':
      return {
        backgroundColor: resolveColor(colors, 'material-decor'),
        strokeColorToken: 'stroke-same-white',
        spinnerColorToken: 'text-same-white',
      };
    case 'danger':
      return {
        backgroundColor: resolveColor(colors, 'status-danger'),
        strokeColorToken: 'stroke-same-white',
        spinnerColorToken: 'text-same-white',
      };
    case 'shallow':
      return {
        backgroundColor: resolveColor(colors, 'material-card-deep'),
        strokeColorToken: 'stroke-base-primary',
        spinnerColorToken: 'text-base-primary',
      };
    /** 无背景色调 — 常态 material-hide · 点按 event-tap。 */
    case 'plain':
      return {
        backgroundColor: pressed
          ? resolveColor(colors, 'event-tap')
          : resolveColor(colors, 'material-hide'),
        strokeColorToken: 'stroke-base-primary',
        spinnerColorToken: 'text-base-primary',
      };
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
}