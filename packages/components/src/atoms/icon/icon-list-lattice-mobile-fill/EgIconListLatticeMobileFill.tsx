import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconListLatticeMobileFillProps } from './EgIconListLatticeMobileFill.types.js';

/** RN icon — eds-list-lattice-mobile-fill */
export function EgIconListLatticeMobileFill(props: EgIconListLatticeMobileFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-list-lattice-mobile-fill"
      testID={testID ?? 'icon-eds-list-lattice-mobile-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-list-lattice-mobile-fill"}
    />
  );
}
