import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { triggerGlassPressHaptic } from '../../../atoms/glass/glassPressHaptic.js';
import { presetBar, presetHeadline } from '../../../shared/typographyStyles.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import { EgPopovers } from '../../popovers/popovers/index.js';
import {
  EG_LOCATE_BUBBLE_GAP,
  EG_LOCATE_ITEM_HEIGHT,
  EG_LOCATE_TRAILING_INSET,
} from './egLocateMetrics.js';
import { EG_LOCATE_DEFAULT_KEYS, type EgLocateProps } from './EgLocate.types.js';

const spacing = mobileTheme.spacing;

function keyAt(keys: readonly string[], y: number, itemHeight: number) {
  if (keys.length === 0) return undefined;
  const index = Math.min(keys.length - 1, Math.max(0, Math.floor(y / itemHeight)));
  return keys[index];
}

function clampDragY(y: number, keysCount: number, itemHeight: number) {
  const maxY = Math.max(0, keysCount * itemHeight - itemHeight / 2);
  return Math.min(maxY, Math.max(itemHeight / 2, y));
}

/**
 * 右侧字母索引。按住滑动时，当前字母亮起，左侧气泡跟着走。
 */
export function EgLocate({
  mode = 'light',
  keys = EG_LOCATE_DEFAULT_KEYS,
  activeKey,
  onActiveKeyChange,
  testID,
  style,
}: EgLocateProps & Pick<ViewProps, 'style'>) {
  const colors = getThemeColors(mode);
  const [uncontrolled, setUncontrolled] = useState(activeKey ?? keys[0] ?? '');
  const [dragging, setDragging] = useState(false);
  const [dragY, setDragY] = useState(EG_LOCATE_ITEM_HEIGHT / 2);
  const lastKey = useRef(activeKey ?? keys[0] ?? '');
  const current = activeKey ?? uncontrolled;
  const inkSecondary = colors['text-base-secondary'] as string;
  const onBrand = colors['text-same-white'] as string;
  const inkPrimary = colors['text-base-primary'] as string;
  const brand = colors['material-brand'] as string;

  const commit = (key: string | undefined) => {
    if (!key || lastKey.current === key) return;
    lastKey.current = key;
    if (activeKey === undefined) setUncontrolled(key);
    onActiveKeyChange?.(key);
    triggerGlassPressHaptic();
  };

  const updateDrag = (locationY: number) => {
    const y = clampDragY(locationY, keys.length, EG_LOCATE_ITEM_HEIGHT);
    setDragY(y);
    commit(keyAt(keys, locationY, EG_LOCATE_ITEM_HEIGHT));
  };

  const bubbleTop = dragY - EG_LOCATE_ITEM_HEIGHT / 2;

  return (
    <View style={StyleSheet.flatten([styles.root, style])} testID={testID ?? 'locate'} pointerEvents="box-none">
      <View style={styles.railHost}>
        {dragging ? (
          <View pointerEvents="none" style={[styles.bubbleSlot, { top: bubbleTop }]}>
            <EgPopovers mode={mode} edge="trailing-middle">
              <Text style={[styles.bubbleLetter, { color: inkPrimary }]}>{current}</Text>
            </EgPopovers>
          </View>
        ) : null}
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="字母索引"
          style={styles.rail}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={(event) => {
            setDragging(true);
            updateDrag(event.nativeEvent.locationY);
          }}
          onResponderMove={(event) => {
            updateDrag(event.nativeEvent.locationY);
          }}
          onResponderRelease={() => setDragging(false)}
          onResponderTerminate={() => setDragging(false)}
        >
          {keys.map((key) => {
            const active = key === current;
            return (
              <View key={key} style={styles.item}>
                <View style={[styles.mark, active ? { backgroundColor: brand } : null]}>
                  <Text
                    style={[
                      styles.letter,
                      { color: active ? onBrand : inkSecondary },
                    ]}
                  >
                    {key}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: EG_LOCATE_TRAILING_INSET,
    top: 0,
    bottom: 0,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    overflow: 'visible',
  },
  railHost: {
    position: 'relative',
    overflow: 'visible',
  },
  rail: {
    paddingLeft: spacing['spacing-2'] as number,
  },
  item: {
    height: EG_LOCATE_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: EG_LOCATE_ITEM_HEIGHT,
    height: EG_LOCATE_ITEM_HEIGHT,
    borderRadius: EG_LOCATE_ITEM_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    ...presetBar(),
    width: EG_LOCATE_ITEM_HEIGHT,
    height: EG_LOCATE_ITEM_HEIGHT,
    lineHeight: EG_LOCATE_ITEM_HEIGHT,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  bubbleSlot: {
    position: 'absolute',
    right: '100%',
    marginRight: EG_LOCATE_BUBBLE_GAP,
    height: EG_LOCATE_ITEM_HEIGHT,
    justifyContent: 'center',
    overflow: 'visible',
    alignItems: 'flex-end',
  },
  bubbleLetter: {
    ...presetHeadline(),
    textAlign: 'center',
  },
});