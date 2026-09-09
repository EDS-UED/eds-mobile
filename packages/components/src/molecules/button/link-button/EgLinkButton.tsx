import { View, type ViewProps } from 'react-native';
import type { EgLinkButtonProps } from './EgLinkButton.types';

/** RN implementation — Link (set · 9 variants) */
export function EgLinkButton(props: EgLinkButtonProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'button-link' } style={style} accessibilityLabel="Link" />;
}
