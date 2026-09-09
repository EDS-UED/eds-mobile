import { View, type ViewProps } from 'react-native';
import type { EgIconSuspiciousDollarProps } from './EgIconSuspiciousDollar.types';

/** RN implementation — eds-suspicious-dollar (component) */
export function EgIconSuspiciousDollar(props: EgIconSuspiciousDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-suspicious-dollar' } style={style} accessibilityLabel="eds-suspicious-dollar" />;
}
