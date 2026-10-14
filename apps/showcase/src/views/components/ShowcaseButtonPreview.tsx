import {
  EgBrandButton,
  EgDangerButton,
  EgDecorButton,
  EgOptionButton,
} from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import {
  buttonShowcaseVariantToFigmaType,
  buttonShowcaseWidthStyle,
  type ButtonShowcaseTone,
} from '@/data/components/buttonShowcaseModel';

type ShowcaseButtonPreviewProps = Record<string, unknown> & {
  mode?: 'light' | 'dark';
  testID?: string;
  tone?: ButtonShowcaseTone;
  variant?: string;
  width?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  label?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function ShowcaseButtonPreview(props: ShowcaseButtonPreviewProps) {
  const {
    mode = 'light',
    testID,
    tone = 'brand',
    variant = 'solid',
    width = 'hug',
    size = 'lg',
    label = 'Button',
    disabled = false,
    loading = false,
  } = props;

  const figmaType = buttonShowcaseVariantToFigmaType(String(variant));
  const widthStyle = buttonShowcaseWidthStyle(String(width));
  const common = {
    mode,
    testID,
    figmaType,
    size,
    label,
    disabled,
    loading,
    style: widthStyle,
  };

  const button =
    tone === 'decor' ? (
      <EgDecorButton {...common} />
    ) : tone === 'danger' ? (
      <EgDangerButton {...common} />
    ) : tone === 'option' ? (
      <EgOptionButton {...common} />
    ) : (
      <EgBrandButton {...common} />
    );

  return (
    <View style={[styles.host, width === 'fill' ? styles.hostFill : null]}>
      {button}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignItems: 'center',
    width: '100%',
  },
  hostFill: {
    alignItems: 'stretch',
  },
});
