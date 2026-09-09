import { View, type ViewProps } from 'react-native';
import type { EgTitleComboTitleProps } from './EgTitleComboTitle.types';

/** RN implementation — Title Combo/3-Title (set · 3 variants) */
export function EgTitleComboTitle(props: EgTitleComboTitleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'title-combo-title' } style={style} accessibilityLabel="Title Combo/3-Title" />;
}
