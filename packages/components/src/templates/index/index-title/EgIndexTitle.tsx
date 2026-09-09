import { View, type ViewProps } from 'react-native';
import type { EgIndexTitleProps } from './EgIndexTitle.types';

/** RN implementation — Title (component) */
export function EgIndexTitle(props: EgIndexTitleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'index-title' } style={style} accessibilityLabel="Title" />;
}
