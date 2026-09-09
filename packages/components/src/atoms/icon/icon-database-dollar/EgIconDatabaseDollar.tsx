import { View, type ViewProps } from 'react-native';
import type { EgIconDatabaseDollarProps } from './EgIconDatabaseDollar.types';

/** RN implementation — eds-database-dollar (component) */
export function EgIconDatabaseDollar(props: EgIconDatabaseDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-database-dollar' } style={style} accessibilityLabel="eds-database-dollar" />;
}
