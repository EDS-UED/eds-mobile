import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCircleProps } from './EgIconCircle.types.js';

/** RN icon — eds-circle */
export function EgIconCircle(props: EgIconCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-circle"
      testID={testID ?? 'icon-eds-circle'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-circle"}
    />
  );
}
