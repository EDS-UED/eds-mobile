import { View, type ViewProps } from 'react-native';
import type { EgIconStampProps } from './EgIconStamp.types';

/** RN implementation — eds-stamp (component) */
export function EgIconStamp(props: EgIconStampProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-stamp' } style={style} accessibilityLabel="eds-stamp" />;
}
