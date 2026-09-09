import { View, type ViewProps } from 'react-native';
import type { EgCryptoBtcProps } from './EgCryptoBtc.types';

/** RN implementation — eds-btc-bitcoin (component) */
export function EgCryptoBtc(props: EgCryptoBtcProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'crypto-btc' } style={style} accessibilityLabel="eds-btc-bitcoin" />;
}
