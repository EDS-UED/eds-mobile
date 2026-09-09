import { View, type ViewProps } from 'react-native';
import type { EgSearchInputProps } from './EgSearchInput.types';

/** RN implementation — Search (set · 4 variants) */
export function EgSearchInput(props: EgSearchInputProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-search' } style={style} accessibilityLabel="Search" />;
}
