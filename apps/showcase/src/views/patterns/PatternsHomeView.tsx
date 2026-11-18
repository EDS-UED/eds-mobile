import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { patternEntries } from '@/data/patterns/patternNav';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTabHomeLeads } from '@/navigation/showcaseTabHomeLeads';
import { ShowcaseTabHomeIntro } from '@/views/shared/ShowcaseTabHomeIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

export function PatternsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const title = showcaseTabHomeTitles.patterns;
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
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          contentPaddingTop={0}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          style={screenStyles.scrollRoot}
        >
          <ShowcaseTabHomeDisplayTitle>{title}</ShowcaseTabHomeDisplayTitle>

          <ShowcaseTabHomeIntro lead={showcaseTabHomeLeads.patterns} />

          <View style={screenStyles.cardList}>
            {patternEntries.map((entry) => (
              <ShowcaseCardRow
                key={entry.id}
                title={entry.label}
                hint={entry.lead}
                disabled={entry.status === 'planned'}
                onPress={
                  entry.status === 'preview' && entry.detailSlug
                    ? () => router.push(`/(patterns)/detail/${entry.detailSlug}`)
                    : undefined
                }
              />
            ))}
          </View>
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}
