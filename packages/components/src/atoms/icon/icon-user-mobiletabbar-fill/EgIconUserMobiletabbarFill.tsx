import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserMobiletabbarFillProps } from './EgIconUserMobiletabbarFill.types.js';

/** RN icon — eds-user-mobiletabbar-fill */
export function EgIconUserMobiletabbarFill(props: EgIconUserMobiletabbarFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-mobiletabbar-fill"
      testID={testID ?? 'icon-eds-user-mobiletabbar-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-mobiletabbar-fill"}
    />
  );
}
