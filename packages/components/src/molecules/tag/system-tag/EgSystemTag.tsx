import { View, type ViewProps } from 'react-native';
import type { EgSystemTagProps } from './EgSystemTag.types';

/** RN implementation — System (set · 15 variants) */
export function EgSystemTag(props: EgSystemTagProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tag-system' } style={style} accessibilityLabel="System" />;
}
