import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
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
  showcaseFamilyEntryHint,
  showcaseFamilyEntryTitle,
} from '@/data/components/componentFamilyListModel';
import { familyEgComponentName, findFamilyNav } from '@/data/components/buildComponentCatalogNav';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseSectionCard } from '@/views/shared/ShowcaseSectionCard';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { ShowcaseFamilyAvatarAssets } from '@/views/components/family/ShowcaseFamilyAvatarAssets';
import { ShowcaseFamilySymbolAssets } from '@/views/components/family/ShowcaseFamilySymbolAssets';

export function ComponentFamilyView() {
  const screenStyles = useShowcaseScreenStyles();
  const { tier: tierParam, family } = useLocalSearchParams<{ tier: string; family: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];

  useEffect(() => {
    if (family === 'icon' || family === 'crypto') {
      router.replace(`/(components)/family/${tier}/symbol`);
    }
  }, [family, tier]);

  const mergedSymbolFamily = family === 'icon' || family === 'crypto';
  const familyNav = findFamilyNav(tier, mergedSymbolFamily ? 'symbol' : (family ?? ''));
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
  const useAvatarAssetSection = family === 'avatar';
  const useSymbolAssetSection = family === 'symbol' || mergedSymbolFamily;

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
          style={screenStyles.scrollRoot}
        >
          <ShowcaseSectionCard title={SHOWCASE_FAMILY_SECTION_BODY} empty={!bodyEntry}>
            {bodyEntry ? (
              <ShowcaseCardRow
                variant="inset"
                titleWeight="600"
                title={familyEgComponentName(family)}
                onPress={() => router.push(`/(components)/detail/${bodyEntry.slug}`)}
              />
            ) : null}
          </ShowcaseSectionCard>

          {useAvatarAssetSection ? (
            <ShowcaseFamilyAvatarAssets />
          ) : useSymbolAssetSection ? (
            <ShowcaseFamilySymbolAssets />
          ) : (
            <>
              <ShowcaseSectionCard
                title={SHOWCASE_FAMILY_SECTION_SCENES}
                empty={!hasSceneRows}
                insetDividers
              >
                {familyNav.galleryFamily ? (
                  <ShowcaseCardRow
                    variant="inset"
                    titleWeight="400"
                    title="Gallery"
                    hint={`AtomGallery · ${familyNav.entries.length} entries`}
                    onPress={() => router.push(`/(components)/gallery/${tier}/${family}`)}
                  />
                ) : null}
                {sceneEntries.map((entry) => (
                  <ShowcaseCardRow
                    key={entry.slug}
                    variant="inset"
                    titleWeight="400"
                    title={showcaseFamilyEntryTitle(family, entry)}
                    hint={showcaseFamilyEntryHint(bodyEntry, entry)}
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
                    variant="inset"
                    titleWeight="400"
                    monoTitle
                    title={showcaseCompositionListTitle(entry)}
                    onPress={() => router.push(`/(components)/detail/${entry.slug}`)}
                  />
                ))}
              </ShowcaseSectionCard>
            </>
          )}
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}