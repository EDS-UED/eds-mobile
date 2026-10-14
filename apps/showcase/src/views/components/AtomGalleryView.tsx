import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';
import { AtomGallery } from '@eds/mobile-components/preview/atom-gallery';
import { useColorScheme } from 'react-native';

import { findFamilyNav, FAMILY_LABELS } from '@/data/components/buildComponentCatalogNav';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseSearchBar } from '@/views/shared/ShowcaseSearchBar';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export function AtomGalleryView() {
  const screenStyles = useShowcaseScreenStyles();
  const { tier: tierParam, family } = useLocalSearchParams<{ tier: string; family: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];
  const familyNav = findFamilyNav(tier, family ?? '');
  const [query, setQuery] = useState('');
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  const title = FAMILY_LABELS[family ?? ''] ?? family ?? 'Gallery';

  if (!familyNav?.galleryFamily) {
    return null;
  }

  return (
    <>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <ShowcaseSearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="搜索 symbol…"
          accessibilityLabel="Search atom gallery"
        />
        <AtomGallery family={familyNav.galleryFamily} mode={mode} query={query} />
      </ScrollView>
      <Stack.Title>{title}</Stack.Title>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    paddingTop: theme.layout.navContentGapInner,
  },
});
