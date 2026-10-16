import type { ReactNode } from 'react';
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
  primaryReplacement?: ReactNode;
  secondaryReplacement?: ReactNode;
  mode: ThemeMode;
};

export function EgButtonGlassContent({
  kind,
  size,
  label,
  icon,
  iconCount = 1,
  iconAlt,
  primaryReplacement,
  secondaryReplacement,
  mode,
}: EgButtonGlassContentProps) {
  const colors = getThemeColors(mode);
  const primaryColor = colors['text-base-primary'] as string;
  const gap = mobileTheme.spacing['spacing-4'] as number;

  if (kind === 'text') {
    const text = label ?? '编辑';
    return (
      <Text style={[buttonTypography(size), styles.text, { color: primaryColor }]} numberOfLines={1}>
        {text}
      </Text>
    );
  }

  const count = iconCount === 2 ? 2 : 1;

  if (count === 1) {
    if (primaryReplacement) {
      return <View style={styles.center}>{primaryReplacement}</View>;
    }
    return (
      <View style={styles.center}>
        <EgSymbol
          name={icon ?? 'eds-list-lattice-mobile'}
          size="md"
          mode={mode}
          fillTone="primary"
        />
      </View>
    );
  }

  const leftIcon = icon ?? 'eds-list-lattice-mobile';
  return (
    <View style={[styles.iconRow, { gap }]}>
      <EgSymbol name={leftIcon} size="md" mode={mode} fillTone="primary" />
      {secondaryReplacement ?? (
        <EgSymbol name={iconAlt ?? leftIcon} size="md" mode={mode} fillTone="primary" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
