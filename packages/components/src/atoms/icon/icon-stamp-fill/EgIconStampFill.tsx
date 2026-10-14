import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconStampFillProps } from './EgIconStampFill.types.js';

/** RN icon — eds-stamp-fill */
export function EgIconStampFill(props: EgIconStampFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-stamp-fill"
      testID={testID ?? 'icon-eds-stamp-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-stamp-fill"}
    />
  );
}
