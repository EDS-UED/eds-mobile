import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconNoticeFillProps } from './EgIconNoticeFill.types.js';

/** RN icon — eds-notice-fill */
export function EgIconNoticeFill(props: EgIconNoticeFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-notice-fill"
      testID={testID ?? 'icon-eds-notice-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-notice-fill"}
    />
  );
}
