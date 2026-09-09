import { View, type ViewProps } from 'react-native';
import type { EgTextTitleProps } from './EgTextTitle.types';

/** RN implementation — 3-Title (set · 3 variants) */
export function EgTextTitle(props: EgTextTitleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-title' } style={style} accessibilityLabel="3-Title" />;
}
