import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconEarphoneProps } from './EgIconEarphone.types.js';

/** RN icon — eds-earphone */
export function EgIconEarphone(props: EgIconEarphoneProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-earphone"
      testID={testID ?? 'icon-eds-earphone'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-earphone"}
    />
  );
}
