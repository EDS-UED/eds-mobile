import { View, type ViewProps } from 'react-native';
import type { EgStatusCardFeedbackProps } from './EgStatusCardFeedback.types';

/** RN implementation — Status Card (set · 2 variants) */
export function EgStatusCardFeedback(props: EgStatusCardFeedbackProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-status-card' } style={style} accessibilityLabel="Status Card" />;
}
