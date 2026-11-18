import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { parseScrollEdgeDemoParams } from '@/data/tokens/scrollEdgeDemoParams';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcaseDetailScreenBackgroundColor } from '@/views/shared/showcaseTheme';
import { ScrollEdgeEffectMiniPreview } from '@/views/tokens/ScrollEdgeEffectMiniPreview';

const DEMO_TITLE = 'Scroll Edge 演示';

/** Scroll Edge Effect 全屏演示 — 系统返回 · 定制项经 query 带入。 */
export function ShowcaseScrollEdgeDemoView() {
  const params = useLocalSearchParams<Record<string, string | undefined>>();
  const colors = useShowcaseColors();
  const state = parseScrollEdgeDemoParams(params);
  const background = showcaseDetailScreenBackgroundColor(colors);
  const { stackScreenOptions, nativeStackNav, rnNavBar } = useShowcaseStackNav(DEMO_TITLE);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <View style={[styles.screen, { backgroundColor: background }]}>
          <ScrollEdgeEffectMiniPreview state={state} colors={colors} layout="fullscreen" />
        </View>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});