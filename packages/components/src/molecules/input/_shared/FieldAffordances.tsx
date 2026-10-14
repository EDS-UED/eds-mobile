import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { fieldTypography, presetBodyMediumStrong, presetBodySmallStrong } from '../../../shared/typographyStyles.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import type { ControlSize } from '../../../shared/types.js';

export function FieldChevron({ mode = 'light', disabled = false }: { mode?: ThemeMode; disabled?: boolean }) {
  const colors = getThemeColors(mode);
  const iconSize = mobileTheme.spacing['symbol-xs'] as number;
  return (
    <View style={[styles.box, { width: iconSize, height: iconSize }]}>
      <Text
        style={{
          color: resolveColor(colors, disabled ? 'text-base-quaternary' : 'text-base-secondary'),
          fontSize: mobileTheme.typography.base['size-toggle-mark-md'] as number,
          lineHeight: iconSize,
          textAlign: 'center',
          ...edsFontStyle('400'),
        }}
      >
        ▾
      </Text>
    </View>
  );
}

/** Figma Input Entering — 16px eds-close，无圆形底。 */
export function FieldInlineClear({
  mode = 'light',
  onPress,
}: {
  mode?: ThemeMode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Clear"
      onPress={onPress}
      style={styles.inlineClear}
    >
      <EgSymbol name="eds-close" size="xs" mode={mode} />
    </Pressable>
  );
}

export function FieldPasteAction({
  mode = 'light',
  label = 'Paste',
  onPress,
}: {
  mode?: ThemeMode;
  label?: string;
  onPress?: () => void;
}) {
  const colors = getThemeColors(mode);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionHit}>
      <Text style={[presetBodySmallStrong(), { color: resolveColor(colors, 'text-brand') }]}>{label}</Text>
    </Pressable>
  );
}

export function FieldMaxAction({
  mode = 'light',
  label = 'Max',
  onPress,
}: {
  mode?: ThemeMode;
  label?: string;
  onPress?: () => void;
}) {
  const colors = getThemeColors(mode);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionHit}>
      <Text style={[presetBodyMediumStrong(), { color: resolveColor(colors, 'text-brand') }]}>{label}</Text>
    </Pressable>
  );
}

export function FieldUnitLabel({
  mode = 'light',
  size = 'xl',
  label = 'Unit',
}: {
  mode?: ThemeMode;
  size?: ControlSize;
  label?: string;
}) {
  const colors = getThemeColors(mode);
  return (
    <Text style={[fieldTypography(size), styles.unit, { color: resolveColor(colors, 'text-base-primary') }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineClear: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionHit: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unit: {
    flexShrink: 0,
    textAlign: 'right',
  },
});
