import { View, type ViewProps } from 'react-native';
import type { EgStreamerProps } from './EgStreamer.types.js';

/** RN implementation — Streamer (set · 2 variants) */
export function EgStreamer(props: EgStreamerProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'feedback-streamer' } style={style} accessibilityLabel="Streamer" />;
}
