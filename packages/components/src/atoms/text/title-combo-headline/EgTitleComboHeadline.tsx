import { View, type ViewProps } from 'react-native';
import type { EgTitleComboHeadlineProps } from './EgTitleComboHeadline.types';

/** RN implementation — Title Combo/2-Headline (set · 3 variants) */
export function EgTitleComboHeadline(props: EgTitleComboHeadlineProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'title-combo-headline' } style={style} accessibilityLabel="Title Combo/2-Headline" />;
}
