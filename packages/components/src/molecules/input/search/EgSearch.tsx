import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type ViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { EgGrayGlassBox } from '../../../atoms/glass/EgGrayGlassBox.js';
import type { FieldEvent } from '../../../shared/types.js';
import { mobileTheme } from '../../../theme/index.js';
import { EgInputPointer } from '../_shared/EgInputPointer.js';
import { createFieldStyles } from '../_shared/fieldStyles.js';
import {
  EG_SEARCH_FIELD_HEIGHT,
  EG_SEARCH_MARGIN_BOTTOM,
  EG_SEARCH_MARGIN_RIGHT,
  EG_SEARCH_MARGIN_TOP,
} from './egSearchMetrics.js';
import type { EgSearchHandle, EgSearchProps } from './EgSearch.types.js';
import { useEgSearchCloseMotion } from './useEgSearchCloseMotion.js';

const ICON_SEARCH = 'eds-search';
const ICON_CLEAR = 'eds-close-circle-fill';
const ICON_CLOSE = 'eds-close';
const SEARCH_SIZE = 'md' as const;

const spacing = mobileTheme.spacing;
const RADIUS_FULL = spacing['radius-full'] as number;

function resolveSearchEvent(
  disabled: boolean,
  docEvent: FieldEvent | undefined,
  focused: boolean,
  value: string,
): FieldEvent {
  if (disabled) return 'disable';
  if (docEvent && docEvent !== 'default') return docEvent;
  if (focused) return 'entering';
  if (value.length > 0) return 'done';
  return 'default';
}

/**
 * iOS `TextInput` 会把 `lineHeight` 加在已输入文字上，字比占位更靠下。
 * 去掉行高，由行的 `alignItems: 'center'` 和输入框自身高度对齐。
 */
function searchEntryStyle(input: TextStyle): TextStyle {
  const next: TextStyle = {
    ...input,
    padding: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
    alignSelf: 'center',
  };
  delete next.lineHeight;
  return next;
}

function isDocPreview(docEvent?: FieldEvent): boolean {
  return Boolean(docEvent && docEvent !== 'default' && docEvent !== 'disable');
}

function showCloseCapsule(
  disabled: boolean,
  focused: boolean,
  text: string,
  resolved: FieldEvent,
  frozen: boolean,
): boolean {
  if (disabled) return false;
  if (focused || text.length > 0) return true;
  if (frozen) {
    return resolved === 'tap' || resolved === 'entering' || resolved === 'done';
  }
  return false;
}

