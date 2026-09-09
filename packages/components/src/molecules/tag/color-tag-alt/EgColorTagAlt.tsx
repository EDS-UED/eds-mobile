import { View, type ViewProps } from 'react-native';
import type { EgColorTagAltProps } from './EgColorTagAlt.types';

/** RN implementation — Color (set · 24 variants) */
export function EgColorTagAlt(props: EgColorTagAltProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tag-color-alt' } style={style} accessibilityLabel="Color" />;
}
