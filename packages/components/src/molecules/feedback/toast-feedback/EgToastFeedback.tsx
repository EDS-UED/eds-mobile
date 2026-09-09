import { View, type ViewProps } from 'react-native';
import type { EgToastFeedbackProps } from './EgToastFeedback.types';

/** RN implementation — Toast (set · 2 variants) */
export function EgToastFeedback(props: EgToastFeedbackProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-toast' } style={style} accessibilityLabel="Toast" />;
}
