import { View, type ViewProps } from 'react-native';
import type { EgIconUserCheckValidateProps } from './EgIconUserCheckValidate.types';

/** RN implementation — eds-user-check-validate (component) */
export function EgIconUserCheckValidate(props: EgIconUserCheckValidateProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-check-validate' } style={style} accessibilityLabel="eds-user-check-validate" />;
}
