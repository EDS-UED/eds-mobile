import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconListLatticeMobileProps } from './EgIconListLatticeMobile.types.js';

/** RN icon — eds-list-lattice-mobile */
export function EgIconListLatticeMobile(props: EgIconListLatticeMobileProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-list-lattice-mobile"
      testID={testID ?? 'icon-eds-list-lattice-mobile'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-list-lattice-mobile"}
    />
  );
}
