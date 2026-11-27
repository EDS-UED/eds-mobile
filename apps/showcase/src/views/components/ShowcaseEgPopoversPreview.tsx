import {
  EgPopovers,
  GlassBlurBackdrop,
  GlassBlurScope,
  type EgPopoversEdge,
} from '@eds/mobile-components';
import { StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';
import { GLASS_BOX_BACKDROP_ORB_PX } from '@/views/tokens/glassBoxPreviewMetrics';
import { edsSpacing, edsTokenFont } from '@/views/shared/resolveEdsTheme';

const EDGES = new Set<EgPopoversEdge>([
  'top-leading',
  'top-center',
  'top-trailing',
  'leading-top',
  'leading-middle',
  'leading-bottom',
  'trailing-top',
  'trailing-middle',
  'trailing-bottom',
  'bottom-leading',
  'bottom-center',
  'bottom-trailing',
]);

function readEdge(value: unknown): EgPopoversEdge {
  return typeof value === 'string' && EDGES.has(value as EgPopoversEdge)
    ? (value as EgPopoversEdge)
    : 'leading-top';
}

/** 单壳预览 · Menu box 需背后采样；箭头轮廓 + 12px 内边距。 */
export function ShowcaseEgPopoversPreview(props: Record<string, unknown>) {
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const colors = useShowcaseColors();
  return (
    <View style={styles.host} testID={typeof props.testID === 'string' ? props.testID : undefined}>
      <View style={styles.stage}>
        <GlassBlurScope>
          <GlassBlurBackdrop style={StyleSheet.absoluteFill}>
            <View pointerEvents="none" style={styles.backdropHost}>
              <GlassBoxPreviewBackdropGradient colors={colors} />
            </View>
          </GlassBlurBackdrop>
          <View style={styles.contentLayer}>
            <EgPopovers
              mode={mode}
              edge={readEdge(props.edge)}
              slot={<Text style={styles.sample}>A</Text>}
            />
          </View>
        </GlassBlurScope>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: edsSpacing('spacing-20') * 2,
    overflow: 'visible',
  },
  stage: {
    width: GLASS_BOX_BACKDROP_ORB_PX,
    height: GLASS_BOX_BACKDROP_ORB_PX,
    alignSelf: 'center',
    overflow: 'visible',
  },
  backdropHost: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  sample: {
    ...edsTokenFont('headline', '700'),
    textAlign: 'center',
  },
});