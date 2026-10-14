import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAddEmployerProps } from './EgIconAddEmployer.types.js';

/** RN icon — eds-add-employer */
export function EgIconAddEmployer(props: EgIconAddEmployerProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-add-employer"
      testID={testID ?? 'icon-eds-add-employer'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-add-employer"}
    />
  );
}
