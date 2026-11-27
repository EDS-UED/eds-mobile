import { EgButton } from '@eds/mobile-components';
import { router } from 'expo-router';
import { View } from 'react-native';

import { buildSearchDemoParams } from '@/data/components/searchDemoParams';
import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';

type ShowcaseSearchPreviewLaunchProps = {
  state: Record<string, unknown>;
};

/** EgSearch 详情 — 居中「演示」进入全屏底栏搜索页。 */
export function ShowcaseSearchPreviewLaunch({ state }: ShowcaseSearchPreviewLaunchProps) {
  return (
    <View style={showcaseComponentPreviewContentStyle}>
      <EgButton
        label="演示"
        tone="brand"
        size="md"
        onPress={() =>
          router.push({
            pathname: '/(components)/search-demo',
            params: buildSearchDemoParams(state),
          })
        }
      />
    </View>
  );
}