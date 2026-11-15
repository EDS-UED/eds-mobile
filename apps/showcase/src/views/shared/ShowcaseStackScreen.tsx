import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

/** Stack 屏根 — `flex:1`；整屏勿包 `GlassBlurBackdrop`（顶栏须在 target 外），滚动内容用 `ShowcaseNavBlurBackdrop`。 */
export function ShowcaseStackScreen({ children }: PropsWithChildren) {
  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});