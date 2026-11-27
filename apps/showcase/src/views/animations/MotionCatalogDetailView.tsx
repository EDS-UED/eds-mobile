import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';

import { motionCatalogEntries } from '@/data/animations/animationNav';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { DocSection } from '@/views/shared/DocSection';
import { DocSectionLinkRow } from '@/views/shared/DocSectionLinkRow';
import { ShowcasePlainCodeSnippet } from '@/views/shared/ShowcasePlainCodeSnippet';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcasePageBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

function createMotionDetailStyles(colors: ShowcaseColorMap, nativeStackNav: boolean) {
  const pageBg = showcasePageBackgroundColor(colors);
  return StyleSheet.create({
    scrollRoot: {
      flex: 1,
      ...(nativeStackNav ? null : { backgroundColor: pageBg }),
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
  const insets = useSafeAreaInsets();
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
  const styles = useThemedStyles((c) => createMotionDetailStyles(c, nativeStackNav));
  const scrollBottomExtra = Math.max(insets.bottom, edsSpacing('spacing-3'));

  if (!entry) {
    return (
      <ShowcaseStackScreen>
        <Stack.Screen options={stackScreenOptions} />
        {rnNavBar}
        <Text style={styles.missing}>未找到 {motionId}</Text>
      </ShowcaseStackScreen>
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
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          withTabBarInset={false}
          docSectionStack
          bottomInsetExtra={scrollBottomExtra}
          style={styles.scrollRoot}
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
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}