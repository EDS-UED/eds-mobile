import { View, type ViewProps } from 'react-native';
import type { EgStatusCardProps } from './EgStatusCard.types.js';

/** RN implementation — Status Card (set · 2 variants) */
export function EgStatusCard(props: EgStatusCardProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-status-card' } style={style} accessibilityLabel="Status Card" />;
}
