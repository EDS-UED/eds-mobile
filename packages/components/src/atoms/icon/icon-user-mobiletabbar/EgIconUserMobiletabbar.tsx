import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserMobiletabbarProps } from './EgIconUserMobiletabbar.types.js';

/** RN icon — eds-user-mobiletabbar */
export function EgIconUserMobiletabbar(props: EgIconUserMobiletabbarProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-mobiletabbar"
      testID={testID ?? 'icon-eds-user-mobiletabbar'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-mobiletabbar"}
    />
  );
}
