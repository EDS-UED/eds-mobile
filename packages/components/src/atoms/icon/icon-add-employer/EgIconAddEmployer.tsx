import { View, type ViewProps } from 'react-native';
import type { EgIconAddEmployerProps } from './EgIconAddEmployer.types';

/** RN implementation — eds-add-employer (component) */
export function EgIconAddEmployer(props: EgIconAddEmployerProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-add-employer' } style={style} accessibilityLabel="eds-add-employer" />;
}
