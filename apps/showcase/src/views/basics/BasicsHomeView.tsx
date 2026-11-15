import { router, Stack, type Href } from 'expo-router';
import { ScrollView } from 'react-native';

import { basicsEntries } from '@/data/basics/basicsNav';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseSectionCard } from '@/views/shared/ShowcaseSectionCard';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

export function BasicsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const title = showcaseTabHomeTitles.basics;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseTabHomeNav(title);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={screenStyles.scrollRoot}
          contentContainerStyle={showcaseNavScrollContentStyle(
            nativeStackNav,
            rnScrollPaddingTop,
            screenStyles.scrollContent,
          )}
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <ShowcaseTabHomeDisplayTitle>{title}</ShowcaseTabHomeDisplayTitle>

          <ShowcasePageIntro
            homeLargeTitle
            subtitle
            lead="EDS 工程基础能力：布局对照、联调约定与跨场景基础设施入口。"
          />

          <ShowcaseSectionCard>
            {basicsEntries.map((entry) => (
              <ShowcaseCardRow
                key={entry.id}
                title={entry.label}
                hint={
                  entry.status === 'planned'
                    ? `${entry.lead} · 规划中`
                    : `${entry.lead} · 可进入`
                }
                disabled={entry.status === 'planned'}
                onPress={
                  entry.status === 'preview' && entry.href
                    ? () => router.push(entry.href as Href)
                    : undefined
                }
              />
            ))}
          </ShowcaseSectionCard>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}