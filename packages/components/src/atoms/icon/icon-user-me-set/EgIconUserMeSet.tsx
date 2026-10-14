import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserMeSetProps } from './EgIconUserMeSet.types.js';

/** RN icon — cds-user-me-set */
export function EgIconUserMeSet(props: EgIconUserMeSetProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="cds-user-me-set"
      testID={testID ?? 'icon-cds-user-me-set'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "cds-user-me-set"}
    />
  );
}
