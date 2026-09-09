import { View, type ViewProps } from 'react-native';
import type { EgIconBriefcaseProps } from './EgIconBriefcase.types';

/** RN implementation — eds-briefcase (component) */
export function EgIconBriefcase(props: EgIconBriefcaseProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-briefcase' } style={style} accessibilityLabel="eds-briefcase" />;
}
