import type { TextStyle, ViewStyle } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { dropdownHeight, fieldPaddingHorizontal, inputHeight } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import { fieldTypography, searchFieldTypography } from '../../../shared/typographyStyles.js';
import type { ControlSize, FieldEvent } from '../../../shared/types.js';

export type FieldKind = 'input' | 'search' | 'textarea' | 'dropdown';

export type FieldVisualState = {
  kind: FieldKind;
  size: ControlSize;
  mode: ThemeMode;
  event?: FieldEvent;
  disabled?: boolean;
  pressed?: boolean;
  focused?: boolean;
  multiline?: boolean;
};

const spacing = mobileTheme.spacing;

function fieldCaretColor(mode: ThemeMode): string {
  return resolveColor(getThemeColors(mode), 'material-brand');
}

function fieldRadius(kind: FieldKind, size: ControlSize): number {
  if (kind === 'search') return spacing['radius-full'] as number;
  if (size === 'lg' || size === 'xl') return spacing['radius-md'] as number;
  return spacing['radius-sm'] as number;
}

function fieldMinHeight(state: FieldVisualState): number {
  if (state.kind === 'textarea') {
    return (spacing['spacing-12'] as number) * 2;
  }
  if (state.kind === 'search') {
    return inputHeight('md');
  }
  return state.multiline ? inputHeight(state.size) * 2 : inputHeight(state.size);
}

export function createFieldStyles(state: FieldVisualState): {
  container: ViewStyle;
  input: TextStyle;
  placeholderColor: string;
  centerContent: boolean;
  caretColor: string;
} {
  const colors = getThemeColors(state.mode);
  const caretColor = fieldCaretColor(state.mode);
  const caretWidth = 2;
  const height = fieldMinHeight(state);
  const typography =
    state.kind === 'search' ? searchFieldTypography(state.size) : fieldTypography(state.size);
  const event = state.disabled
    ? 'disable'
    : (state.event ?? (state.focused ? 'entering' : state.pressed ? 'tap' : 'default'));

  const centerContent = state.kind === 'search' && event === 'default';

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: state.multiline || state.kind === 'textarea' ? 'flex-start' : 'center',
    justifyContent: centerContent ? 'center' : undefined,
    minHeight: height,
    maxHeight: state.multiline || state.kind === 'textarea' ? undefined : height,
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: fieldPaddingHorizontal(state.size),
    paddingVertical:
      state.multiline || state.kind === 'textarea'
        ? (spacing['spacing-2'] as number)
        : undefined,
    borderRadius: fieldRadius(state.kind, state.size),
    borderWidth: spacing['stroke-sm'] as number,
    borderColor: 'transparent',
    gap: state.kind === 'search' ? (spacing['spacing-2'] as number) : (spacing['spacing-3'] as number),
    opacity: state.disabled ? disabledOpacity() : 1,
  };

  const input: TextStyle = {
    flex: centerContent ? undefined : 1,
    ...typography,
    padding: 0,
    margin: 0,
    textAlignVertical: state.multiline || state.kind === 'textarea' ? 'top' : 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineStyle: 'none',
    outlineWidth: 0,
    caretColor,
    cursorColor: caretColor,
    selectionColor: caretColor,
    caretWidth,
  };

  let placeholderColor = resolveColor(colors, 'text-base-tertiary');

  switch (event) {
    case 'tap':
      container.backgroundColor =
        state.kind === 'search'
          ? resolveColor(colors, 'material-card-moderate')
          : resolveColor(colors, 'event-tap');
      input.color = resolveColor(colors, 'text-base-quaternary');
      placeholderColor = resolveColor(colors, 'text-base-quaternary');
      break;
    case 'entering':
      container.backgroundColor = resolveColor(colors, 'material-card-moderate');
      input.color = resolveColor(colors, 'text-base-primary');
      break;
    case 'done':
    case 'echo':
      container.backgroundColor = resolveColor(colors, 'material-card-moderate');
      input.color = resolveColor(colors, 'text-base-primary');
      break;
    case 'disable':
      container.backgroundColor = resolveColor(colors, 'material-card-moderate');
      input.color = resolveColor(colors, 'text-base-quaternary');
      placeholderColor = resolveColor(colors, 'text-base-quaternary');
      break;
    default:
      container.backgroundColor = resolveColor(colors, 'material-card-moderate');
      input.color =
        state.kind === 'search'
          ? resolveColor(colors, 'text-base-tertiary')
          : resolveColor(colors, 'text-base-primary');
      break;
  }

  if (state.kind === 'dropdown') {
    container.minHeight = dropdownHeight(state.size);
    container.maxHeight = dropdownHeight(state.size);
  }

  return { container, input, placeholderColor, centerContent, caretColor };
}

export function chevronColor(mode: ThemeMode): string {
  return resolveColor(getThemeColors(mode), 'text-base-secondary');
}

export function searchIconColor(mode: ThemeMode, event: FieldEvent = 'default'): string {
  const colors = getThemeColors(mode);
  return event === 'default'
    ? resolveColor(colors, 'text-base-secondary')
    : resolveColor(colors, 'text-base-primary');
}
