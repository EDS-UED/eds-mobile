import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowWorkflowProps } from './EgIconArrowWorkflow.types.js';

/** RN icon — eds-arrow-workflow */
export function EgIconArrowWorkflow(props: EgIconArrowWorkflowProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-workflow"
      testID={testID ?? 'icon-eds-arrow-workflow'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-workflow"}
    />
  );
}
