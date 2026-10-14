import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDatabaseSafetyFillProps } from './EgIconDatabaseSafetyFill.types.js';

/** RN icon — eds-database-safety-fill */
export function EgIconDatabaseSafetyFill(props: EgIconDatabaseSafetyFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-database-safety-fill"
      testID={testID ?? 'icon-eds-database-safety-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-database-safety-fill"}
    />
  );
}
