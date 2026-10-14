import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUneyeProps } from './EgIconUneye.types.js';

/** RN icon — eds-uneye */
export function EgIconUneye(props: EgIconUneyeProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-uneye"
      testID={testID ?? 'icon-eds-uneye'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-uneye"}
    />
  );
}
