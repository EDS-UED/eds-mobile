import { View, type ViewProps } from 'react-native';
import type { EgToastProps } from './EgToast.types.js';

/** RN implementation — Toast (set · 2 variants) */
export function EgToast(props: EgToastProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-toast' } style={style} accessibilityLabel="Toast" />;
}
