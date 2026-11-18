import { View, type ViewProps } from 'react-native';
import type { EgMessageProps } from './EgMessage.types.js';

/** RN implementation — Message (set · 2 variants) */
export function EgMessage(props: EgMessageProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-message' } style={style} accessibilityLabel="Message" />;
}
