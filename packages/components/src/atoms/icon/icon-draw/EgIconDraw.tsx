import { View, type ViewProps } from 'react-native';
import type { EgIconDrawProps } from './EgIconDraw.types';

/** RN implementation — iCon_Draw (set · 5 variants) */
export function EgIconDraw(props: EgIconDrawProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-draw' } style={style} accessibilityLabel="iCon_Draw" />;
}
