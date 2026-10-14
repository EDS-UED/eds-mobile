import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAddProps } from './EgIconAdd.types.js';

/** RN icon — eds-add */
export function EgIconAdd(props: EgIconAddProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-add"
      testID={testID ?? 'icon-eds-add'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-add"}
    />
  );
}
