import { View, type ViewProps } from 'react-native';
import type { EgIconTeamFillProps } from './EgIconTeamFill.types';

/** RN implementation — eds-team-fill (component) */
export function EgIconTeamFill(props: EgIconTeamFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-team-fill' } style={style} accessibilityLabel="eds-team-fill" />;
}
