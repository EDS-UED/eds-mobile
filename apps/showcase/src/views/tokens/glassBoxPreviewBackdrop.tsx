import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { GLASS_BOX_BACKDROP_ORB_PX } from '@/views/tokens/glassBoxPreviewMetrics';

const orbRadius = GLASS_BOX_BACKDROP_ORB_PX / 2;

/** Effect Glass Box 详情 / 组件 preview — 居中单颗 blur 背衬色块（由父级 flex 居中）。 */
export function GlassBoxPreviewBackdropGradient({ colors }: { colors: ShowcaseColorMap }) {
  return (
    <LinearGradient
      colors={[
        colors['material-brand'] as string,
        colors['status-warning'] as string,
        colors['status-danger'] as string,
      ]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.orb}
    />
  );
}

const styles = StyleSheet.create({
  orb: {
    width: GLASS_BOX_BACKDROP_ORB_PX,
    height: GLASS_BOX_BACKDROP_ORB_PX,
    borderRadius: orbRadius,
    opacity: 0.92,
  },
});
