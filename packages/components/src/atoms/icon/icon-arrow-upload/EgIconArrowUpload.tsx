import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconArrowUploadProps } from './EgIconArrowUpload.types.js';

/** RN icon — eds-arrow-upload */
export function EgIconArrowUpload(props: EgIconArrowUploadProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-arrow-upload"
      testID={testID ?? 'icon-eds-arrow-upload'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-arrow-upload"}
    />
  );
}
