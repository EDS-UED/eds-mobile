import { useEffect, useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { mobileTheme } from '@eds/mobile-tokens/theme';

import { sceneMaterialBrand } from './sceneColors.js';

const GRID = 4;
const DEFAULT_SIZE = 32;
const DURATION_MS = 1533;
const STAGGER_MS = 100;
const CELL_EASING = Easing.bezier(0.33, 0, 0.67, 1);

const CELLS = Array.from({ length: GRID * GRID }, (_, index) => ({
  index,
  diagonal: (index % GRID) + Math.floor(index / GRID),
}));

export type EgMnemonicVerifyProps = {
  /** 为 true 时播放对角线缩放波；false 时静止满格。 */
  active?: boolean;
  /** 画布边长（含内边距 spacing-1）· 默认 32。 */
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function MnemonicVerifyCell({
  diagonal,
  active,
  reduceMotion,
  cellSize,
  color,
}: {
  diagonal: number;
  active: boolean;
  reduceMotion: boolean;
  cellSize: number;
  color: string;
}) {
  const scale = useSharedValue(active && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!active || reduceMotion) {
      scale.value = withTiming(1, { duration: 0 });
      return;
    }
    scale.value = withDelay(
      diagonal * STAGGER_MS,
      withRepeat(
        withSequence(
          withTiming(1, { duration: DURATION_MS * 0.2174, easing: CELL_EASING }),
          withTiming(1, { duration: DURATION_MS * (0.3913 - 0.2174), easing: CELL_EASING }),
          withTiming(0, { duration: DURATION_MS * (0.6087 - 0.3913), easing: CELL_EASING }),
          withTiming(0, { duration: DURATION_MS * (1 - 0.6087), easing: CELL_EASING }),
        ),
        -1,
        false,
      ),
    );
  }, [active, diagonal, reduceMotion, scale]);

  const cellStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        cellStyle,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: color,
        },
      ]}
    />
  );
}

export function EgMnemonicVerify({
  active = true,
  size = DEFAULT_SIZE,
  color = sceneMaterialBrand(),
  style,
  testID = 'eg-mnemonic-verify',
}: EgMnemonicVerifyProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const pad = mobileTheme.spacing['spacing-1'] as number;
  const inner = size - pad * 2;
  const cellSize = inner / GRID;

  const rows = useMemo(() => {
    const out: typeof CELLS[] = [];
    for (let row = 0; row < GRID; row += 1) {
      out.push(CELLS.slice(row * GRID, row * GRID + GRID));
    }
    return out;
  }, []);

  return (
    <View
      accessibilityLabel={active ? '助记词校验中' : '助记词校验'}
      accessibilityRole="image"
      accessibilityState={{ busy: active }}
      testID={testID}
      style={[styles.root, { width: size, height: size, padding: pad }, style]}
    >
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, { height: cellSize }]}>
          {row.map((cell) => (
            <MnemonicVerifyCell
              key={cell.index}
              diagonal={cell.diagonal}
              active={active}
              reduceMotion={reduceMotion}
              cellSize={cellSize}
              color={color}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});