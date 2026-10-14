import { GlassBlurBackdrop } from '@eds/mobile-components';
import { useIsFocused } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

/** Stack screen root — Fragment breaks flex; native stack needs one flex:1 child. */
export function ShowcaseStackScreen({ children }: PropsWithChildren) {
  const isFocused = useIsFocused();
  // Required for iOS large-title collapse when ScrollView is wrapped (Expo Router stack docs).
  return (
    <View collapsable={false} style={styles.root}>
      <GlassBlurBackdrop style={styles.blurHost} active={isFocused}>
        {children}
      </GlassBlurBackdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  blurHost: {
    flex: 1,
  },
});
