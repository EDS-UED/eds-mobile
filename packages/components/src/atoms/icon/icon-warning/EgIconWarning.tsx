import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconWarningProps } from './EgIconWarning.types.js';

/** RN icon — eds-warning */
export function EgIconWarning(props: EgIconWarningProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-warning"
      testID={testID ?? 'icon-eds-warning'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-warning"}
    />
  );
}
