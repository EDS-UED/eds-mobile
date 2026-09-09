import { View, type ViewProps } from 'react-native';
import type { EgIconTeamProps } from './EgIconTeam.types';

/** RN implementation — eds-team (component) */
export function EgIconTeam(props: EgIconTeamProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-team' } style={style} accessibilityLabel="eds-team" />;
}
