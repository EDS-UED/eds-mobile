import { View, type ViewProps } from 'react-native';
import type { EgIconPayeeProps } from './EgIconPayee.types';

/** RN implementation — eds-payee (component) */
export function EgIconPayee(props: EgIconPayeeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-payee' } style={style} accessibilityLabel="eds-payee" />;
}
