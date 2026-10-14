import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconReductionProps } from './EgIconReduction.types.js';

/** RN icon — eds-reduction */
export function EgIconReduction(props: EgIconReductionProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-reduction"
      testID={testID ?? 'icon-eds-reduction'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-reduction"}
    />
  );
}
