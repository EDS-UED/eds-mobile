import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';

/** Native showcase shell — mirrors eds-desktop layout/ShowcaseLayout. */
export function ShowcaseLayout({ children }: PropsWithChildren) {
  const colors = useShowcaseColors();

  return (
    <View style={[styles.root, { backgroundColor: showcasePageBackgroundColor(colors) }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
