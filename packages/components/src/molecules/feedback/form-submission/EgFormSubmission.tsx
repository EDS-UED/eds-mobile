import { View, type ViewProps } from 'react-native';
import type { EgFormSubmissionProps } from './EgFormSubmission.types.js';

/** RN implementation — Form Submission (set · 2 variants) */
export function EgFormSubmission(props: EgFormSubmissionProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-form-submission' } style={style} accessibilityLabel="Form Submission" />;
}
