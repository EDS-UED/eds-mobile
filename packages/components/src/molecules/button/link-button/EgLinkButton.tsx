import { Text, type ViewStyle } from 'react-native';
import type { ControlSize, EgCommonProps, EgLabelProps } from '../../../shared/types.js';
import { EgEdsAnimaPress } from '../../../shared/motion/EgEdsAnimaPress.js';
import { createLinkButtonStyles } from '../_shared/linkButtonStyles.js';

export type EgLinkButtonProps = EgCommonProps &
  EgLabelProps & {
    size?: Extract<ControlSize, 'lg' | 'md' | 'sm'>;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
  };

export function EgLinkButton({
  size = 'lg',
  disabled = false,
  label,
  children,
  onPress,
  testID,
  mode = 'light',
  style,
  accessibilityLabel,
}: EgLinkButtonProps) {
  const content = children ?? label ?? 'Link';

  return (
    <EgEdsAnimaPress
      testID={testID ?? 'button-link'}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : 'Link')}
      accessibilityRole="link"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const visual = createLinkButtonStyles(mode, size, disabled, pressed);
        return [visual.container, style];
      }}
    >
      {({ pressed }) => {
        const visual = createLinkButtonStyles(mode, size, disabled, pressed);
        return <Text style={visual.label}>{content}</Text>;
      }}
    </EgEdsAnimaPress>
  );
}
