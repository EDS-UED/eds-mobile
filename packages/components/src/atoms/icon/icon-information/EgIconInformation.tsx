import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconInformationProps } from './EgIconInformation.types.js';

/** RN icon — eds-information */
export function EgIconInformation(props: EgIconInformationProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-information"
      testID={testID ?? 'icon-eds-information'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-information"}
    />
  );
}
