import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  resolveFamilyBodyEntry,
  resolveFamilyCompositionEntries,
  resolveFamilyPageTitle,
  resolveFamilySceneEntries,
  SHOWCASE_FAMILY_SECTION_BODY,
  SHOWCASE_FAMILY_SECTION_COMPOSITION,
  SHOWCASE_FAMILY_SECTION_SCENES,
  showcaseCompositionListTitle,
  showcaseFamilyEntryTitle,
} from '@/data/components/componentFamilyListModel';
import { isShowcaseInfraEntry } from '@/data/components/showcaseCatalog';
import { familyEgComponentName, findFamilyNav } from '@/data/components/buildComponentCatalogNav';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseSectionCard } from '@/views/shared/ShowcaseSectionCard';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

export function ComponentFamilyView() {
  const screenStyles = useShowcaseScreenStyles();
  const { tier: tierParam, family } = useLocalSearchParams<{ tier: string; family: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];
  const familyNav = findFamilyNav(tier, family ?? '');
  const pageTitle = familyNav ? resolveFamilyPageTitle(familyNav) : (family ?? tier);
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(pageTitle);

  if (!familyNav || !family) {
    return (
      <View style={screenStyles.scrollRoot}>
        <Text style={screenStyles.missing}>未找到 {tier}/{family}</Text>
      </View>
    );
  }

  const bodyEntry = resolveFamilyBodyEntry(familyNav);
  const sceneEntries = resolveFamilySceneEntries(familyNav);
  const compositionEntries = resolveFamilyCompositionEntries(familyNav);
  const hasSceneRows = Boolean(familyNav.galleryFamily) || sceneEntries.length > 0;

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
          <ShowcaseSectionCard title={SHOWCASE_FAMILY_SECTION_BODY} empty={!bodyEntry}>
            {bodyEntry ? (
              <ShowcaseCardRow
                title={familyEgComponentName(family)}
                onPress={() => router.push(`/(components)/detail/${bodyEntry.slug}`)}
              />
            ) : null}
          </ShowcaseSectionCard>

          <ShowcaseSectionCard title={SHOWCASE_FAMILY_SECTION_SCENES} empty={!hasSceneRows}>
            {familyNav.galleryFamily ? (
              <ShowcaseCardRow
                title="Gallery"
                hint={`AtomGallery · ${familyNav.entries.length} entries`}
                onPress={() => router.push(`/(components)/gallery/${tier}/${family}`)}
              />
            ) : null}
            {sceneEntries.map((entry) => (
              <ShowcaseCardRow
                key={entry.slug}
                title={showcaseFamilyEntryTitle(family, entry)}
                hint={isShowcaseInfraEntry(entry) ? entry.showcaseLabel : undefined}
                onPress={() => router.push(`/(components)/detail/${entry.slug}`)}
              />
            ))}
          </ShowcaseSectionCard>

          <ShowcaseSectionCard
            title={SHOWCASE_FAMILY_SECTION_COMPOSITION}
            empty={compositionEntries.length === 0}
          >
            {compositionEntries.map((entry) => (
              <ShowcaseCardRow
                key={entry.slug}
                monoTitle
                title={showcaseCompositionListTitle(entry)}
                onPress={() => router.push(`/(components)/detail/${entry.slug}`)}
              />
            ))}
          </ShowcaseSectionCard>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}