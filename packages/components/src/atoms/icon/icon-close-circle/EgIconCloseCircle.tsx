import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCloseCircleProps } from './EgIconCloseCircle.types.js';

/** RN icon — eds-close-circle */
export function EgIconCloseCircle(props: EgIconCloseCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-close-circle"
      testID={testID ?? 'icon-eds-close-circle'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-close-circle"}
    />
  );
}
