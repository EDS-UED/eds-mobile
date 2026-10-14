import { GlassBlurScope, GlassControlShell, type GlassBoxClassName } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxEffectPreview } from '@/views/tokens/GlassBoxEffectPreview';

type GlassPreviewModeProps = {
  mode?: 'light' | 'dark';
  testID?: string;
};

type ShowcaseEgGlassPreviewProps = GlassPreviewModeProps & {
  box?: GlassBoxClassName;
};

/** EgGlass 详情 — 各 Type 均为 Effect Glass Box 240px 预览（非 EgTabBar 场景）。 */
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
});
