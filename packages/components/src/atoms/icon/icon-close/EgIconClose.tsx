import { View, type ViewProps } from 'react-native';
import type { EgIconCloseProps } from './EgIconClose.types';

/** RN implementation — eds-close (component) */
export function EgIconClose(props: EgIconCloseProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-close' } style={style} accessibilityLabel="eds-close" />;
}
