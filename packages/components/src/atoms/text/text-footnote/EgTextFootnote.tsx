import { View, type ViewProps } from 'react-native';
import type { EgTextFootnoteProps } from './EgTextFootnote.types';

/** RN implementation — 6-Footnote (set · 6 variants) */
export function EgTextFootnote(props: EgTextFootnoteProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-footnote' } style={style} accessibilityLabel="6-Footnote" />;
}
