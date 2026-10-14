import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconAddRoleProps } from './EgIconAddRole.types.js';

/** RN icon — eds-add-role */
export function EgIconAddRole(props: EgIconAddRoleProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-add-role"
      testID={testID ?? 'icon-eds-add-role'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-add-role"}
    />
  );
}
