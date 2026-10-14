import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowEntryProps } from './EgIconArrowEntry.types.js';

/** RN icon — eds-arrow-entry */
export function EgIconArrowEntry(props: EgIconArrowEntryProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-entry"
      testID={testID ?? 'icon-eds-arrow-entry'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-entry"}
    />
  );
}
