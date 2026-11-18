import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  buildTierFamilySections,
  componentCatalogNav,
  familyTierPressHref,
  familyTierRowHint,
  familyTierRowTitle,
} from '@/data/components/buildComponentCatalogNav';
import {
  showcaseDocPageSectionsContainerStyle,
  showcaseIndexCardListGapStyle,
} from '@/views/shared/showcaseDocSectionLayout';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseSectionCard } from '@/views/shared/ShowcaseSectionCard';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

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
  } = useShowcaseStackNav(navTitle, { inlineLargeTitle: true });

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
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          contentPaddingTop={0}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          withTabBarInset={false}
          style={screenStyles.scrollRoot}
        >
          <ShowcaseTabHomeDisplayTitle>{navTitle}</ShowcaseTabHomeDisplayTitle>

          {tier === 'molecules' ? (
            <View style={showcaseDocPageSectionsContainerStyle}>
              {buildTierFamilySections(tierNav).map((section, sectionIndex) => (
                <ShowcaseSectionCard
                  key={section.title ?? `section-${sectionIndex}`}
                  title={section.title}
                  empty={section.families.length === 0}
                >
                  {section.families.map((family) => (
                    <ShowcaseCardRow
                      key={family.family}
                      variant="inset"
                      title={familyTierRowTitle(family.family)}
                      hint={familyTierRowHint(family)}
                      onPress={() => router.push(familyTierPressHref(family))}
                    />
                  ))}
                </ShowcaseSectionCard>
              ))}
            </View>
          ) : (
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
          )}
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}