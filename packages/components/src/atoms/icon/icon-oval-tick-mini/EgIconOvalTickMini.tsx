import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconOvalTickMiniProps } from './EgIconOvalTickMini.types.js';

/** RN icon — oval-tick-mini */
export function EgIconOvalTickMini(props: EgIconOvalTickMiniProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="oval-tick-mini"
      testID={testID ?? 'icon-oval-tick-mini'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "oval-tick-mini"}
    />
  );
}
