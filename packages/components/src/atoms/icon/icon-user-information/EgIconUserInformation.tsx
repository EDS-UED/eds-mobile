import { View, type ViewProps } from 'react-native';
import type { EgIconUserInformationProps } from './EgIconUserInformation.types';

/** RN implementation — eds-user-information (component) */
export function EgIconUserInformation(props: EgIconUserInformationProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-information' } style={style} accessibilityLabel="eds-user-information" />;
}
