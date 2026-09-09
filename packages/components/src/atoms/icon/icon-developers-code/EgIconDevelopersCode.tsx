import { View, type ViewProps } from 'react-native';
import type { EgIconDevelopersCodeProps } from './EgIconDevelopersCode.types';

/** RN implementation — eds-developers-code (component) */
export function EgIconDevelopersCode(props: EgIconDevelopersCodeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-developers-code' } style={style} accessibilityLabel="eds-developers-code" />;
}
