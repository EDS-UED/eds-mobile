import { View, type ViewProps } from 'react-native';
import type { EgIconStampFillProps } from './EgIconStampFill.types';

/** RN implementation — eds-stamp-fill (component) */
export function EgIconStampFill(props: EgIconStampFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-stamp-fill' } style={style} accessibilityLabel="eds-stamp-fill" />;
}
