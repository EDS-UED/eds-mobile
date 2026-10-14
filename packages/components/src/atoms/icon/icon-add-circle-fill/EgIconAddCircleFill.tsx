import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAddCircleFillProps } from './EgIconAddCircleFill.types.js';

/** RN icon — eds-add-circle-fill */
export function EgIconAddCircleFill(props: EgIconAddCircleFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-add-circle-fill"
      testID={testID ?? 'icon-eds-add-circle-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-add-circle-fill"}
    />
  );
}
