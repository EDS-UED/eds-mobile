import { View, type ViewProps } from 'react-native';
import type { EgIconOvalTickMiniProps } from './EgIconOvalTickMini.types';

/** RN implementation — oval-tick-mini (component) */
export function EgIconOvalTickMini(props: EgIconOvalTickMiniProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-oval-tick-mini' } style={style} accessibilityLabel="oval-tick-mini" />;
}
