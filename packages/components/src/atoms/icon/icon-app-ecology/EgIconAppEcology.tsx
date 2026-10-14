import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAppEcologyProps } from './EgIconAppEcology.types.js';

/** RN icon — eds-app-ecology */
export function EgIconAppEcology(props: EgIconAppEcologyProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-app-ecology"
      testID={testID ?? 'icon-eds-app-ecology'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-app-ecology"}
    />
  );
}
