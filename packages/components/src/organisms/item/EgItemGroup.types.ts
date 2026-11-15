import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeMode } from '../../theme/index.js';

export type EgItemGroupProps = {
  children: ReactNode;
  testID?: string;
  mode?: ThemeMode;
  style?: StyleProp<ViewStyle>;
};