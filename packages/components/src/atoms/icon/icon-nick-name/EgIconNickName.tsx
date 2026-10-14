import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconNickNameProps } from './EgIconNickName.types.js';

/** RN icon — eds-nick-name */
export function EgIconNickName(props: EgIconNickNameProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-nick-name"
      testID={testID ?? 'icon-eds-nick-name'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-nick-name"}
    />
  );
}
