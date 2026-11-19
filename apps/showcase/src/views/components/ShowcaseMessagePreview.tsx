import { EgMessage } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

type ShowcaseMessagePreviewProps = Record<string, unknown> & {
  mode?: 'light' | 'dark';
  testID?: string;
  tone?: 'brand' | 'decor' | 'danger' | 'shallow';
  label?: string;
};

/** EgMessage 详情 Live — 走业务入口，与 Customize 态一致。 */
export function ShowcaseMessagePreview(props: ShowcaseMessagePreviewProps) {
  const { mode = 'light', testID, tone = 'brand', label = '9' } = props;

  return (
    <View style={styles.host}>
      <EgMessage mode={mode} testID={testID} tone={tone} label={label} accessibilityLabel="Message" />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignItems: 'center',
    width: '100%',
  },
});