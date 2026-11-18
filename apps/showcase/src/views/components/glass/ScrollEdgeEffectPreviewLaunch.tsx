import { EgButton } from '@eds/mobile-components';
import { router } from 'expo-router';
import { View } from 'react-native';

import { buildScrollEdgeDemoParams } from '@/data/tokens/scrollEdgeDemoParams';
import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';

type ScrollEdgeEffectPreviewLaunchProps = {
  state: Record<string, unknown>;
};

/** 详情预览区 — 居中按钮进入全屏演示（与其它 Live 预览区一致，无 chevron 行）。 */
export function ScrollEdgeEffectPreviewLaunch({ state }: ScrollEdgeEffectPreviewLaunchProps) {
  return (
    <View style={showcaseComponentPreviewContentStyle}>
      <EgButton
        label="预览"
        tone="brand"
        size="md"
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