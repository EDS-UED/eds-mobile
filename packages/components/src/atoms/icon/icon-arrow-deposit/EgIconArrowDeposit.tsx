import { View, type ViewProps } from 'react-native';
import type { EgIconArrowDepositProps } from './EgIconArrowDeposit.types';

/** RN implementation — eds-arrow-deposit (component) */
export function EgIconArrowDeposit(props: EgIconArrowDepositProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-deposit' } style={style} accessibilityLabel="eds-arrow-deposit" />;
}
