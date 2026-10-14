import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowExportProps } from './EgIconArrowExport.types.js';

/** RN icon — eds-arrow-export */
export function EgIconArrowExport(props: EgIconArrowExportProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-export"
      testID={testID ?? 'icon-eds-arrow-export'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-export"}
    />
  );
}
