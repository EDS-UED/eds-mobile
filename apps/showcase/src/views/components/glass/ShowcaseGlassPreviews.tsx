import { GlassBlurScope, GlassControlShell, type GlassBoxClassName } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxEffectPreview } from '@/views/tokens/GlassBoxEffectPreview';
import { ScrollEdgeEffectPreviewLaunch } from '@/views/components/glass/ScrollEdgeEffectPreviewLaunch';

type GlassPreviewModeProps = {
  mode?: 'light' | 'dark';
  testID?: string;
};

type ShowcaseEgGlassPreviewProps = GlassPreviewModeProps & {
  box?: GlassBoxClassName;
};

/** EgGlass 详情 — BlurGlass 盒预览。 */
export function ShowcaseEgGlassPreview({
  box = 'glass-button-box',
  mode = 'light',
  testID,
}: ShowcaseEgGlassPreviewProps) {
  const colors = useShowcaseColors();

  return (
    <View style={styles.stageWrap} testID={testID}>
      <GlassBlurScope>
        <View style={styles.glassStage}>
          <GlassBoxEffectPreview className={box} mode={mode} colors={colors} />
        </View>
      </GlassBlurScope>
    </View>
  );
}

type ShowcaseEgScrollEdgePreviewProps = GlassPreviewModeProps & Record<string, unknown>;

/** EgScrollEdgeEffect 详情 — 跳转全屏 page 演示（定制项经 query 带入）。 */
export function ShowcaseEgScrollEdgePreview(props: ShowcaseEgScrollEdgePreviewProps) {
  return (
    <View style={styles.scrollEdgeStage} testID={props.testID}>
      <ScrollEdgeEffectPreviewLaunch state={props} />
    </View>
  );
}

export function ShowcaseGlassControlShellPreview({ mode = 'light', testID }: GlassPreviewModeProps) {
  return (
    <View style={styles.controlShellStage} testID={testID}>
      <GlassControlShell shape="circle" mode={mode} accessibilityLabel="Glass control">
        <View style={styles.controlShellDot} />
      </GlassControlShell>
    </View>
  );
}

const styles = StyleSheet.create({
  stageWrap: {
    width: '100%',
    alignItems: 'center',
  },
  glassStage: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  controlShellStage: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
  },
  controlShellDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  scrollEdgeStage: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
