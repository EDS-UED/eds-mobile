import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconEyeProps } from './EgIconEye.types.js';

/** RN icon — eds-eye */
export function EgIconEye(props: EgIconEyeProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-eye"
      testID={testID ?? 'icon-eds-eye'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-eye"}
    />
  );
}
