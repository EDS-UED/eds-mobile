import { View, type ViewProps } from 'react-native';
import type { EgIconNickNameProps } from './EgIconNickName.types';

/** RN implementation — eds-nick-name (component) */
export function EgIconNickName(props: EgIconNickNameProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-nick-name' } style={style} accessibilityLabel="eds-nick-name" />;
}
