import { View, type ViewProps } from 'react-native';
import type { EgIconArrowDownloadProps } from './EgIconArrowDownload.types';

/** RN implementation — eds-arrow-download (component) */
export function EgIconArrowDownload(props: EgIconArrowDownloadProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-download' } style={style} accessibilityLabel="eds-arrow-download" />;
}
