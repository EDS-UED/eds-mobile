import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDrawProps } from './EgIconDraw.types.js';

/** RN icon — iCon_Draw */
export function EgIconDraw(props: EgIconDrawProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="iCon_Draw"
      testID={testID ?? 'icon-draw'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "iCon_Draw"}
    />
  );
}
