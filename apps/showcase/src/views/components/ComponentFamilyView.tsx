import { Redirect, router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  resolveFamilyBodyEntry,
  resolveFamilyCompositionEntries,
  resolveFamilyPageTitle,
  resolveFamilySceneEntries,
  SHOWCASE_FAMILY_SECTION_BODY,
  SHOWCASE_FAMILY_SECTION_COMPOSITION,
  SHOWCASE_FAMILY_SECTION_EMPTY,
  SHOWCASE_FAMILY_SECTION_SCENES,
  showcaseCompositionListTitle,
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

type FamilySectionProps = {
  title: string;
  colors: ReturnType<typeof useShowcaseColors>;
  cardListStyle: object;
  children: ReactNode;
  empty?: boolean;
};

function FamilySection({ title, colors, cardListStyle, children, empty }: FamilySectionProps) {
  return (
    <View style={cardListStyle}>
      <Text style={[styles.sectionTitle, { color: colors['text-base-tertiary'] as string }]}>{title}</Text>
      {empty ? (
        <Text style={[styles.sectionEmpty, { color: colors['text-base-tertiary'] as string }]}>
          {SHOWCASE_FAMILY_SECTION_EMPTY}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

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
  const compositionEntries = resolveFamilyCompositionEntries(familyNav);
  const pageTitle = resolveFamilyPageTitle(familyNav);
  const hasSceneRows = Boolean(familyNav.galleryFamily) || sceneEntries.length > 0;

  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>{pageTitle}</ShowcaseLargeTitle>

        <FamilySection
          title={SHOWCASE_FAMILY_SECTION_BODY}
          colors={colors}
          cardListStyle={screenStyles.cardList}
          empty={!bodyEntry}
        >
          {bodyEntry ? (
            <ShowcaseCardRow
              title={familyEgComponentName(family)}
              onPress={() => router.push(`/(components)/detail/${bodyEntry.slug}`)}
            />
          ) : null}
        </FamilySection>

        <FamilySection
          title={SHOWCASE_FAMILY_SECTION_SCENES}
          colors={colors}
          cardListStyle={screenStyles.cardList}
          empty={!hasSceneRows}
        >
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
        </FamilySection>

        <FamilySection
          title={SHOWCASE_FAMILY_SECTION_COMPOSITION}
          colors={colors}
          cardListStyle={screenStyles.cardList}
          empty={compositionEntries.length === 0}
        >
          {compositionEntries.map((entry) => (
            <ShowcaseCardRow
              key={entry.slug}
              variant="plain"
              monoTitle
              title={showcaseCompositionListTitle(entry)}
              onPress={() => router.push(`/(components)/detail/${entry.slug}`)}
            />
          ))}
        </FamilySection>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...theme.font.tokenGroupTitle,
  },
  sectionEmpty: {
    ...theme.font.rowHint,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
});
