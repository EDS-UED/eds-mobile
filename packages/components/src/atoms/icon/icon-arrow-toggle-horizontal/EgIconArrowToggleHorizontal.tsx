import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowToggleHorizontalProps } from './EgIconArrowToggleHorizontal.types.js';

/** RN icon — eds-arrow-toggle-horizontal */
export function EgIconArrowToggleHorizontal(props: EgIconArrowToggleHorizontalProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-toggle-horizontal"
      testID={testID ?? 'icon-eds-arrow-toggle-horizontal'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-toggle-horizontal"}
    />
  );
}
