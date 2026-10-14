import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconStampProps } from './EgIconStamp.types.js';

/** RN icon — eds-stamp */
export function EgIconStamp(props: EgIconStampProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-stamp"
      testID={testID ?? 'icon-eds-stamp'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-stamp"}
    />
  );
}
