import { View, type ViewProps } from 'react-native';
import type { EgTitleComboBodyProps } from './EgTitleComboBody.types';

/** RN implementation — Title Combo/4-Body (set · 3 variants) */
export function EgTitleComboBody(props: EgTitleComboBodyProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'title-combo-body' } style={style} accessibilityLabel="Title Combo/4-Body" />;
}
