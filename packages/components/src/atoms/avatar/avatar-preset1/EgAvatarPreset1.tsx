import { View, type ViewProps } from 'react-native';
import type { EgAvatarPreset1Props } from './EgAvatarPreset1.types';

/** RN implementation — eds-avatar-1 (component) */
export function EgAvatarPreset1(props: EgAvatarPreset1Props & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'avatar-preset-1' } style={style} accessibilityLabel="eds-avatar-1" />;
}
