import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAddCircleProps } from './EgIconAddCircle.types.js';

/** RN icon — eds-add-circle */
export function EgIconAddCircle(props: EgIconAddCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-add-circle"
      testID={testID ?? 'icon-eds-add-circle'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-add-circle"}
    />
  );
}
