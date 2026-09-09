import { View, type ViewProps } from 'react-native';
import type { EgSystemTagAltProps } from './EgSystemTagAlt.types';

/** RN implementation — System (set · 15 variants) */
export function EgSystemTagAlt(props: EgSystemTagAltProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tag-system-alt' } style={style} accessibilityLabel="System" />;
}
