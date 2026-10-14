import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconDatabaseDollarProps } from './EgIconDatabaseDollar.types.js';

/** RN icon — eds-database-dollar */
export function EgIconDatabaseDollar(props: EgIconDatabaseDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-database-dollar"
      testID={testID ?? 'icon-eds-database-dollar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-database-dollar"}
    />
  );
}
