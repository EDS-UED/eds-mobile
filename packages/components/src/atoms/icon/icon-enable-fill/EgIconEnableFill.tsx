import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconEnableFillProps } from './EgIconEnableFill.types.js';

/** RN icon — eds-enable-fill */
export function EgIconEnableFill(props: EgIconEnableFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-enable-fill"
      testID={testID ?? 'icon-eds-enable-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-enable-fill"}
    />
  );
}
