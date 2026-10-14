import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowIntegratedSortProps } from './EgIconArrowIntegratedSort.types.js';

/** RN icon — eds-arrow-integrated-sort */
export function EgIconArrowIntegratedSort(props: EgIconArrowIntegratedSortProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-integrated-sort"
      testID={testID ?? 'icon-eds-arrow-integrated-sort'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-integrated-sort"}
    />
  );
}
