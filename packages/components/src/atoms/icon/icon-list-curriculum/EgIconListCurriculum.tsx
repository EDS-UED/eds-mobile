import { View, type ViewProps } from 'react-native';
import type { EgIconListCurriculumProps } from './EgIconListCurriculum.types';

/** RN implementation — eds-list-curriculum (component) */
export function EgIconListCurriculum(props: EgIconListCurriculumProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-list-curriculum' } style={style} accessibilityLabel="eds-list-curriculum" />;
}
