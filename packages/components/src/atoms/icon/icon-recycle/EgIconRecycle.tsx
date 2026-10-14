import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconRecycleProps } from './EgIconRecycle.types.js';

/** RN icon — eds-recycle */
export function EgIconRecycle(props: EgIconRecycleProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-recycle"
      testID={testID ?? 'icon-eds-recycle'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-recycle"}
    />
  );
}
