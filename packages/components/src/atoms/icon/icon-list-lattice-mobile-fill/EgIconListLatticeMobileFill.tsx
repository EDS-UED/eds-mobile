import { View, type ViewProps } from 'react-native';
import type { EgIconListLatticeMobileFillProps } from './EgIconListLatticeMobileFill.types';

/** RN implementation — eds-list-lattice-mobile-fill (component) */
export function EgIconListLatticeMobileFill(props: EgIconListLatticeMobileFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-list-lattice-mobile-fill' } style={style} accessibilityLabel="eds-list-lattice-mobile-fill" />;
}
