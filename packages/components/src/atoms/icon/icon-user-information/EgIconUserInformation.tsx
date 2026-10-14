import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserInformationProps } from './EgIconUserInformation.types.js';

/** RN icon — eds-user-information */
export function EgIconUserInformation(props: EgIconUserInformationProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-information"
      testID={testID ?? 'icon-eds-user-information'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-information"}
    />
  );
}
