import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDevelopersCodeFillProps } from './EgIconDevelopersCodeFill.types.js';

/** RN icon — eds-developers-code-fill */
export function EgIconDevelopersCodeFill(props: EgIconDevelopersCodeFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-developers-code-fill"
      testID={testID ?? 'icon-eds-developers-code-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-developers-code-fill"}
    />
  );
}
