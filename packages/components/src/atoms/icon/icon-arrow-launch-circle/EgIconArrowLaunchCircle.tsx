import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowLaunchCircleProps } from './EgIconArrowLaunchCircle.types.js';

/** RN icon — eds-arrow-launch-circle */
export function EgIconArrowLaunchCircle(props: EgIconArrowLaunchCircleProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-launch-circle"
      testID={testID ?? 'icon-eds-arrow-launch-circle'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-launch-circle"}
    />
  );
}
