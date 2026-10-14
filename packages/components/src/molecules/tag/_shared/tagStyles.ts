import type { TextStyle, ViewStyle } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { tagHeight } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { resolveColorTagColors, resolveStatusTagColors, type TagStatus } from '../../../shared/tagPalette.js';
import { tagTypography } from '../../../shared/typographyStyles.js';
import type { ColorTagType, SystemTagType, TagSize } from '../../../shared/types.js';

export type TagVisualState = {
  mode: ThemeMode;
  size: TagSize;
  colorType?: ColorTagType;
  systemType?: SystemTagType;
  status?: TagStatus;
  alt?: boolean;
};

export function createTagStyles(state: TagVisualState): { container: ViewStyle; label: TextStyle } {
  const colors = getThemeColors(state.mode);
  const spacing = mobileTheme.spacing;
  const height = tagHeight(state.size);
  const typography = tagTypography(state.size);

  const container: ViewStyle = {
    alignSelf: 'flex-start',
    minHeight: height,
    maxHeight: state.size === 'lg'
      ? height + (spacing['spacing-1'] as number)
      : height + (spacing['spacing-05'] as number),
    paddingHorizontal: state.size === 'lg' ? spacing['spacing-2'] : spacing['spacing-1-5'],
    paddingVertical: state.size === 'sm' ? spacing['spacing-05'] : spacing['spacing-1'],
    borderRadius: spacing['radius-xs'] as number,
    borderWidth: spacing['stroke-sm'] as number,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const label: TextStyle = {
    ...typography,
    textAlign: 'center',
  };

  if (state.colorType) {
    const pair = resolveColorTagColors(state.colorType, state.mode, state.alt);
    container.backgroundColor = pair.bg;
    label.color = pair.text;
    if (state.alt) {
      container.borderColor = pair.text;
    }
    return { container, label };
  }

  if (state.systemType) {
    applySystemTag(state, colors, container, label);
    return { container, label };
  }

  container.backgroundColor = resolveColor(colors, 'material-card-moderate');
  label.color = resolveColor(colors, 'text-base-primary');
  return { container, label };
}

function applySystemTag(
  state: TagVisualState,
  colors: Record<string, string>,
  container: ViewStyle,
  label: TextStyle,
) {
  const statusColors = state.status ? resolveStatusTagColors(state.status, state.mode) : null;
  const systemType = state.alt && state.systemType === 'subtle' ? 'strokeSubtle' : state.systemType;

  switch (systemType) {
    case 'subtle':
      container.backgroundColor = statusColors?.bg ?? resolveColor(colors, 'material-brand-weaken');
      label.color = statusColors?.text ?? resolveColor(colors, 'text-brand');
      break;
    case 'solid':
      container.backgroundColor = statusColors?.bg ?? resolveColor(colors, 'material-brand');
      label.color = statusColors?.text ?? resolveColor(colors, 'text-same-white');
      break;
    case 'strokeSubtle':
      container.backgroundColor = resolveColor(colors, 'material-hide');
      container.borderColor = resolveColor(colors, 'stroke-color-brand');
      label.color = resolveColor(colors, 'text-brand');
      break;
    case 'strokeSolid':
      container.backgroundColor = resolveColor(colors, 'material-hide');
      container.borderColor = resolveColor(colors, 'material-brand');
      label.color = resolveColor(colors, 'text-brand');
      break;
    case 'gray':
    default:
      container.backgroundColor = resolveColor(colors, 'material-card-moderate');
      label.color = resolveColor(colors, 'text-base-secondary');
      break;
  }
}
