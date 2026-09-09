import { View, type ViewProps } from 'react-native';
import type { EgIconLoadProps } from './EgIconLoad.types';

/** RN implementation — eds-load (component) */
export function EgIconLoad(props: EgIconLoadProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-load' } style={style} accessibilityLabel="eds-load" />;
}
