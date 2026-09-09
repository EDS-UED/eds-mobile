import { View, type ViewProps } from 'react-native';
import type { EgTextHeadlineProps } from './EgTextHeadline.types';

/** RN implementation — 2-Headline (set · 3 variants) */
export function EgTextHeadline(props: EgTextHeadlineProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-headline' } style={style} accessibilityLabel="2-Headline" />;
}
