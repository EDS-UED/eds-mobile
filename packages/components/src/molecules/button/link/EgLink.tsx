import { Text, type ViewStyle } from 'react-native';
import { EdsSansText } from '../../../shared/EdsSansText.js';
import type { ControlSize, EgCommonProps, EgLabelProps } from '../../../shared/types.js';
import { EgEdsAnimaPress } from '../../../shared/motion/EgEdsAnimaPress.js';
import { linkLabelWeight } from '../../../shared/typographyStyles.js';
import {
  createLinkButtonStyles,
  normalizeEgLinkTone,
  type EgLinkTone,
} from '../_shared/linkButtonStyles.js';

export type EgLinkProps = EgCommonProps &
  EgLabelProps & {
    size?: Extract<ControlSize, 'lg' | 'md' | 'sm'>;
    tone?: EgLinkTone;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
  };

export function EgLink({
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
}: EgLinkProps) {
  const content = children ?? label ?? 'Link';
  const resolvedTone = normalizeEgLinkTone(tone);

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
        return typeof content === 'string' ? (
          <EdsSansText weight={linkLabelWeight(size)} style={visual.label}>
            {content}
          </EdsSansText>
        ) : (
          <Text style={visual.label}>{content}</Text>
        );
      }}
    </EgEdsAnimaPress>
  );
}