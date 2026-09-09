import { View, type ViewProps } from 'react-native';
import type { EgIconIConDrawType6Props } from './EgIconIConDrawType6.types';

/** RN implementation — iCon_Draw/Type6 (component) */
export function EgIconIConDrawType6(props: EgIconIConDrawType6Props & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-icon-draw-type6' } style={style} accessibilityLabel="iCon_Draw/Type6" />;
}
