import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconFloderFavoriteFillProps } from './EgIconFloderFavoriteFill.types.js';

/** RN icon — eds-floder-favorite-fill */
export function EgIconFloderFavoriteFill(props: EgIconFloderFavoriteFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-floder-favorite-fill"
      testID={testID ?? 'icon-eds-floder-favorite-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-floder-favorite-fill"}
    />
  );
}
