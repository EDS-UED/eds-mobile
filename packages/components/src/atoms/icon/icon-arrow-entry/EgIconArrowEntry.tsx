import { View, type ViewProps } from 'react-native';
import type { EgIconArrowEntryProps } from './EgIconArrowEntry.types';

/** RN implementation — eds-arrow-entry (component) */
export function EgIconArrowEntry(props: EgIconArrowEntryProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-entry' } style={style} accessibilityLabel="eds-arrow-entry" />;
}
