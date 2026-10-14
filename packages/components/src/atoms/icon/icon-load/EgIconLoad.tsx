import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconLoadProps } from './EgIconLoad.types.js';

/** RN icon — eds-load */
export function EgIconLoad(props: EgIconLoadProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-load"
      testID={testID ?? 'icon-eds-load'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-load"}
    />
  );
}
