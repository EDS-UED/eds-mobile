import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { EgSpinner } from '../../../shared/EgSpinner.js';
import { MotionPressable } from '../../../shared/MotionPressable.js';
import type { ButtonFigmaType, ButtonTone, ControlSize, EgCommonProps, EgLabelProps } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { createButtonStyles, spinnerColor } from './buttonStyles.js';

export type EgButtonBaseProps = EgCommonProps &
  EgLabelProps & {
    tone: ButtonTone;
    figmaType?: ButtonFigmaType;
    size?: ControlSize;
    disabled?: boolean;
    loading?: boolean;
    active?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'leading' | 'trailing';
    onPress?: () => void;
    style?: ViewStyle;
  };

export function EgButtonBase({
  tone,
  figmaType = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  active = false,
  label,
  children,
  icon,
  iconPosition = 'leading',
  onPress,
  testID,
  mode = 'light',
  style,
  accessibilityLabel,
}: EgButtonBaseProps) {
  const isDisabled = disabled || loading;
  const content = children ?? label ?? 'Button';
  const resolvedMode: ThemeMode = mode;

  return (
    <MotionPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : 'Button')}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.root, style]}
    >
      {({ pressed }) => {
        const visual = createButtonStyles({
          tone,
          figmaType,
          size,
          mode: resolvedMode,
          disabled,
          loading,
          pressed,
          active,
        });

        if (loading) {
          return (
            <View style={visual.container}>
              <EgSpinner
                color={spinnerColor({ tone, figmaType, size, mode: resolvedMode, disabled, loading })}
              />
            </View>
          );
        }

        return (
          <View style={[visual.container, styles.row]}>
            {icon && iconPosition === 'leading' ? icon : null}
            <Text style={visual.label}>{content}</Text>
            {icon && iconPosition === 'trailing' ? icon : null}
          </View>
        );
      }}
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
