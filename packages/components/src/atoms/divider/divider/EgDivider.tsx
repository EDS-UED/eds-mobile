import { View, type ViewProps } from 'react-native';
import type { EgDividerProps } from './EgDivider.types';

/** RN implementation — Divider (set · 4 variants) */
export function EgDivider(props: EgDividerProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'divider' } style={style} accessibilityLabel="Divider" />;
}