export const EgSearch = forwardRef<EgSearchHandle, EgSearchProps & Pick<ViewProps, 'style'>>(
  function EgSearch(
    {
      mode = 'light',
      event: docEvent,
      value,
      defaultValue,
      placeholder = 'Search',
      disabled = false,
      onChangeText,
      onClear,
      testID,
      style,
      autoFocus = false,
      onFocus,
      onBlur,
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState(defaultValue ?? '');

    const text = value ?? draft;
    const frozen = isDocPreview(docEvent);
    const resolved = resolveSearchEvent(disabled, docEvent, focused, text);
    const showClearAffordance = !disabled && (focused || text.length > 0);
    const clearEnabled = text.length > 0 && !frozen;
    const closeCapsule = showCloseCapsule(disabled, focused, text, resolved, frozen);

    const { closeMounted, closeCapsuleSize, closeGap, slotStyle, closeStyle } = useEgSearchCloseMotion(
      closeCapsule,
      !frozen,
    );

    const clearColorToken = clearEnabled ? 'text-base-primary' : 'status-disable-base';

    const visual = createFieldStyles({
      kind: 'search',
      size: SEARCH_SIZE,
      mode,
      event: resolved,
      disabled,
      focused,
      showBackground: false,
    });

    const setText = (next: string) => {
      if (value === undefined) setDraft(next);
      onChangeText?.(next);
    };

    const clearText = () => {
      if (frozen) return;
      setText('');
      onClear?.();
    };

    const dismissSearch = useCallback(() => {
      if (frozen) return;
      Keyboard.dismiss();
      setFocused(false);
      onBlur?.();
      if (value === undefined) {
        setDraft('');
      }
      onChangeText?.('');
      onClear?.();
    }, [frozen, onBlur, onChangeText, onClear, value]);

    useImperativeHandle(ref, () => ({ dismiss: dismissSearch }), [dismissSearch]);

    const searchIcon = <EgSymbol name={ICON_SEARCH} size="sm" mode={mode} />;

    const clearButton = showClearAffordance ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        disabled={!clearEnabled}
        onPress={clearText}
        testID={`${testID ?? 'input-search'}-clear`}
        style={styles.clearHit}
      >
        <EgSymbol name={ICON_CLEAR} size="sm" mode={mode} strokeColorToken={clearColorToken} />
      </Pressable>
    ) : null;

    const fieldContent = frozen ? (
      <>
        {searchIcon}
        {resolved === 'tap' ? <EgInputPointer mode={mode} /> : null}
        <Text style={[visual.input, styles.fieldText]} numberOfLines={1}>
          {text || placeholder}
        </Text>
        {resolved === 'entering' ? <EgInputPointer mode={mode} /> : null}
        {showClearAffordance ? (
          <View pointerEvents="none">
            <EgSymbol name={ICON_CLEAR} size="sm" mode={mode} strokeColorToken={clearColorToken} />
          </View>
        ) : null}
      </>
    ) : (
      <>
        {searchIcon}
        <TextInput
          style={searchEntryStyle(visual.input)}
          value={text}
          placeholder={placeholder}
          placeholderTextColor={visual.placeholderColor}
          editable={!disabled}
          autoFocus={autoFocus}
          returnKeyType="search"
          onChangeText={setText}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
        />
        {clearButton}
      </>
    );

    const closeCapsuleNode = closeMounted ? (
      <Animated.View style={[styles.closeSlot, slotStyle]} testID={`${testID ?? 'input-search'}-close-slot`}>
        <Animated.View
          style={[
            styles.closeMorphWrap,
            closeStyle,
            {
              marginLeft: closeGap,
              width: closeCapsuleSize,
              height: closeCapsuleSize,
            },
          ]}
        >
          <EgGrayGlassBox
            interactive
            shape="circle"
            mode={mode}
            disabled={frozen}
            onPress={dismissSearch}
            testID={`${testID ?? 'input-search'}-close`}
            accessibilityLabel="Close search"
            style={{
              width: closeCapsuleSize,
              height: closeCapsuleSize,
              borderRadius: RADIUS_FULL,
            }}
          >
            <EgSymbol name={ICON_CLOSE} size="md" mode={mode} />
          </EgGrayGlassBox>
        </Animated.View>
      </Animated.View>
    ) : null;

    return (
      <View
        testID={testID ?? 'input-search'}
        style={[
          styles.root,
          {
            marginTop: EG_SEARCH_MARGIN_TOP,
            marginBottom: EG_SEARCH_MARGIN_BOTTOM,
            marginRight: EG_SEARCH_MARGIN_RIGHT,
          },
          style,
        ]}
      >
        <View style={[styles.row, { minHeight: EG_SEARCH_FIELD_HEIGHT }]}>
          <View style={styles.fieldShiftWrap}>
            <EgGrayGlassBox
              interactive
              shape="capsule"
              mode={mode}
              disabled={disabled || frozen}
              style={[
                styles.fieldGlass,
                { minHeight: EG_SEARCH_FIELD_HEIGHT, borderRadius: RADIUS_FULL },
              ]}
            >
              <View style={visual.container}>{fieldContent}</View>
            </EgGrayGlassBox>
          </View>
          {closeCapsuleNode}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflow: 'visible',
  },
  fieldShiftWrap: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
  },
  fieldGlass: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
  },
  closeSlot: {
    flexShrink: 0,
    height: EG_SEARCH_FIELD_HEIGHT,
    justifyContent: 'center',
    overflow: 'visible',
  },
  closeMorphWrap: {
    flexShrink: 0,
    overflow: 'visible',
  },
  fieldText: {
    flex: 1,
    minWidth: 0,
  },
  clearHit: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});