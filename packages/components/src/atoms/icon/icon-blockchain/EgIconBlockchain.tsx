import { View, type ViewProps } from 'react-native';
import type { EgIconBlockchainProps } from './EgIconBlockchain.types';

/** RN implementation — eds-blockchain (component) */
export function EgIconBlockchain(props: EgIconBlockchainProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-blockchain' } style={style} accessibilityLabel="eds-blockchain" />;
}
