import { View, type ViewProps } from 'react-native';
import type { EgNotesPopoverProps } from './EgNotesPopover.types';

/** RN implementation — Notes (set · 8 variants) */
export function EgNotesPopover(props: EgNotesPopoverProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'popovers-notes' } style={style} accessibilityLabel="Notes" />;
}
