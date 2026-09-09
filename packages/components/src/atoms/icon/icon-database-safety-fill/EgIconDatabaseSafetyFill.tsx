import { View, type ViewProps } from 'react-native';
import type { EgIconDatabaseSafetyFillProps } from './EgIconDatabaseSafetyFill.types';

/** RN implementation — eds-database-safety-fill (component) */
export function EgIconDatabaseSafetyFill(props: EgIconDatabaseSafetyFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-database-safety-fill' } style={style} accessibilityLabel="eds-database-safety-fill" />;
}
