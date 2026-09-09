import { View, type ViewProps } from 'react-native';
import type { EgTextBarProps } from './EgTextBar.types';

/** RN implementation — 7-Bar (set · 6 variants) */
export function EgTextBar(props: EgTextBarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-bar' } style={style} accessibilityLabel="7-Bar" />;
}
