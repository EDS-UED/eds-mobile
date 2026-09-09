import { View, type ViewProps } from 'react-native';
import type { EgIconUserMeSetProps } from './EgIconUserMeSet.types';

/** RN implementation — cds-user-me-set (component) */
export function EgIconUserMeSet(props: EgIconUserMeSetProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-cds-user-me-set' } style={style} accessibilityLabel="cds-user-me-set" />;
}
