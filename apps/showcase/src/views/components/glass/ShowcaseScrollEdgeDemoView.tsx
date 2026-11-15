import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { parseScrollEdgeDemoParams } from '@/data/tokens/scrollEdgeDemoParams';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseDetailScreenBackgroundColor } from '@/views/shared/showcaseTheme';
import { ScrollEdgeEffectMiniPreview } from '@/views/tokens/ScrollEdgeEffectMiniPreview';

/** Scroll Edge Effect 全屏演示（EgGlass 定制 · token 页同款场景）。 */
export function ShowcaseScrollEdgeDemoView() {
  const params = useLocalSearchParams<Record<string, string | undefined>>();
  const colors = useShowcaseColors();
  const state = parseScrollEdgeDemoParams(params);
  const background = showcaseDetailScreenBackgroundColor(colors);

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <Stack.Screen options={{ headerShown: false, contentStyle: { backgroundColor: background } }} />
      <ScrollEdgeEffectMiniPreview state={state} colors={colors} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});