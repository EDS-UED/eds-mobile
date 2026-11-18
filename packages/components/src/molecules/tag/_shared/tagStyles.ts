import type { TextStyle, ViewStyle } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { tagHeight } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { resolveColorTagColors, resolveStatusTagColors, type TagStatus } from '../../../shared/tagPalette.js';
import { tagTypography } from '../../../shared/typographyStyles.js';
import type {
  ColorTagType,
  EgTagVariant,
  SystemTagType,
  TagShape,
  TagSize,
} from '../../../shared/types.js';

export type TagVisualState = {
  mode: ThemeMode;
  size: TagSize;
  variant?: EgTagVariant;
  shape?: TagShape;
  colorType?: ColorTagType;
  systemType?: SystemTagType;
  status?: TagStatus;
  alt?: boolean;
};

function tagPadding(size: TagSize, spacing: (typeof mobileTheme)['spacing']) {
  const paddingHorizontal =
    size === 'lg' ? spacing['spacing-2'] : spacing['spacing-1-5'];
  const paddingVertical =
    size === 'lg' ? spacing['spacing-1'] : spacing['spacing-05'];
  return { paddingHorizontal, paddingVertical };
}

/** `--scale-1`（4px）· RN 语义 `spacing-1`。 */
function tagScale1Radius(spacing: (typeof mobileTheme)['spacing']): number {
  return spacing['spacing-1'] as number;
}

function tagShapeRadius(shape: TagShape, spacing: (typeof mobileTheme)['spacing']): ViewStyle {
  if (shape === 'round') {
    return { borderRadius: spacing['radius-full'] as number };
  }
  return {
    borderRadius: tagScale1Radius(spacing),
    borderCurve: 'continuous',
  };
}

function applyEgTagVariant(
  variant: EgTagVariant,
  colors: Record<string, string>,
  container: ViewStyle,
  label: TextStyle,
) {
  const stroke = mobileTheme.spacing['stroke-sm'] as number;

  switch (variant) {
    case 'subtle':
      container.backgroundColor = resolveColor(colors, 'material-card-deep');
      label.color = resolveColor(colors, 'text-base-primary');
      container.borderWidth = 0;
      break;
    case 'solid-brand':
      container.backgroundColor = resolveColor(colors, 'material-brand');
      label.color = resolveColor(colors, 'text-same-white');
      container.borderWidth = 0;
      break;
    case 'solid-red':
      container.backgroundColor = resolveColor(colors, 'status-danger');
      label.color = resolveColor(colors, 'text-same-white');
      container.borderWidth = 0;
      break;
    case 'gray':
      container.backgroundColor = resolveColor(colors, 'material-base-quaternary');
      label.color = resolveColor(colors, 'text-same-white');
      container.borderWidth = 0;
      break;
    case 'stroke-subtle':
      container.backgroundColor = 'transparent';
      container.borderWidth = stroke;
      container.borderColor = resolveColor(colors, 'stroke-divider-deep');
      label.color = resolveColor(colors, 'text-base-primary');
      break;
    case 'stroke-solid':
      container.backgroundColor = 'transparent';
      container.borderWidth = stroke;
      container.borderColor = resolveColor(colors, 'stroke-color-brand');
      label.color = resolveColor(colors, 'text-brand');
      break;
    default: {
      const exhaustive: never = variant;
      void exhaustive;
    }
  }
}

export function createTagStyles(state: TagVisualState): { container: ViewStyle; label: TextStyle } {
  const colors = getThemeColors(state.mode);
  const spacing = mobileTheme.spacing;
  const height = tagHeight(state.size);
  const typography = tagTypography(state.size);
  const shape = state.shape ?? 'round';

  const container: ViewStyle = {
    alignSelf: 'flex-start',
    ...tagPadding(state.size, spacing),
    ...tagShapeRadius(shape, spacing),
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const label: TextStyle = {
    ...typography,
    textAlign: 'center',
  };

  if (state.variant) {
    applyEgTagVariant(state.variant, colors, container, label);
    return { container, label };
  }

  container.minHeight = height;
  container.maxHeight =
    state.size === 'lg'
      ? height + (spacing['spacing-1'] as number)
      : height + (spacing['spacing-05'] as number);
  container.borderWidth = spacing['stroke-md'] as number;
  Object.assign(container, tagShapeRadius(shape, spacing));

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
