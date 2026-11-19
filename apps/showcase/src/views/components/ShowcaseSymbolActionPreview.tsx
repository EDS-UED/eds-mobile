import { EgSymbolAction } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

type ShowcaseSymbolActionPreviewProps = Record<string, unknown> & {
  mode?: 'light' | 'dark';
  testID?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  tone?: 'brand' | 'decor' | 'danger' | 'shallow' | 'plain';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
};

/** EgSymbolAction 详情 Live — 走业务入口，不依赖 catalog 懒加载。 */
export function ShowcaseSymbolActionPreview(props: ShowcaseSymbolActionPreviewProps) {
  const {
    mode = 'light',
    testID,
    size = 'md',
    tone = 'brand',
    icon = 'eds-add',
    disabled = false,
    loading = false,
  } = props;

  return (
    <View style={styles.host}>
      <EgSymbolAction
        mode={mode}
        testID={testID}
        size={size}
        tone={tone}
        icon={icon}
        disabled={disabled}
        loading={loading}
        accessibilityLabel="Symbol action"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignItems: 'center',
    width: '100%',
  },
});