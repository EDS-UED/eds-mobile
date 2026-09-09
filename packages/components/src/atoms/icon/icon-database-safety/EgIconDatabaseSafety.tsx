import { View, type ViewProps } from 'react-native';
import type { EgIconDatabaseSafetyProps } from './EgIconDatabaseSafety.types';

/** RN implementation — eds-database-safety (component) */
export function EgIconDatabaseSafety(props: EgIconDatabaseSafetyProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-database-safety' } style={style} accessibilityLabel="eds-database-safety" />;
}
