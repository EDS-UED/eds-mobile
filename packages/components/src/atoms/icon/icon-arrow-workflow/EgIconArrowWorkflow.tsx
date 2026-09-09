import { View, type ViewProps } from 'react-native';
import type { EgIconArrowWorkflowProps } from './EgIconArrowWorkflow.types';

/** RN implementation — eds-arrow-workflow (component) */
export function EgIconArrowWorkflow(props: EgIconArrowWorkflowProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-workflow' } style={style} accessibilityLabel="eds-arrow-workflow" />;
}
