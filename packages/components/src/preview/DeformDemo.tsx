import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { edsFontStyle } from '../shared/fontFamily.js';
import { resolveDeformMotionTokens } from '../shared/motion/deformMotionTokens.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

const spacing = mobileTheme.spacing;
const SHORT = spacing['spacing-16'] as number;
const TRACK = spacing['spacing-10'] as number;
const SQUARE_RADIUS = spacing['spacing-2'] as number;
const SWAP_FROM_W = spacing['spacing-16'] as number;
const SWAP_FROM_H = spacing['spacing-12'] as number;
const SWAP_TO_H = spacing['spacing-16'] as number;
const STAGE_PAD = spacing['spacing-3'] as number;

const SHAPE_SIZE = (spacing['spacing-20'] as number) * 2;
const SHAPE_SAMPLES = 48;
const SHAPE_COUNT = 4;

const deform = resolveDeformMotionTokens();

function bezier(cubicBezier: string) {
  const match = /cubic-bezier\(\s*([^)]+)\s*\)/.exec(cubicBezier);
  const parts = match?.[1]?.split(',').map((part) => Number.parseFloat(part.trim()));
  if (parts && parts.length === 4 && parts.every((value) => Number.isFinite(value))) {
    return Easing.bezier(parts[0], parts[1], parts[2], parts[3]);
  }
  return Easing.bezier(0.42, 0, 0.58, 1);
}

const geometryTiming = {
  duration: deform.geometryDurationMs,
  easing: bezier(deform.geometryEasing),
};
const opacityTiming = {
  duration: deform.opacityDurationMs,
  easing: bezier(deform.opacityEasing),
};

