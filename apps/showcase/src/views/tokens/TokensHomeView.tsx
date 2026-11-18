import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { tokenCategories } from '@/data/tokens/tokenNav';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseTabHomeLeads } from '@/navigation/showcaseTabHomeLeads';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { ShowcaseTabHomeIntro } from '@/views/shared/ShowcaseTabHomeIntro';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

export function TokensHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const title = showcaseTabHomeTitles.tokens;
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

          <ShowcaseTabHomeIntro lead={showcaseTabHomeLeads.tokens} />

          <View style={screenStyles.cardList}>
            {tokenCategories.map((category) => (
              <ShowcaseCardRow
                key={category.id}
                title={category.label}
                hint={category.lead}
                onPress={() => router.push(`/(tokens)/category/${category.id}`)}
              />
            ))}
          </View>
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}