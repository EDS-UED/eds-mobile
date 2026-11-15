import { router } from 'expo-router';
import { View } from 'react-native';

import { buildScrollEdgeDemoParams } from '@/data/tokens/scrollEdgeDemoParams';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type ScrollEdgeEffectPreviewLaunchProps = {
  state: Record<string, unknown>;
};

/** 详情卡片 — 不嵌全页模拟器；跳转全屏 Scroll Edge 演示。 */
export function ScrollEdgeEffectPreviewLaunch({ state }: ScrollEdgeEffectPreviewLaunchProps) {
  return (
    <View style={{ width: '100%', gap: theme.layout.cardGap }}>
      <ShowcaseCardRow
        title="全屏演示"
        hint="顶栏 Scroll Edge · 列表上滑 · 定制项同步带入"
        onPress={() =>
          router.push({
            pathname: '/(components)/scroll-edge-demo',
            params: buildScrollEdgeDemoParams(state),
          })
        }
      />
    </View>
  );
}