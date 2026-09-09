import { View, type ViewProps } from 'react-native';
import type { EgIconUserNotificationProps } from './EgIconUserNotification.types';

/** RN implementation — eds-user-notification (component) */
export function EgIconUserNotification(props: EgIconUserNotificationProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-notification' } style={style} accessibilityLabel="eds-user-notification" />;
}
