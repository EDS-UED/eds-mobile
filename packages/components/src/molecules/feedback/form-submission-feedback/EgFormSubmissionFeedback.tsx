import { View, type ViewProps } from 'react-native';
import type { EgFormSubmissionFeedbackProps } from './EgFormSubmissionFeedback.types';

/** RN implementation — Form Submission (set · 2 variants) */
export function EgFormSubmissionFeedback(props: EgFormSubmissionFeedbackProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-form-submission' } style={style} accessibilityLabel="Form Submission" />;
}
