import { View, type ViewProps } from 'react-native';
import type { EgIconNoticeProps } from './EgIconNotice.types';

/** RN implementation — eds-notice (component) */
export function EgIconNotice(props: EgIconNoticeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-notice' } style={style} accessibilityLabel="eds-notice" />;
}
