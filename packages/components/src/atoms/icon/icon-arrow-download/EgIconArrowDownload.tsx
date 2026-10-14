import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowDownloadProps } from './EgIconArrowDownload.types.js';

/** RN icon — eds-arrow-download */
export function EgIconArrowDownload(props: EgIconArrowDownloadProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-download"
      testID={testID ?? 'icon-eds-arrow-download'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-download"}
    />
  );
}
