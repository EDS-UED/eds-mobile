import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconSearchProps } from './EgIconSearch.types.js';

/** RN icon — eds-search */
export function EgIconSearch(props: EgIconSearchProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-search"
      testID={testID ?? 'icon-eds-search'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-search"}
    />
  );
}
