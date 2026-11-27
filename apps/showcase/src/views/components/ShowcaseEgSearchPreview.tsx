import { StyleSheet, View } from 'react-native';

import { ShowcaseSearchPreviewLaunch } from '@/views/components/ShowcaseSearchPreviewLaunch';

/** EgSearch 详情 — 仅「演示」按钮（真实布局见全屏 search-demo）。 */
export function ShowcaseEgSearchPreview(props: Record<string, unknown>) {
  return (
    <View style={styles.stage} testID={typeof props.testID === 'string' ? props.testID : undefined}>
      <ShowcaseSearchPreviewLaunch state={props} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    alignSelf: 'stretch',
  },
});