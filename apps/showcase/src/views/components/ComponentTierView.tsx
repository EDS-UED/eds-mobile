import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  componentCatalogNav,
  familyTierPressHref,
  familyTierRowHint,
  familyTierRowTitle,
} from '@/data/components/buildComponentCatalogNav';
import { tierPageSubtitle } from '@/data/components/tierIntroCopy';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseSectionCard } from '@/views/shared/ShowcaseSectionCard';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

export function ComponentTierView() {
  const screenStyles = useShowcaseScreenStyles();
  const { tier: tierParam } = useLocalSearchParams<{ tier: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];
  const tierNav = componentCatalogNav.find((item) => item.tier === tier);
  const navTitle = tierNav?.label ?? tier;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(navTitle);

  if (!tierNav) {
    return (
      <View style={screenStyles.scrollRoot}>
        <Text style={screenStyles.missing}>未找到 tier {tier}</Text>
      </View>
    );
  }

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
          <ShowcasePageIntro subtitle lead={tierPageSubtitle(tier)} />

          <View style={screenStyles.cardList}>
            {tierNav.families.map((family) => (
              <ShowcaseCardRow
                key={family.family}
                title={familyTierRowTitle(family.family)}
                hint={familyTierRowHint(family)}
                onPress={() => router.push(familyTierPressHref(family))}
              />
            ))}
          </View>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}
