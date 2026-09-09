import { View, type ViewProps } from 'react-native';
import type { EgIconAddEmployerFillProps } from './EgIconAddEmployerFill.types';

/** RN implementation — eds-add-employer-fill (component) */
export function EgIconAddEmployerFill(props: EgIconAddEmployerFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-add-employer-fill' } style={style} accessibilityLabel="eds-add-employer-fill" />;
}
