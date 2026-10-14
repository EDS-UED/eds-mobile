import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowObliqueProps } from './EgIconArrowOblique.types.js';

/** RN icon — eds-arrow-oblique */
export function EgIconArrowOblique(props: EgIconArrowObliqueProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-oblique"
      testID={testID ?? 'icon-eds-arrow-oblique'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-oblique"}
    />
  );
}
