import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconScanCodeProps } from './EgIconScanCode.types.js';

/** RN icon — eds-scan-code */
export function EgIconScanCode(props: EgIconScanCodeProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-scan-code"
      testID={testID ?? 'icon-eds-scan-code'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-scan-code"}
    />
  );
}
