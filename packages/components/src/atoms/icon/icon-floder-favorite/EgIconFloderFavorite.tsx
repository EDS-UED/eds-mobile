import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconFloderFavoriteProps } from './EgIconFloderFavorite.types.js';

/** RN icon — eds-floder-favorite */
export function EgIconFloderFavorite(props: EgIconFloderFavoriteProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-floder-favorite"
      testID={testID ?? 'icon-eds-floder-favorite'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-floder-favorite"}
    />
  );
}
