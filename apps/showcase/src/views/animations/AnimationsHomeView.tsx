import { router, Stack } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { EgPageScrollViewHandle } from '@eds/mobile-components';
import { sceneAnimationCatalog } from '@/data/animations/sceneAnimationCatalog';
import { motionScenarioDemos } from '@/data/animations/motionScenarioNav';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTabHomeLeads } from '@/navigation/showcaseTabHomeLeads';
import { ShowcaseTabHomeIntro } from '@/views/shared/ShowcaseTabHomeIntro';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import {
  AnimationsHomeInlineSegment,
  AnimationsHomeNavSegment,
  AnimationsHomeSegmentProvider,
  useAnimationsHomeScrollPreserve,
  useAnimationsHomeSegment,
} from '@/views/animations/animationsHomeSegment';

export function AnimationsHomeView() {
  return (
    <AnimationsHomeSegmentProvider>
      <AnimationsHomeViewBody />
    </AnimationsHomeSegmentProvider>
  );
}

function AnimationsHomeViewBody() {
  const screenStyles = useShowcaseScreenStyles();
  const scrollRef = useRef<EgPageScrollViewHandle>(null);
  const { segmentIndex } = useAnimationsHomeSegment();
  const title = showcaseTabHomeTitles.animations;

  const {
    onScroll: onScrollFromNav,
    scrollEventThrottle,
    scrollEdgeActive,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseTabHomeNav(title, { ScrollEdgeTitleComponent: AnimationsHomeNavSegment });

  const { onScroll, onCardsSectionLayout } = useAnimationsHomeScrollPreserve(
    scrollRef,
    scrollEdgeActive,
    onScrollFromNav,
  );

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          scrollViewRef={scrollRef}
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          contentPaddingTop={0}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          style={screenStyles.scrollRoot}
        >
          <ShowcaseTabHomeDisplayTitle>{title}</ShowcaseTabHomeDisplayTitle>
          <ShowcaseTabHomeIntro lead={showcaseTabHomeLeads.animations}>
            <AnimationsHomeInlineSegment testID="animations-home-segment" />
          </ShowcaseTabHomeIntro>

          {segmentIndex === 0 ? (
            <View
              style={styles.segmentPane}
              onLayout={(event) => onCardsSectionLayout(event.nativeEvent.layout.y)}
            >
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
            </View>
          ) : (
            <View
              style={styles.segmentPane}
              onLayout={(event) => onCardsSectionLayout(event.nativeEvent.layout.y)}
            >
              <View style={screenStyles.cardList}>
                {sceneAnimationCatalog.map((entry) => (
                  <ShowcaseCardRow
                    key={entry.slug}
                    title={entry.name}
                    hint={entry.lead}
                    onPress={() => router.push(`/(animations)/scene/${entry.slug}`)}
                  />
                ))}
              </View>
            </View>
          )}
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  /** 切换分段时维持最小高度，减轻内容高度突变把滚动位顶回顶部。 */
  segmentPane: {
    minHeight: 320,
    marginTop: theme.layout.tabHomeTrailingToCardsExtra,
  },
});