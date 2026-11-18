import { EgSymbolAction } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { buttonShowcaseVariantToFigmaType } from '@/data/components/buttonShowcaseModel';

type ShowcaseSymbolActionPreviewProps = Record<string, unknown> & {
  mode?: 'light' | 'dark';
  testID?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  variant?: string;
  figmaType?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
  disabled?: boolean;
  loading?: boolean;
};

/** EgSymbolAction 详情 Live — 走业务入口，不依赖 catalog 懒加载。 */
export function ShowcaseSymbolActionPreview(props: ShowcaseSymbolActionPreviewProps) {
  const {
    mode = 'light',
    testID,
    size = 'md',
    variant = 'solid',
    figmaType: figmaTypeProp,
    label = '+',
    disabled = false,
    loading = false,
  } = props;

  const figmaType =
    figmaTypeProp ?? buttonShowcaseVariantToFigmaType(String(variant ?? 'solid'));

  return (
    <View style={styles.host}>
      <EgSymbolAction
        mode={mode}
        testID={testID}
        size={size}
        figmaType={figmaType}
        label={label}
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