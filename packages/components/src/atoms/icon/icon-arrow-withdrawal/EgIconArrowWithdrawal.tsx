import { View, type ViewProps } from 'react-native';
import type { EgIconArrowWithdrawalProps } from './EgIconArrowWithdrawal.types';

/** RN implementation — eds-arrow-withdrawal (component) */
export function EgIconArrowWithdrawal(props: EgIconArrowWithdrawalProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-withdrawal' } style={style} accessibilityLabel="eds-arrow-withdrawal" />;
}
