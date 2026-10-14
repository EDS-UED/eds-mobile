import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { motionCatalogEntries } from '@/data/animations/animationNav';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { DocSection } from '@/views/shared/DocSection';
import { ShowcasePlainCodeSnippet } from '@/views/shared/ShowcasePlainCodeSnippet';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

function createMotionDetailStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.page as string,
    },
    content: {
      paddingBottom: 24,
      paddingTop: theme.layout.navContentGapInner,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      color: colors['text-base-secondary'] as string,
    },
    missing: {
      padding: theme.layout.pageInset,
      color: colors['text-base-secondary'] as string,
    },
  });
}

export function MotionCatalogDetailView() {
  const { motionId } = useLocalSearchParams<{ motionId: string }>();
  const styles = useThemedStyles(createMotionDetailStyles);
  const entry = motionCatalogEntries.find((item) => item.id === motionId);

  if (!entry) {
    return (
      <View style={styles.root}>
        <Text style={styles.missing}>未找到 {motionId}</Text>
      </View>
    );
  }

  const baseLines = entry.springRef
    ? [`springRef: ${entry.springRef}`]
    : entry.timingRef
      ? [`timingRef: ${entry.timingRef}`]
      : ['base: —'];

  if (entry.hapticRef) {
    baseLines.push(`hapticRef: ${entry.hapticRef}`);
  }

  const resolutionSnippet = [
    `recipe: ${entry.recipe ?? '—'}`,
    `cssRecipe: ${entry.cssRecipe ?? '—'}`,
  ].join('\n');

  return (
    <>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <DocSection title="Resolution">
          <ShowcasePlainCodeSnippet snippet={resolutionSnippet} />
        </DocSection>

        <DocSection title="Base refs">
          <ShowcasePlainCodeSnippet snippet={baseLines.join('\n')} />
        </DocSection>

        <DocSection title="RN runtime">
          <Text style={styles.body}>
            Consumer 使用 resolveMotionRecipe / resolveMotionComposition（@eds/mobile-animations），禁止硬编码
            spring。Reduce Motion 走 motion-reduced-fade。
          </Text>
        </DocSection>
      </ScrollView>
      <Stack.Title>{entry.id}</Stack.Title>
    </>
  );
}
