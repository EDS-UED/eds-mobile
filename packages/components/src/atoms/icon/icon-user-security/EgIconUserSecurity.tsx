import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserSecurityProps } from './EgIconUserSecurity.types.js';

/** RN icon — eds-user-security */
export function EgIconUserSecurity(props: EgIconUserSecurityProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-security"
      testID={testID ?? 'icon-eds-user-security'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-security"}
    />
  );
}
