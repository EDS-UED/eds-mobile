import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserNotificationProps } from './EgIconUserNotification.types.js';

/** RN icon — eds-user-notification */
export function EgIconUserNotification(props: EgIconUserNotificationProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-notification"
      testID={testID ?? 'icon-eds-user-notification'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-notification"}
    />
  );
}
