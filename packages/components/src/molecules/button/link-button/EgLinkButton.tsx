import { Text, type ViewStyle } from 'react-native';
import type { ControlSize, EgCommonProps, EgLabelProps } from '../../../shared/types.js';
import { EgEdsAnimaPress } from '../../../shared/motion/EgEdsAnimaPress.js';
import {
  createLinkButtonStyles,
  normalizeEgLinkButtonTone,
  type EgLinkButtonTone,
} from '../_shared/linkButtonStyles.js';

export type EgLinkButtonProps = EgCommonProps &
  EgLabelProps & {
    size?: Extract<ControlSize, 'lg' | 'md' | 'sm'>;
    tone?: EgLinkButtonTone;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
  };

export function EgLinkButton({
  size = 'lg',
  tone = 'brand',
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
  const resolvedTone = normalizeEgLinkButtonTone(tone);

  return (
    <EgEdsAnimaPress
      testID={testID ?? 'button-link'}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : 'Link')}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      pressScaleDirection="down"
      pressIntensity="md"
      style={({ pressed }) => {
        const visual = createLinkButtonStyles(mode, size, resolvedTone, disabled, pressed);
        return [visual.container, style];
      }}
    >
      {({ pressed }) => {
        const visual = createLinkButtonStyles(mode, size, resolvedTone, disabled, pressed);
        return (
          <Text style={visual.label}>
            {content}
          </Text>
        );
      }}
    </EgEdsAnimaPress>
  );
}
