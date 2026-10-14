import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAddEmployerFillProps } from './EgIconAddEmployerFill.types.js';

/** RN icon — eds-add-employer-fill */
export function EgIconAddEmployerFill(props: EgIconAddEmployerFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-add-employer-fill"
      testID={testID ?? 'icon-eds-add-employer-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-add-employer-fill"}
    />
  );
}
