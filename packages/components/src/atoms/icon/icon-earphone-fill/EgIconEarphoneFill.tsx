import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconEarphoneFillProps } from './EgIconEarphoneFill.types.js';

/** RN icon — eds-earphone-fill */
export function EgIconEarphoneFill(props: EgIconEarphoneFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-earphone-fill"
      testID={testID ?? 'icon-eds-earphone-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-earphone-fill"}
    />
  );
}
