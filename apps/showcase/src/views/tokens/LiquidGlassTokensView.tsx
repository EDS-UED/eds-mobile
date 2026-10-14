import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { liquidGlassArchitecture } from '@/data/tokens/liquidGlassArchitecture';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { LiquidGlassStackTree } from '@/views/tokens/LiquidGlassStackTree';

/** 与 dist/css/liquid-glass/architecture.css · spec/liquid-glass/system.json 同栈说明。 */
export function LiquidGlassTokensView() {
  const screenStyles = useShowcaseScreenStyles();
  const { conceptTitle, trunk, stacks, platformSplit } = liquidGlassArchitecture;

  return (
    <>
      <Stack.Screen options={{ headerTitle: '' }} />
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <LiquidGlassStackTree
          conceptTitle={conceptTitle}
          trunk={trunk}
          stacks={stacks}
          platformSplit={platformSplit}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.layout.scrollBottom,
  },
});
