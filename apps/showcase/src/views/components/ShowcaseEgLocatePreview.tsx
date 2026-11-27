import { StyleSheet, View } from 'react-native';

import { ShowcaseLocatePreviewLaunch } from '@/views/components/ShowcaseLocatePreviewLaunch';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';

/** EgLocate 详情 — 仅「演示」按钮（索引交互见全屏 locate-demo）。 */
export function ShowcaseEgLocatePreview(props: Record<string, unknown>) {
  return (
    <View style={styles.stage} testID={typeof props.testID === 'string' ? props.testID : undefined}>
      <ShowcaseLocatePreviewLaunch />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    minHeight: edsSpacing('spacing-20') * 2,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
