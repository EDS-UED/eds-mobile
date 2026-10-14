import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserCheckValidateProps } from './EgIconUserCheckValidate.types.js';

/** RN icon — eds-user-check-validate */
export function EgIconUserCheckValidate(props: EgIconUserCheckValidateProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-check-validate"
      testID={testID ?? 'icon-eds-user-check-validate'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-check-validate"}
    />
  );
}
