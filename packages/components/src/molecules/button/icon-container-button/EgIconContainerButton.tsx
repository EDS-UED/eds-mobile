import type { ButtonFigmaType, ControlSize, EgCommonProps } from '../../../shared/types.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { iconSizeForControl } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity, iconContainerLabelScale } from '../../../shared/themeScalars.js';
import { EgSpinner } from '../../../shared/EgSpinner.js';
import { EgEdsAnimaPress } from '../../../shared/motion/EgEdsAnimaPress.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { StyleSheet, Text, type ViewStyle } from 'react-native';

export type EgIconContainerButtonProps = EgCommonProps & {
  size?: ControlSize;
  figmaType?: ButtonFigmaType;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

export function EgIconContainerButton({
  size = 'md',
  figmaType = 'primary',
  disabled = false,
  loading = false,
  label = '+',
  onPress,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Icon button',
}: EgIconContainerButtonProps) {
  const colors = getThemeColors(mode);
  const dimension = mobileTheme.spacing[`capsule-${size}`] as number;
  const isDisabled = disabled || loading;

  return (
    <EgEdsAnimaPress
      testID={testID ?? 'button-icon-container'}
      accessibilityLabel={accessibilityLabel}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => {
        const bg =
          figmaType === 'primary'
            ? pressed
              ? resolveColor(colors, 'event-tap-brand')
              : resolveColor(colors, 'material-brand')
            : figmaType === 'secondary'
              ? pressed
                ? resolveColor(colors, 'event-tap')
                : resolveColor(colors, 'material-card-moderate')
              : pressed
                ? resolveColor(colors, 'material-card-moderate')
                : resolveColor(colors, 'material-hide');

        const borderColor =
          figmaType === 'secondary' ? resolveColor(colors, 'stroke-color-brand') : 'transparent';

        const textColor =
          figmaType === 'primary'
            ? resolveColor(colors, 'text-same-white')
            : resolveColor(colors, 'text-brand');

        return [
          styles.base,
          {
            width: dimension,
            height: dimension,
            borderRadius: mobileTheme.spacing['radius-full'] as number,
            backgroundColor: bg,
            borderColor,
            borderWidth: figmaType === 'secondary' ? (mobileTheme.spacing['stroke-md'] as number) : 0,
            opacity: isDisabled ? disabledOpacity() : 1,
          },
          style,
        ];
      }}
    >
      {loading ? (
        <EgSpinner color={resolveColor(colors, figmaType === 'primary' ? 'text-same-white' : 'text-brand')} />
      ) : (
        <Text
          style={{
            color:
              figmaType === 'primary'
                ? resolveColor(colors, 'text-same-white')
                : resolveColor(colors, 'text-brand'),
            fontSize: iconSizeForControl(size) * iconContainerLabelScale(),
            ...edsFontStyle('600'),
          }}
        >
          {label}
        </Text>
      )}
    </EgEdsAnimaPress>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
