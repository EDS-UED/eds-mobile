import { View, type ViewProps } from 'react-native';
import type { EgTextBodyProps } from './EgTextBody.types';

/** RN implementation — 4-Body (set · 18 variants) */
export function EgTextBody(props: EgTextBodyProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-body' } style={style} accessibilityLabel="4-Body" />;
}
