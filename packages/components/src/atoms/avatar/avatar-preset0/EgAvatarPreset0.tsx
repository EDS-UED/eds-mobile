import { View, type ViewProps } from 'react-native';
import type { EgAvatarPreset0Props } from './EgAvatarPreset0.types';

/** RN implementation — eds-avatar-0 (component) */
export function EgAvatarPreset0(props: EgAvatarPreset0Props & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'avatar-preset-0' } style={style} accessibilityLabel="eds-avatar-0" />;
}
