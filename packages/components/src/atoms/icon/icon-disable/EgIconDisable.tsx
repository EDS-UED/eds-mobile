import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDisableProps } from './EgIconDisable.types.js';

/** RN icon — eds-disable */
export function EgIconDisable(props: EgIconDisableProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-disable"
      testID={testID ?? 'icon-eds-disable'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-disable"}
    />
  );
}
