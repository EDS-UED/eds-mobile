import { Canvas, Circle, SweepGradient, vec } from '@shopify/react-native-skia';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { GLASS_BOX_BACKDROP_ORB_PX } from '@/views/tokens/glassBoxPreviewMetrics';

const orbRadius = GLASS_BOX_BACKDROP_ORB_PX / 2;

/** 锥形色轮背衬 — 与 Figma Glass Box 演示一致（Skia · 不可用时回落线性渐变）。 */
const CONIC_COLORS = [
  '#E4FF5C',
  '#12C9A5',
  '#3D6CFF',
  '#E850FF',
  '#FF4D42',
  '#FFAC2E',
  '#E4FF5C',
] as const;

const CONIC_POSITIONS = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1] as const;

function ConicOrb() {
  const center = vec(orbRadius, orbRadius);
  return (
    <Canvas style={styles.orb}>
      <Circle cx={center.x} cy={center.y} r={orbRadius}>
        <SweepGradient c={center} colors={[...CONIC_COLORS]} positions={[...CONIC_POSITIONS]} />
      </Circle>
    </Canvas>
  );
}

function LinearOrbFallback({ colors }: { colors: ShowcaseColorMap }) {
  return (
    <LinearGradient
      colors={[
        colors['material-match'] as string,
        colors['material-brand'] as string,
        colors['material-decor'] as string,
        colors['status-warning'] as string,
        colors['status-danger'] as string,
      ]}
      locations={[0, 0.22, 0.45, 0.72, 1]}
      start={{ x: 0.08, y: 0.05 }}
      end={{ x: 0.92, y: 0.95 }}
      style={styles.orb}
    />
  );
}

/** Effect Glass Box 详情 / 组件 preview — 居中单颗 blur 背衬色块（由父级 flex 居中）。 */
export function GlassBoxPreviewBackdropGradient({ colors }: { colors: ShowcaseColorMap }) {
  let useSkia = true;
  try {
    if (typeof Canvas !== 'function') {
      useSkia = false;
    }
  } catch {
    useSkia = false;
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      {useSkia ? <ConicOrb /> : <LinearOrbFallback colors={colors} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: GLASS_BOX_BACKDROP_ORB_PX,
    height: GLASS_BOX_BACKDROP_ORB_PX,
    borderRadius: orbRadius,
    opacity: 0.94,
  },
});