/** 同一角度采样：0 圆 · 1 方 · 2 五角星 · 3 三角。 */
function shapeRadius(kind: number, angle: number, radius: number) {
  if (kind === 0) return radius;
  if (kind === 1) {
    const m = Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
    return radius / m;
  }
  if (kind === 2) {
    let ang = angle + Math.PI / 2;
    ang = ((ang % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const sector = (Math.PI * 2) / 5;
    const local = ang % sector;
    const half = sector / 2;
    const t = local < half ? local / half : (sector - local) / half;
    return radius * (1 - t * 0.62);
  }
  const verts = [0, 1, 2].map((index) => {
    const ang = -Math.PI / 2 + (index * 2 * Math.PI) / 3;
    return [Math.cos(ang) * radius, Math.sin(ang) * radius] as const;
  });
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let best = radius;
  for (let index = 0; index < 3; index += 1) {
    const [x1, y1] = verts[index]!;
    const [x2, y2] = verts[(index + 1) % 3]!;
    const ex = x2 - x1;
    const ey = y2 - y1;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-6) continue;
    const hit = (x1 * ey - y1 * ex) / den;
    const along = (x1 * dy - y1 * dx) / den;
    if (hit > 0 && along >= 0 && along <= 1) best = Math.min(best, hit);
  }
  return best;
}

const SHAPE_POINTS = Array.from({ length: SHAPE_COUNT }, (_, kind) => {
  const radius = SHAPE_SIZE * 0.42;
  const cx = SHAPE_SIZE / 2;
  const cy = SHAPE_SIZE / 2;
  const points: number[] = [];
  for (let index = 0; index < SHAPE_SAMPLES; index += 1) {
    const angle = -Math.PI / 2 + (index / SHAPE_SAMPLES) * Math.PI * 2;
    const reach = shapeRadius(kind, angle, radius);
    points.push(cx + reach * Math.cos(angle), cy + reach * Math.sin(angle));
  }
  return points;
}).flat();

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type DeformDemoKind = 'length' | 'shape' | 'swap';

type DeformDemoProps = {
  mode: ThemeMode;
  kind?: DeformDemoKind;
};

type Form = { w: number; h: number; r: number; a: number; b: number };

/**
 * motion-deform · EdsSemanticAnima('deform')
 * 尺寸：短↔长。形状：圆→方→五角星→三角。元素：A↔B。
 */
export function DeformDemo({ mode, kind = 'length' }: DeformDemoProps) {
  const colors = getThemeColors(mode);
  const [toB, setToB] = useState(false);
  const [stage, setStage] = useState<LayoutRectangle | null>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const width = useSharedValue(SHORT);
  const height = useSharedValue(TRACK);
  const radius = useSharedValue(TRACK / 2);
  const opacityA = useSharedValue(1);
  const opacityB = useSharedValue(0);
  const morph = useSharedValue(0);
  const fromShape = useSharedValue(0);
  const toShape = useSharedValue(0);

  const forms = useMemo(() => {
    const long = Math.max(SHORT * 2, (stage?.width ?? SHORT * 3) - STAGE_PAD * 2);
    const lengthA: Form = { w: SHORT, h: TRACK, r: TRACK / 2, a: 0, b: 0 };
    const lengthB: Form = { w: long, h: TRACK, r: TRACK / 2, a: 0, b: 0 };
    const swapA: Form = { w: SWAP_FROM_W, h: SWAP_FROM_H, r: SWAP_FROM_H / 2, a: 1, b: 0 };
    const swapB: Form = { w: long, h: SWAP_TO_H, r: SQUARE_RADIUS * 2, a: 0, b: 1 };
    if (kind === 'swap') return { from: swapA, to: swapB };
    return { from: lengthA, to: lengthB };
  }, [kind, stage?.width]);

  useEffect(() => {
    setToB(false);
    setShapeIndex(0);
    fromShape.value = 0;
    toShape.value = 0;
    morph.value = 0;
    const from = forms.from;
    width.value = from.w;
    height.value = from.h;
    radius.value = from.r;
    opacityA.value = from.a;
    opacityB.value = from.b;
  }, [forms, fromShape, height, morph, opacityA, opacityB, radius, toShape, width]);

  useEffect(() => {
    if (kind === 'shape') return;
    const next = toB ? forms.to : forms.from;
    width.value = withTiming(next.w, geometryTiming);
    height.value = withTiming(next.h, geometryTiming);
    radius.value = withTiming(next.r, geometryTiming);
    opacityA.value = withTiming(next.a, opacityTiming);
    opacityB.value = withTiming(next.b, opacityTiming);
  }, [forms, height, kind, opacityA, opacityB, radius, toB, width]);

  useEffect(() => {
    fromShape.value = shapeIndex;
    toShape.value = shapeIndex;
    morph.value = 0;
  }, [fromShape, morph, shapeIndex, toShape]);

  const advanceShape = useCallback(() => {
    const next = (shapeIndex + 1) % SHAPE_COUNT;
    fromShape.value = shapeIndex;
    toShape.value = next;
    morph.value = 0;
    morph.value = withTiming(1, geometryTiming, (finished) => {
      if (finished) scheduleOnRN(setShapeIndex, next);
    });
  }, [fromShape, morph, shapeIndex, toShape]);

  const shellStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: radius.value,
  }));
  const layerA = useAnimatedStyle(() => ({ opacity: opacityA.value }));
  const layerB = useAnimatedStyle(() => ({ opacity: opacityB.value }));
  const shapeProps = useAnimatedProps(() => {
    const stride = SHAPE_SAMPLES * 2;
    const from = fromShape.value * stride;
    const to = toShape.value * stride;
    const t = morph.value;
    let path = '';
    for (let index = 0; index < SHAPE_SAMPLES; index += 1) {
      const slot = index * 2;
      const x = SHAPE_POINTS[from + slot]! + (SHAPE_POINTS[to + slot]! - SHAPE_POINTS[from + slot]!) * t;
      const y =
        SHAPE_POINTS[from + slot + 1]! +
        (SHAPE_POINTS[to + slot + 1]! - SHAPE_POINTS[from + slot + 1]!) * t;
      path += `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    }
    return { d: `${path}Z` };
  });

  const fill = colors['material-card-deep'] as string;
  const ink = colors['text-base-primary'] as string;

  return (
    <View style={styles.stage} onLayout={(event) => setStage(event.nativeEvent.layout)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="切换形变"
        onPress={kind === 'shape' ? advanceShape : () => setToB((value) => !value)}
      >
        {kind === 'shape' ? (
          <Svg width={SHAPE_SIZE} height={SHAPE_SIZE}>
            <AnimatedPath animatedProps={shapeProps} fill={fill} />
          </Svg>
        ) : (
          <Animated.View style={[styles.shell, { backgroundColor: fill }, shellStyle]}>
            {kind === 'swap' ? (
              <>
                <Animated.Text style={[styles.glyph, layerA, { color: ink }]}>A</Animated.Text>
                <Animated.Text style={[styles.glyph, layerB, { color: ink }]}>B</Animated.Text>
              </>
            ) : null}
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    minHeight: (spacing['spacing-20'] as number) * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: STAGE_PAD,
  },
  shell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glyph: {
    position: 'absolute',
    fontSize: 17,
    ...edsFontStyle('600'),
  },
});
