import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconCloseCircleFillProps } from './EgIconCloseCircleFill.types.js';

/** RN icon — eds-close-circle-fill */
export function EgIconCloseCircleFill(props: EgIconCloseCircleFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-close-circle-fill"
      testID={testID ?? 'icon-eds-close-circle-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-close-circle-fill"}
    />
  );
}
