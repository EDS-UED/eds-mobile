import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowIntegratedSortMiniProps } from './EgIconArrowIntegratedSortMini.types.js';

/** RN icon — eds-arrow-integrated-sort-mini */
export function EgIconArrowIntegratedSortMini(props: EgIconArrowIntegratedSortMiniProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-integrated-sort-mini"
      testID={testID ?? 'icon-eds-arrow-integrated-sort-mini'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-integrated-sort-mini"}
    />
  );
}
