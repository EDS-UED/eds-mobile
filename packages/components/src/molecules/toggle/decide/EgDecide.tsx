import { View, type ViewProps } from 'react-native';
import type { EgDecideProps } from './EgDecide.types';

/** RN implementation — Decide (set · 2 variants) */
export function EgDecide(props: EgDecideProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'toggle-decide' } style={style} accessibilityLabel="Decide" />;
}
