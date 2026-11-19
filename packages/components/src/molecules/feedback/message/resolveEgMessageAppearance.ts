import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors } from '../../../theme/index.js';
import type { EgMessageTone } from './EgMessage.types.js';

type ThemeColors = ReturnType<typeof getThemeColors>;

export type EgMessageAppearance = {
  backgroundColor: string;
  textColor: string;
};

/** 色调 → 胶囊底 / 文案色（对齐 EgSymbolAction 填充档）。 */
export function resolveEgMessageAppearance(
  colors: ThemeColors,
  tone: EgMessageTone,
): EgMessageAppearance {
  switch (tone) {
    case 'brand':
      return {
        backgroundColor: resolveColor(colors, 'material-brand'),
        textColor: resolveColor(colors, 'text-same-white'),
      };
    case 'decor':
      return {
        backgroundColor: resolveColor(colors, 'material-decor'),
        textColor: resolveColor(colors, 'text-same-white'),
      };
    case 'danger':
      return {
        backgroundColor: resolveColor(colors, 'status-danger'),
        textColor: resolveColor(colors, 'text-same-white'),
      };
    case 'shallow':
      return {
        backgroundColor: resolveColor(colors, 'material-card-deep'),
        textColor: resolveColor(colors, 'text-base-primary'),
      };
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
}