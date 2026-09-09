import { View, type ViewProps } from 'react-native';
import type { EgIconNoticeFillProps } from './EgIconNoticeFill.types';

/** RN implementation — eds-notice-fill (component) */
export function EgIconNoticeFill(props: EgIconNoticeFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-notice-fill' } style={style} accessibilityLabel="eds-notice-fill" />;
}
