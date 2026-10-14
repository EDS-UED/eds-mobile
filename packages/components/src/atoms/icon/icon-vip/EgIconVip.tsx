import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconVipProps } from './EgIconVip.types.js';

/** RN icon — eds-vip */
export function EgIconVip(props: EgIconVipProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-vip"
      testID={testID ?? 'icon-eds-vip'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-vip"}
    />
  );
}
