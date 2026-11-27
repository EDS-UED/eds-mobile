import { EgButton } from '@eds/mobile-components';
import { router } from 'expo-router';
import { View } from 'react-native';

import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';

/** EgLocate 详情 — 居中「演示」进入全屏索引。 */
export function ShowcaseLocatePreviewLaunch() {
  return (
    <View style={showcaseComponentPreviewContentStyle}>
      <EgButton
        label="演示"
        tone="brand"
        size="md"
        onPress={() =>
          router.push({
            pathname: '/(components)/locate-demo',
          })
        }
      />
    </View>
  );
}
