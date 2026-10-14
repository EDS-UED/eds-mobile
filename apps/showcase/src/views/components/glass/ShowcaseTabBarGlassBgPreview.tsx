import { EgTabBarGlassBg, GlassBlurScope } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';
type Props = {
  mode?: 'light' | 'dark';
  testID?: string;
};

/** Glass BG. 场景 — 与 EgTabBar 同 RN Effect 栈，仅底壳。 */
export function ShowcaseTabBarGlassBgPreview({ mode = 'light', testID }: Props) {
  const colors = useShowcaseColors();

  return (
    <View style={styles.stageWrap} testID={testID}>
      <GlassBlurScope>
        <View style={styles.backdropHost}>
          <GlassBoxPreviewBackdropGradient colors={colors} />
        </View>
        <EgTabBarGlassBg mode={mode} testID={testID ?? 'tab-bar-glass-bg'} style={styles.bar} />
      </GlassBlurScope>
    </View>
  );
}

const styles = StyleSheet.create({
  stageWrap: {
    width: '100%',
    paddingVertical: 8,
  },
  backdropHost: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  bar: {
    minHeight: 62,
    width: '100%',
  },
});
