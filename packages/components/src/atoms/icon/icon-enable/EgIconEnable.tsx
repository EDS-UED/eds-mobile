import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconEnableProps } from './EgIconEnable.types.js';

/** RN icon — eds-enable */
export function EgIconEnable(props: EgIconEnableProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-enable"
      testID={testID ?? 'icon-eds-enable'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-enable"}
    />
  );
}
