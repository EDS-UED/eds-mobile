import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

/** Native showcase shell — mirrors eds-desktop layout/ShowcaseLayout. */
export function ShowcaseLayout({ children }: PropsWithChildren) {
  const colors = useShowcaseColors();

  return <View style={[styles.root, { backgroundColor: colors.page as string }]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
