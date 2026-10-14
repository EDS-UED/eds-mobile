import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconSocialMediaProps } from './EgIconSocialMedia.types.js';

/** RN icon — eds-social-media */
export function EgIconSocialMedia(props: EgIconSocialMediaProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-social-media"
      testID={testID ?? 'icon-eds-social-media'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-social-media"}
    />
  );
}
