import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconWarningFillProps } from './EgIconWarningFill.types.js';

/** RN icon — eds-warning-fill */
export function EgIconWarningFill(props: EgIconWarningFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-warning-fill"
      testID={testID ?? 'icon-eds-warning-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-warning-fill"}
    />
  );
}
