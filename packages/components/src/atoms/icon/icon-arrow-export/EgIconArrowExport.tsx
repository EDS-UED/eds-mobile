import { View, type ViewProps } from 'react-native';
import type { EgIconArrowExportProps } from './EgIconArrowExport.types';

/** RN implementation — eds-arrow-export (component) */
export function EgIconArrowExport(props: EgIconArrowExportProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-export' } style={style} accessibilityLabel="eds-arrow-export" />;
}
