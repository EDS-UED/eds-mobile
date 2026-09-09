import { View, type ViewProps } from 'react-native';
import type { EgIconScanCodeProps } from './EgIconScanCode.types';

/** RN implementation — eds-scan-code (component) */
export function EgIconScanCode(props: EgIconScanCodeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-scan-code' } style={style} accessibilityLabel="eds-scan-code" />;
}
