import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowLaunchSquareProps } from './EgIconArrowLaunchSquare.types.js';

/** RN icon — eds-arrow-launch-square */
export function EgIconArrowLaunchSquare(props: EgIconArrowLaunchSquareProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-launch-square"
      testID={testID ?? 'icon-eds-arrow-launch-square'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-launch-square"}
    />
  );
}
