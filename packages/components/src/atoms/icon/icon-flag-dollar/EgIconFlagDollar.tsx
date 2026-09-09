import { View, type ViewProps } from 'react-native';
import type { EgIconFlagDollarProps } from './EgIconFlagDollar.types';

/** RN implementation — eds-flag-dollar (component) */
export function EgIconFlagDollar(props: EgIconFlagDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-flag-dollar' } style={style} accessibilityLabel="eds-flag-dollar" />;
}
