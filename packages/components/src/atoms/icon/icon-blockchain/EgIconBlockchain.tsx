import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconBlockchainProps } from './EgIconBlockchain.types.js';

/** RN icon — eds-blockchain */
export function EgIconBlockchain(props: EgIconBlockchainProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-blockchain"
      testID={testID ?? 'icon-eds-blockchain'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-blockchain"}
    />
  );
}
