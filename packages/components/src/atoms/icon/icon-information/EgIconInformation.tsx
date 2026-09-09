import { View, type ViewProps } from 'react-native';
import type { EgIconInformationProps } from './EgIconInformation.types';

/** RN implementation — eds-information (component) */
export function EgIconInformation(props: EgIconInformationProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-information' } style={style} accessibilityLabel="eds-information" />;
}
