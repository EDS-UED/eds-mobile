import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';

import { motionCatalogEntries } from '@/data/animations/animationNav';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { DocSection } from '@/views/shared/DocSection';
import { DocSectionLinkRow } from '@/views/shared/DocSectionLinkRow';
import { ShowcasePlainCodeSnippet } from '@/views/shared/ShowcasePlainCodeSnippet';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

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
    missing: {
      padding: theme.layout.pageInset,
      color: colors['text-base-secondary'] as string,
    },
  });
}

/** Motion catalog class — 解析链速查；RN 片段与参数在 Tokens · 场景 Live 在上一节列表。 */
export function MotionCatalogDetailView() {
  const { motionId } = useLocalSearchParams<{ motionId: string }>();
  const styles = useThemedStyles(createMotionDetailStyles);
  const entry = motionCatalogEntries.find((item) => item.id === motionId);
  const navTitle = entry?.id ?? motionId ?? '';
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(navTitle);

  if (!entry) {
    return (
      <View style={styles.root}>
        <Text style={styles.missing}>未找到 {motionId}</Text>
      </View>
    );
  }

  const resolutionSnippet = [
    `recipe: ${entry.recipe ?? '—'}`,
    `cssRecipe: ${entry.cssRecipe ?? '—'}`,
  ].join('\n');

  const baseLines = entry.springRef
    ? [`springRef: ${entry.springRef}`]
    : entry.timingRef
      ? [`timingRef: ${entry.timingRef}`]
      : ['base: —'];
  if (entry.hapticRef) {
    baseLines.push(`hapticRef: ${entry.hapticRef}`);
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={styles.root}
          contentContainerStyle={showcaseNavScrollContentStyle(
            nativeStackNav,
            rnScrollPaddingTop,
            styles.content,
          )}
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <DocSection title="令牌参数" cardPadding="none">
            <DocSectionLinkRow
              title="Tokens · Motion"
              hint={`${entry.id} · RN 代码片段`}
              onPress={() => router.push(`/(tokens)/motion/${entry.id}`)}
            />
          </DocSection>

          <DocSection title="Resolution">
            <ShowcasePlainCodeSnippet snippet={resolutionSnippet} surface="embedded" />
          </DocSection>

          <DocSection title="Base refs">
            <ShowcasePlainCodeSnippet snippet={baseLines.join('\n')} surface="embedded" />
          </DocSection>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>
    </View>
  );
}