import { View, type ViewProps } from 'react-native';
import type { EgIconSocialMediaProps } from './EgIconSocialMedia.types';

/** RN implementation — eds-social-media (component) */
export function EgIconSocialMedia(props: EgIconSocialMediaProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-social-media' } style={style} accessibilityLabel="eds-social-media" />;
}
