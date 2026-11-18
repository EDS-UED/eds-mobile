import type { ControlSize, EgCommonProps, EgLabelProps } from '../../../shared/types.js';
import type { EgLinkTone } from '../_shared/linkButtonStyles.js';

export type EgLinkProps = EgCommonProps &
  EgLabelProps & {
    size?: Extract<ControlSize, 'lg' | 'md' | 'sm'>;
    tone?: EgLinkTone;
    disabled?: boolean;
    onPress?: () => void;
    style?: import('react-native').ViewStyle;
  };