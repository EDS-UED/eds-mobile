import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDevelopersCodeProps } from './EgIconDevelopersCode.types.js';

/** RN icon — eds-developers-code */
export function EgIconDevelopersCode(props: EgIconDevelopersCodeProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-developers-code"
      testID={testID ?? 'icon-eds-developers-code'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-developers-code"}
    />
  );
}
