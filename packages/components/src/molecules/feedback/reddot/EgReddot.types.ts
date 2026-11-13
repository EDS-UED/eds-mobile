import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '../../../theme/index.js';

export type EgReddotProps = {
  mode?: ThemeMode;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
};
