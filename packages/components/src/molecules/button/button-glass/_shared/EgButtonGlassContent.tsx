import { StyleSheet, Text, View } from 'react-native';
import { EgSymbol } from '../../../../atoms/_shared/symbol/EgSymbol.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../../theme/index.js';
import { buttonTypography } from '../../../../shared/typographyStyles.js';
import type { ControlSize } from '../../../../shared/types.js';
import type { EgButtonGlassIconCount, EgButtonGlassKind } from '../EgButtonGlass.types.js';

type EgButtonGlassContentProps = {
  kind: EgButtonGlassKind;
  size: ControlSize;
  label?: string;
  icon?: string;
  iconCount?: EgButtonGlassIconCount;
  iconAlt?: string;
  mode: ThemeMode;
};

export function EgButtonGlassContent({
  kind,
  size,
  label,
  icon,
  iconCount = 1,
  iconAlt,
  mode,
}: EgButtonGlassContentProps) {
  const colors = getThemeColors(mode);
  const primaryColor = colors['text-base-primary'] as string;

  if (kind === 'icon') {
    const count = iconCount === 2 ? 2 : 1;
    const primary = icon ?? 'eds-list-lattice-mobile';
    const names = count === 2 ? [primary, iconAlt ?? primary] : [primary];
    const gap = mobileTheme.spacing['spacing-4'] as number;

    return (
      <View style={[styles.iconRow, count === 2 ? { gap } : null]}>
        {names.map((symbolName, index) => (
          <EgSymbol
            key={`${symbolName}-${index}`}
            name={symbolName}
            size="md"
            mode={mode}
            fillTone="primary"
          />
        ))}
      </View>
    );
  }

  const text = label ?? '编辑';
  return (
    <Text style={[buttonTypography(size), styles.text, { color: primaryColor }]} numberOfLines={1}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
