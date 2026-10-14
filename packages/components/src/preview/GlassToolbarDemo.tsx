import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { EgSymbol } from '../atoms/_shared/symbol/EgSymbol.js';
import { GlassContainer, GlassControlShell } from '../atoms/glass/index.js';
import {
  getNativeGlassView,
  isNativeLiquidGlassAvailable,
} from '../atoms/glass/nativeLiquidGlass.js';
import { fieldTypography } from '../shared/typographyStyles.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

export type GlassToolbarDemoProps = {
  mode?: ThemeMode;
  style?: ViewStyle;
  /** Toolbar label — iOS nav bar "Done". */
  doneLabel?: string;
  onDonePress?: () => void;
  onConfirmPress?: () => void;
};

/**
 * iOS 27 Community · Done + check — iOS 走系统 Liquid Glass（`GlassControlShell` 内嵌原生）；
 * 其它平台：`GlassSurface` + token + glass-press。
 */
export function GlassToolbarDemo({
  mode = 'light',
  style,
  doneLabel = 'Done',
  onDonePress,
  onConfirmPress,
}: GlassToolbarDemoProps) {
  const colors = getThemeColors(mode);
  const doneLabelStyle = fieldTypography('lg');
  const clusterGap = mobileTheme.spacing['spacing-1'] as number;
  const nativeActive =
    Platform.OS === 'ios' &&
    Boolean(getNativeGlassView() && isNativeLiquidGlassAvailable());

  return (
    <View
      style={[
        styles.canvas,
        {
          backgroundColor: colors.page as string,
          borderColor: colors['stroke-divider-page'] as string,
        },
        style,
      ]}
    >
      <Text style={[styles.runtimeHint, { color: colors['text-base-secondary'] as string }]}>
        {nativeActive
          ? '本机：iOS 系统 Liquid Glass（expo-glass-effect）'
          : '本机：expo-blur + glass.surface preset（无系统液态 API）'}
      </Text>
      <GlassContainer morph={false} style={{ ...styles.row, gap: clusterGap }}>
        <GlassControlShell
          shape="capsule"
          mode={mode}
          variant="clear"
          accessibilityLabel={doneLabel}
          onPress={onDonePress}
          testID="glass-toolbar-done"
        >
          <Text style={[doneLabelStyle, { color: colors['text-base-primary'] as string }]}>
            {doneLabel}
          </Text>
        </GlassControlShell>

        <GlassControlShell
          shape="circle"
          mode={mode}
          variant="clear"
          accessibilityLabel="Confirm"
          onPress={onConfirmPress}
          testID="glass-toolbar-confirm"
        >
          <EgSymbol name="eds-tick-strong-fill" size="md" mode={mode} fillTone="primary" />
        </GlassControlShell>
      </GlassContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignSelf: 'stretch',
    borderRadius: mobileTheme.spacing['radius-xl'] as number,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: mobileTheme.spacing['spacing-5'] as number,
    paddingVertical: mobileTheme.spacing['spacing-4'] as number,
    gap: mobileTheme.spacing['spacing-2'] as number,
  },
  runtimeHint: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
  },
  row: {
    justifyContent: 'flex-end',
  },
});
