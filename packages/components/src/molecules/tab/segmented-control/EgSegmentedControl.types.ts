import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '../../../theme/index.js';
import type { EgSegmentedControlSize } from '../_shared/egSegmentedControlMetrics.js';

export type EgSegmentedControlSegment = {
  id: string;
  label: string;
  disabled?: boolean;
};

/** Figma: Segmented Control · 493:4341 · 切换时 face 胶囊滑动。 */
export type EgSegmentedControlProps = {
  segments: readonly (string | EgSegmentedControlSegment)[];
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelect?: (index: number, segment: EgSegmentedControlSegment) => void;
  size?: EgSegmentedControlSize;
  mode?: ThemeMode;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function normalizeEgSegmentedControlSegments(
  segments: EgSegmentedControlProps['segments'],
): EgSegmentedControlSegment[] {
  return segments.map((entry, index) => {
    if (typeof entry === 'string') {
      return { id: String(index), label: entry };
    }
    return entry;
  });
}
