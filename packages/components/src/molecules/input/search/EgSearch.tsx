import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { inputHeight } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import type { FieldEvent } from '../../../shared/types.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import { EgInputPointer } from '../_shared/EgInputPointer.js';
import { createFieldStyles } from '../_shared/fieldStyles.js';
import type { EgSearchProps } from './EgSearch.types.js';

const ICON_SEARCH = 'eds-search';
const ICON_CLOSE = 'eds-close';

const spacing = mobileTheme.spacing;
const ROW_GAP = spacing['spacing-4'] as number;
const CLOSE_SIZE = spacing['capsule-md'] as number;

function resolveSearchEvent(
  disabled: boolean,
  docEvent: FieldEvent | undefined,
  focused: boolean,
  value: string,
): FieldEvent {
  if (disabled) return 'disable';
  if (docEvent && docEvent !== 'default') return docEvent;
  if (focused && !value) return 'tap';
  if (focused) return 'entering';
  if (value) return 'done';
  return 'default';
}

function isSearchExpanded(event: FieldEvent, focused: boolean, value: string): boolean {
  return event === 'tap' || event === 'entering' || event === 'done' || focused || value.length > 0;
}

function isDocPreview(docEvent?: FieldEvent): boolean {
  return Boolean(docEvent && docEvent !== 'default' && docEvent !== 'disable');
}

/** Figma Search（149:4197）— Default 收起；Tap / Entering / Done 展开为输入区 + 关闭钮。 */
export function EgSearch({
  mode = 'light',
  size = 'md',
  event: docEvent,
  value,
  defaultValue,
  placeholder = 'Search',
  disabled = false,
  onChangeText,
  onClear,
  testID,
  style,
}: EgSearchProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(defaultValue ?? '');

  const text = value ?? draft;
  const frozen = isDocPreview(docEvent);
  const resolved = resolveSearchEvent(disabled, docEvent, focused, text);
  const expanded = isSearchExpanded(resolved, focused, text);

  const visual = createFieldStyles({
    kind: 'search',
    size,
    mode,
    event: resolved,
    disabled,
    focused,
  });

  const setText = (next: string) => {
    if (value === undefined) setDraft(next);
    onChangeText?.(next);
  };

  const open = () => {
    if (disabled || frozen) return;
    setFocused(true);
  };

  const close = () => {
    setText('');
    onClear?.();
    setFocused(false);
  };

  const searchIcon = (
    <View style={resolved === 'default' ? styles.iconMuted : undefined}>
      <EgSymbol name={ICON_SEARCH} size="md" mode={mode} />
    </View>
  );

  const previewText =
    frozen && !text && (resolved === 'entering' || resolved === 'done') ? placeholder : text;

  const fieldInner = frozen ? (
    <>
      {searchIcon}
      {resolved === 'tap' ? <EgInputPointer mode={mode} /> : null}
      <Text style={[visual.input, styles.fieldText]} numberOfLines={1}>
        {previewText || placeholder}
      </Text>
      {resolved === 'entering' ? <EgInputPointer mode={mode} /> : null}
    </>
  ) : (
    <>
      {searchIcon}
      <TextInput
        style={visual.input}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={visual.placeholderColor}
        editable={!disabled}
        autoFocus={expanded}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </>
  );

  if (!expanded) {
    return (
      <Pressable
        testID={testID ?? 'input-search'}
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        disabled={disabled}
        onPress={open}
        style={[styles.root, style]}
      >
        <View style={visual.container}>{searchIcon}<Text style={visual.input}>{placeholder}</Text></View>
      </Pressable>
    );
  }

  const colors = getThemeColors(mode);

  return (
    <View style={[styles.root, styles.row, style]}>
      <View style={[visual.container, styles.fieldFlex]}>{fieldInner}</View>
      {!disabled ? (
        <Pressable
          testID={`${testID ?? 'input-search'}-close`}
          accessibilityRole="button"
          accessibilityLabel="Close search"
          disabled={frozen}
          onPress={frozen ? undefined : close}
          style={[
            styles.close,
            {
              backgroundColor: resolveColor(colors, 'material-card-moderate'),
            },
          ]}
        >
          <EgSymbol name={ICON_CLOSE} size="md" mode={mode} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROW_GAP,
    minHeight: inputHeight('md'),
  },
  fieldFlex: {
    flex: 1,
    minWidth: 0,
  },
  close: {
    width: CLOSE_SIZE,
    height: CLOSE_SIZE,
    borderRadius: spacing['radius-full'] as number,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconMuted: {
    opacity: 0.55,
  },
  fieldText: {
    flex: 1,
    minWidth: 0,
  },
});
