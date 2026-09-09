import { View, type ViewProps } from 'react-native';
import type { EgColorTagProps } from './EgColorTag.types';

/** RN implementation — Color (set · 24 variants) */
export function EgColorTag(props: EgColorTagProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tag-color' } style={style} accessibilityLabel="Color" />;
}
