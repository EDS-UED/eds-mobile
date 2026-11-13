import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import type { ControlSize, EgCommonProps, FieldEvent } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import {
  FieldChevron,
  FieldInlineClear,
  FieldMaxAction,
  FieldPasteAction,
  FieldUnitLabel,
} from './FieldAffordances.js';
import { EgInputPointer } from './EgInputPointer.js';
import { createFieldStyles, type FieldKind } from './fieldStyles.js';

export type EgFieldBaseProps = EgCommonProps & {
  kind?: FieldKind;
  size?: ControlSize;
  event?: FieldEvent;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  echoValue?: string;
  showClear?: boolean;
  showPaste?: boolean;
  showUnit?: boolean;
  showMax?: boolean;
  unit?: string;
  multiline?: boolean;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onPaste?: () => void;
  onMax?: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  showChevron?: boolean;
  style?: ViewStyle;
  mode?: ThemeMode;
};

function resolveEvent(
  kind: FieldKind,
  disabled: boolean,
  focused: boolean,
  pressed: boolean,
  event: FieldEvent,
): FieldEvent {
  if (disabled) return 'disable';
  if (kind === 'dropdown' || kind === 'menu') return event;
  if (focused) return 'entering';
  if (pressed) return 'tap';
  return event;
}

function isDocPreview(event: FieldEvent): boolean {
  return event !== 'default' && event !== 'disable';
}

export function EgFieldBase({
  kind = 'input',
  size = 'md',
  event = 'default',
  disabled = false,
  value,
  defaultValue,
  placeholder = kind === 'menu' ? 'Menu' : kind === 'dropdown' ? 'Select' : 'Input',
  echoValue,
  showClear,
  showPaste = false,
  showUnit = false,
  showMax = false,
  unit = 'Unit',
  multiline = false,
  onChangeText,
  onPress,
  onFocus,
  onBlur,
  onClear,
  onPaste,
  onMax,
  leading,
  trailing,
  showChevron = kind === 'dropdown' || kind === 'menu',
  testID,
  mode = 'light',
  style,
  accessibilityLabel,
}: EgFieldBaseProps) {
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const resolvedEvent = resolveEvent(kind, disabled, focused, pressed, event);
  const resolvedKind = kind === 'textarea' || multiline ? 'textarea' : kind;
  const currentValue = value ?? innerValue;
  const frozen = isDocPreview(event);
  const clearEnabled = showClear ?? kind === 'input';

  const dropdownText =
    resolvedEvent === 'echo'
      ? (echoValue ?? currentValue ?? placeholder)
      : (currentValue || placeholder);

  const visual = createFieldStyles({
    kind: resolvedKind,
    size,
    mode,
    event: resolvedEvent,
    disabled,
    pressed,
    focused,
    multiline: resolvedKind === 'textarea',
  });

  const showInlineClear =
    clearEnabled &&
    kind === 'input' &&
    !disabled &&
    (resolvedEvent === 'entering' || resolvedEvent === 'done');

  const docDisplayText =
    frozen && !currentValue && (resolvedEvent === 'entering' || resolvedEvent === 'done')
      ? placeholder
      : currentValue;

  const handleChangeText = (text: string) => {
    if (value === undefined) setInnerValue(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (value === undefined) setInnerValue('');
    onChangeText?.('');
    onClear?.();
  };

  const fieldText =
    kind === 'dropdown' || kind === 'menu' ? (
      <Text
        style={[
          visual.input,
          resolvedEvent === 'default' && !currentValue ? { color: visual.placeholderColor } : null,
          resolvedEvent === 'disable' ? { color: visual.placeholderColor } : null,
        ]}
      >
        {dropdownText}
      </Text>
    ) : frozen ? (
      <View style={styles.docTextRow}>
        {resolvedEvent === 'tap' ? <EgInputPointer mode={mode} /> : null}
        <Text
          style={[
            visual.input,
            styles.docText,
            resolvedEvent === 'default' || resolvedEvent === 'tap'
              ? { color: visual.placeholderColor, flex: 1 }
              : null,
          ]}
          numberOfLines={1}
        >
          {resolvedEvent === 'default' || resolvedEvent === 'tap' ? placeholder : docDisplayText}
        </Text>
        {resolvedEvent === 'entering' ? <EgInputPointer mode={mode} /> : null}
      </View>
    ) : (
      <TextInput
        style={[visual.input, showInlineClear ? styles.inputWithClear : null]}
        value={value ?? innerValue}
        placeholder={placeholder}
        placeholderTextColor={visual.placeholderColor}
        editable={!disabled}
        multiline={resolvedKind === 'textarea'}
        onChangeText={handleChangeText}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
      />
    );

  const shell = (
    <View style={[visual.container, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      {leading}
      {fieldText}
      {showInlineClear ? <FieldInlineClear mode={mode} onPress={frozen ? undefined : handleClear} /> : null}
      {showPaste ? <FieldPasteAction mode={mode} onPress={onPaste} /> : null}
      {showUnit ? <FieldUnitLabel mode={mode} size={size} label={unit} /> : null}
      {showMax ? <FieldMaxAction mode={mode} onPress={onMax} /> : null}
      {trailing}
      {showChevron ? <FieldChevron mode={mode} disabled={disabled} /> : null}
    </View>
  );

  if (kind === 'dropdown' || onPress) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        style={styles.pressableHost}
      >
        {shell}
      </Pressable>
    );
  }

  return shell;
}

const styles = StyleSheet.create({
  pressableHost: {
    width: '100%',
    alignSelf: 'stretch',
  },
  docTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
    gap: 0,
  },
  docText: {
    flexShrink: 1,
    minWidth: 0,
  },
  inputWithClear: {
    flex: 1,
    minWidth: 0,
  },
});
