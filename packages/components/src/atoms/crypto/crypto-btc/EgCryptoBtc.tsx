import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgCryptoBtcProps } from './EgCryptoBtc.types.js';

/** RN crypto — eds-btc-bitcoin */
export function EgCryptoBtc(props: EgCryptoBtcProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-btc-bitcoin"
      testID={testID ?? 'crypto-btc'}
      size={size}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-btc-bitcoin"}
    />
  );
}
