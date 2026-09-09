import { View, type ViewProps } from 'react-native';
import type { EgIconDevelopersCodeFillProps } from './EgIconDevelopersCodeFill.types';

/** RN implementation — eds-developers-code-fill (component) */
export function EgIconDevelopersCodeFill(props: EgIconDevelopersCodeFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-developers-code-fill' } style={style} accessibilityLabel="eds-developers-code-fill" />;
}
