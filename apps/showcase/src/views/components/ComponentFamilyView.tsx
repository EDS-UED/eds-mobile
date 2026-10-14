import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  resolveFamilyBodyEntry,
  resolveFamilyPageTitle,
  resolveFamilySceneEntries,
  SHOWCASE_FAMILY_SECTION_BODY,
  SHOWCASE_FAMILY_SECTION_SCENES,
  showcaseSceneListTitle,
} from '@/data/components/componentFamilyListModel';
import { SHOWCASE_GLASS_EG_SLUG } from '@/data/components/showcaseInfraCatalog';
import { familyEgComponentName, findFamilyNav } from '@/data/components/buildComponentCatalogNav';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export function ComponentFamilyView() {
  const screenStyles = useShowcaseScreenStyles();
  const colors = useShowcaseColors();
  const { tier: tierParam, family } = useLocalSearchParams<{ tier: string; family: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];
  const familyNav = findFamilyNav(tier, family ?? '');

  if (family === 'glass') {
    return <Redirect href={`/(components)/detail/${SHOWCASE_GLASS_EG_SLUG}`} />;
  }

  if (!familyNav || !family) {
    return (
      <View style={screenStyles.scrollRoot}>
        <Text style={screenStyles.missing}>未找到 {tier}/{family}</Text>
      </View>
    );
  }

  const bodyEntry = resolveFamilyBodyEntry(familyNav);
  const sceneEntries = resolveFamilySceneEntries(familyNav);
  const pageTitle = resolveFamilyPageTitle(familyNav);

  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>{pageTitle}</ShowcaseLargeTitle>

        {bodyEntry ? (
          <View style={screenStyles.cardList}>
            <Text style={[styles.sectionTitle, { color: colors['text-base-tertiary'] as string }]}>
              {SHOWCASE_FAMILY_SECTION_BODY}
            </Text>
            <ShowcaseCardRow
              title={familyEgComponentName(family)}
              onPress={() => router.push(`/(components)/detail/${bodyEntry.slug}`)}
            />
          </View>
        ) : null}

        <View style={screenStyles.cardList}>
          <Text style={[styles.sectionTitle, { color: colors['text-base-tertiary'] as string }]}>
            {SHOWCASE_FAMILY_SECTION_SCENES}
          </Text>

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
              title={showcaseSceneListTitle(family, entry.exportName)}
              onPress={() => router.push(`/(components)/detail/${entry.slug}`)}
            />
          ))}
        </View>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...theme.font.tokenGroupTitle,
  },
});
