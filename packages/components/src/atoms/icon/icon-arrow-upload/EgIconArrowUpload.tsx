import { View, type ViewProps } from 'react-native';
import type { EgIconArrowUploadProps } from './EgIconArrowUpload.types';

/** RN implementation — eds-arrow-upload (component) */
export function EgIconArrowUpload(props: EgIconArrowUploadProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-upload' } style={style} accessibilityLabel="eds-arrow-upload" />;
}
