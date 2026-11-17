import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

import {
  EgSymbol,
  cryptoAssetNames,
  formatSymbolDisplayName,
  iconAssetNames,
  preloadAllCryptoChunks,
  preloadAllIconChunks,
  resolveSymbolKind,
} from '@eds/mobile-components';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseDocSectionTitleStyle } from '@/views/shared/showcaseDocSectionLayout';
import {
  ShowcaseFamilyAssetGrid,
  type ShowcaseFamilyAssetTile,
} from '@/views/components/family/ShowcaseFamilyAssetGrid';
import { ShowcaseSearchBar } from '@/views/shared/ShowcaseSearchBar';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

import { SHOWCASE_FAMILY_SECTION_ASSETS } from '@/data/components/componentFamilyListModel';

function filterAssetNames(names: readonly string[], query: string, family: 'icon' | 'crypto') {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...names];
  }
  return names.filter((name) => {
    const label = (family === 'crypto' ? formatSymbolDisplayName(name) : name).toLowerCase();
    return name.toLowerCase().includes(q) || label.includes(q);
  });
}

function symbolTiles(names: readonly string[], mode: 'light' | 'dark'): ShowcaseFamilyAssetTile[] {
  return names.map((name) => {
    const kind = resolveSymbolKind(name);
    const label = kind === 'Crypto' ? formatSymbolDisplayName(name) : name;
    return {
      key: name,
      label,
      preview: <EgSymbol name={name} size="lg" mode={mode} testID={`symbol-asset-${name}`} />,
    };
  });
}

/** EgSymbol 族 — Icon + Crypto 资产小卡网格（与 Avatar 同构）。 */
export function ShowcaseFamilySymbolAssets() {
  const colors = useShowcaseColors();
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  const [query, setQuery] = useState('');

  useEffect(() => {
    void preloadAllIconChunks();
    void preloadAllCryptoChunks();
  }, []);

  const iconNames = useMemo(() => filterAssetNames(iconAssetNames, query, 'icon'), [query]);
  const cryptoNames = useMemo(() => filterAssetNames(cryptoAssetNames, query, 'crypto'), [query]);

  const iconTiles = useMemo(() => symbolTiles(iconNames, mode), [iconNames, mode]);
  const cryptoTiles = useMemo(() => symbolTiles(cryptoNames, mode), [cryptoNames, mode]);

  return (
    <View style={styles.wrap}>
      <Text style={showcaseDocSectionTitleStyle(colors)}>{SHOWCASE_FAMILY_SECTION_ASSETS}</Text>
      <ShowcaseSearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="搜索 Icon / Crypto 资产…"
        accessibilityLabel="Search symbol assets"
      />
      <ShowcaseFamilyAssetGrid sectionTitle={false} groupTitle="Icon" tiles={iconTiles} />
      <ShowcaseFamilyAssetGrid sectionTitle={false} groupTitle="Crypto" tiles={cryptoTiles} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: theme.layout.cardGap,
  },
});