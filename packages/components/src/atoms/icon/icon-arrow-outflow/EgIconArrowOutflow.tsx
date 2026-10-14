import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowOutflowProps } from './EgIconArrowOutflow.types.js';

/** RN icon — eds-arrow-outflow */
export function EgIconArrowOutflow(props: EgIconArrowOutflowProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-outflow"
      testID={testID ?? 'icon-eds-arrow-outflow'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-outflow"}
    />
  );
}
