import { StyleSheet, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type ColorTokenSwatchProps = {
  value: string;
  size?: number;
};

export function ColorTokenSwatch({ value, size = 32 }: ColorTokenSwatchProps) {
  const colors = useShowcaseColors();
  const isTransparent = value === 'transparent' || /^#[0-9a-f]{6}00$/i.test(value);

  return (
    <View
      style={[
        styles.swatch,
        {
          width: size,
          height: size,
          borderRadius: theme.radius.full,
          backgroundColor: isTransparent ? (colors['box-page'] as string) : value,
          borderColor: colors['stroke-divider-shallow'] as string,
        },
      ]}
    >
      {isTransparent ? <View style={[styles.swatchInner, { backgroundColor: value }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  swatch: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  swatchInner: {
    flex: 1,
  },
});
