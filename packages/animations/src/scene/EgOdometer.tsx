import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import {
  ODOMETER_DIGIT_DURATION_MS,
  ODOMETER_DIGIT_STAGGER_MS,
  ODOMETER_ROLL_EXTRA_DIGITS,
} from './sceneTiming.js';

const ODOMETER_EASING = Easing.bezier(0.22, 1, 0.36, 1);

type ParsedChar = {
  index: number;
  char: string;
  digit: number | null;
  order: number;
};

export type EgOdometerProps = {
  value?: number | string;
  animateIntro?: boolean;
  /** 业务 Text 样式（字号 · 行高 · 字体 · 颜色）；动画层不自建 typography / color。 */
  textStyle: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function parseValue(text: string): ParsedChar[] {
  let digitIndex = 0;
  return text.split('').map((char, index) => {
    const isDigit = char >= '0' && char <= '9';
    return {
      index,
      char,
      digit: isDigit ? Number(char) : null,
      order: isDigit ? digitIndex++ : 0,
    };
  });
}

function resolveGlyphLayout(textStyle: StyleProp<TextStyle>): {
  glyphStyle: TextStyle;
  cellHeight: number;
} {
  const flat = StyleSheet.flatten(textStyle) ?? {};
  const fontSize = typeof flat.fontSize === 'number' ? flat.fontSize : 17;
  const lineHeight = typeof flat.lineHeight === 'number' ? flat.lineHeight : fontSize;
  return { glyphStyle: flat, cellHeight: lineHeight };
}

function OdometerDigitColumn({
  item,
  cellHeight,
  glyphStyle,
  rolling,
  started,
  reduceMotion,
}: {
  item: ParsedChar;
  cellHeight: number;
  glyphStyle: TextStyle;
  rolling: boolean;
  started: boolean;
  reduceMotion: boolean;
}) {
  const translateY = useSharedValue(-(item.digit ?? 0) * cellHeight);

  useEffect(() => {
    if (!rolling || item.digit == null || reduceMotion) {
      translateY.value = -(item.digit ?? 0) * cellHeight;
      return;
    }
    const targetDigit = item.digit;
    const startY = -targetDigit * cellHeight;
    const endY = -(targetDigit + ODOMETER_ROLL_EXTRA_DIGITS) * cellHeight;
    translateY.value = startY;
    if (!started) {
      return;
    }
    translateY.value = withDelay(
      item.order * ODOMETER_DIGIT_STAGGER_MS,
      withTiming(endY, {
        duration: ODOMETER_DIGIT_DURATION_MS,
        easing: ODOMETER_EASING,
      }),
    );
  }, [cellHeight, item.digit, item.order, reduceMotion, rolling, started, translateY]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!rolling || item.digit == null || reduceMotion) {
    return (
      <View style={[styles.column, { height: cellHeight }]}>
        <Text style={[glyphStyle, styles.glyph]}>{item.char}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.column, { height: cellHeight }]}>
      <Text style={[glyphStyle, styles.glyph, styles.sizerHidden]}>{item.char}</Text>
      <Animated.View style={[styles.strip, stripStyle]}>
        {Array.from({ length: 20 }, (_, cellIndex) => (
          <Text
            key={cellIndex}
            style={[glyphStyle, styles.digitCell, { height: cellHeight, lineHeight: cellHeight }]}
          >
            {(cellIndex % 10).toString()}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

export function EgOdometer({
  value = 0,
  animateIntro = true,
  textStyle,
  style,
  testID = 'eg-odometer',
}: EgOdometerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const text = String(value);
  const chars = useMemo(() => parseValue(text), [text]);
  const digitCount = chars.filter((item) => item.digit != null).length;

  const [rolling, setRolling] = useState(animateIntro && !reduceMotion);
  const [started, setStarted] = useState(false);

  const { glyphStyle, cellHeight } = useMemo(
    () => resolveGlyphLayout(textStyle),
    [textStyle],
  );

  useEffect(() => {
    if (!rolling) {
      setStarted(false);
      return;
    }
    const frame1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setStarted(true));
    });
    const settleMs =
      ODOMETER_DIGIT_DURATION_MS + ODOMETER_DIGIT_STAGGER_MS * Math.max(digitCount - 1, 0) + 50;
    const timer = setTimeout(() => setRolling(false), settleMs);
    return () => {
      cancelAnimationFrame(frame1);
      clearTimeout(timer);
    };
  }, [digitCount, rolling]);

  useEffect(() => {
    if (reduceMotion || !animateIntro) {
      setRolling(false);
      return;
    }
    setRolling(true);
    setStarted(false);
  }, [animateIntro, reduceMotion]);

  return (
    <View
      testID={testID}
      accessibilityLabel={text}
      style={[styles.root, style]}
      pointerEvents={rolling ? 'none' : 'auto'}
    >
      {chars.map((item) => (
        <OdometerDigitColumn
          key={`${text}-${item.index}`}
          item={item}
          cellHeight={cellHeight}
          glyphStyle={glyphStyle}
          rolling={rolling}
          started={started}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  column: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  glyph: {
    includeFontPadding: false,
  },
  sizerHidden: {
    opacity: 0,
  },
  strip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  digitCell: {
    includeFontPadding: false,
    textAlign: 'center',
  },
});