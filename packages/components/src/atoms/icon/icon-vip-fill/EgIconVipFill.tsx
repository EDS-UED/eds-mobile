import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconVipFillProps } from './EgIconVipFill.types.js';

/** RN icon — eds-vip-fill */
export function EgIconVipFill(props: EgIconVipFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-vip-fill"
      testID={testID ?? 'icon-eds-vip-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-vip-fill"}
    />
  );
}
