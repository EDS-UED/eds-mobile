import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDatabaseSafetyProps } from './EgIconDatabaseSafety.types.js';

/** RN icon — eds-database-safety */
export function EgIconDatabaseSafety(props: EgIconDatabaseSafetyProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-database-safety"
      testID={testID ?? 'icon-eds-database-safety'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-database-safety"}
    />
  );
}
