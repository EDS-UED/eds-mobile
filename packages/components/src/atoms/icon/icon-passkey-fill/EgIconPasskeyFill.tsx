import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconPasskeyFillProps } from './EgIconPasskeyFill.types.js';

/** RN icon — eds-passkey-fill */
export function EgIconPasskeyFill(props: EgIconPasskeyFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-passkey-fill"
      testID={testID ?? 'icon-eds-passkey-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-passkey-fill"}
    />
  );
}
