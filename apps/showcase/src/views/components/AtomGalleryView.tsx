import { Stack, useLocalSearchParams } from 'expo-router';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { useState } from 'react';
import { View } from 'react-native';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';
import { AtomGallery } from '@eds/mobile-components/preview/atom-gallery';
import { useColorScheme } from 'react-native';

import { findFamilyNav, FAMILY_LABELS } from '@/data/components/buildComponentCatalogNav';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseSearchBar } from '@/views/shared/ShowcaseSearchBar';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

export function AtomGalleryView() {
  const screenStyles = useShowcaseScreenStyles();
  const { tier: tierParam, family } = useLocalSearchParams<{ tier: string; family: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];
  const galleryFamilyKey =
    family === 'icon' || family === 'crypto' ? 'symbol' : family;
  const familyNav = findFamilyNav(tier, galleryFamilyKey ?? '');
  const [query, setQuery] = useState('');
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  const title = FAMILY_LABELS[family ?? ''] ?? family ?? 'Gallery';
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(title);

  if (!familyNav?.galleryFamily) {
    return null;
  }

  return (
    <View style={screenStyles.scrollRoot}>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          withTabBarInset={false}
          style={screenStyles.scrollRoot}
        >
          <ShowcaseSearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="搜索 symbol…"
            accessibilityLabel="Search atom gallery"
          />
          <AtomGallery family={familyNav.galleryFamily} mode={mode} query={query} />
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </View>
  );
}
