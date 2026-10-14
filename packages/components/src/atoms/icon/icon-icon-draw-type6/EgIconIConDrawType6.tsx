import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconIConDrawType6Props } from './EgIconIConDrawType6.types.js';

/** RN icon — iCon_Draw/Type6 */
export function EgIconIConDrawType6(props: EgIconIConDrawType6Props & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="iCon_Draw/Type6"
      testID={testID ?? 'icon-icon-draw-type6'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "iCon_Draw/Type6"}
    />
  );
}
