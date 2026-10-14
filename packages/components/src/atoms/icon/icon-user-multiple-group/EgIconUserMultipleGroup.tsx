import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconUserMultipleGroupProps } from './EgIconUserMultipleGroup.types.js';

/** RN icon — eds-user-multiple-group */
export function EgIconUserMultipleGroup(props: EgIconUserMultipleGroupProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-user-multiple-group"
      testID={testID ?? 'icon-eds-user-multiple-group'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-user-multiple-group"}
    />
  );
}
