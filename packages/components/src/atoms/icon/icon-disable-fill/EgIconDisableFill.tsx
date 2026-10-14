import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDisableFillProps } from './EgIconDisableFill.types.js';

/** RN icon — eds-disable-fill */
export function EgIconDisableFill(props: EgIconDisableFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-disable-fill"
      testID={testID ?? 'icon-eds-disable-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-disable-fill"}
    />
  );
}
