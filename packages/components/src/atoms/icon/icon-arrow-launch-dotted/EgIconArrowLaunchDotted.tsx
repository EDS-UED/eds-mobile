import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowLaunchDottedProps } from './EgIconArrowLaunchDotted.types.js';

/** RN icon — eds-arrow-launch-dotted */
export function EgIconArrowLaunchDotted(props: EgIconArrowLaunchDottedProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-launch-dotted"
      testID={testID ?? 'icon-eds-arrow-launch-dotted'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-launch-dotted"}
    />
  );
}
