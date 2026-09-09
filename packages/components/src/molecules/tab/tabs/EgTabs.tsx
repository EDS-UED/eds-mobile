import { View, type ViewProps } from 'react-native';
import type { EgTabsProps } from './EgTabs.types';

/** RN implementation — Tabs (component) */
export function EgTabs(props: EgTabsProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-tabs' } style={style} accessibilityLabel="Tabs" />;
}
