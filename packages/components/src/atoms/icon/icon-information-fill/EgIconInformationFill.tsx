import { View, type ViewProps } from 'react-native';
import type { EgIconInformationFillProps } from './EgIconInformationFill.types';

/** RN implementation — eds-information-fill (component) */
export function EgIconInformationFill(props: EgIconInformationFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-information-fill' } style={style} accessibilityLabel="eds-information-fill" />;
}
