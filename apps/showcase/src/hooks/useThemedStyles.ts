import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import { useShowcaseColors, type ShowcaseColorMap } from '@/hooks/useShowcaseColors';

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

/** StyleSheet.create with semantic colors resolved for current light/dark appearance. */
export function useThemedStyles<T extends NamedStyles>(factory: (colors: ShowcaseColorMap) => T): T {
  const colors = useShowcaseColors();
  return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
}
