import { View, type ViewProps } from 'react-native';
import type { EgIconListLatticeMobileProps } from './EgIconListLatticeMobile.types';

/** RN implementation — eds-list-lattice-mobile (component) */
export function EgIconListLatticeMobile(props: EgIconListLatticeMobileProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-list-lattice-mobile' } style={style} accessibilityLabel="eds-list-lattice-mobile" />;
}
