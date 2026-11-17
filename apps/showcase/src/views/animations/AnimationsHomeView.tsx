import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { motionScenarioDemos } from '@/data/animations/motionScenarioNav';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

export function AnimationsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const title = showcaseTabHomeTitles.animations;
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

          <ShowcasePageIntro
            homeLargeTitle
            subtitle
            lead="Live 预览与定制在此；RN 代码片段与 motion 参数在 Tokens · Motion。"
          />

          <View style={screenStyles.cardList}>
            {motionScenarioDemos.map((demo) => (
              <ShowcaseCardRow
                key={demo.id}
                title={demo.label}
                hint={demo.lead}
                onPress={() => router.push(`/(animations)/scenario/${demo.id}`)}
              />
            ))}
          </View>
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}