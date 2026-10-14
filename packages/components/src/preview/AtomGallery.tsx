import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { canonicalIconAssetName } from '../atoms/_shared/icon/iconAssetAliases.js';
import {
  EgSymbol,
  cryptoAssetNames,
  formatSymbolDisplayName,
  iconAssetNames,
  preloadAllCryptoChunks,
  preloadAllIconChunks,
  resolveSymbolKind,
} from '../atoms/_shared/symbol/index.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { figmaComponentCatalog } from '../catalog/figmaCatalog.js';
import { resolvePreviewComponent } from './resolvePreviewComponent.js';

export type AtomGalleryFamily = 'icon' | 'crypto' | 'avatar';

const spacing = mobileTheme.spacing;
const typography = mobileTheme.typography.base;

const ATOM_GALLERY_CELL_BASIS = 120;
const ATOM_GALLERY_CELL_MAX = 180;
const ATOM_GALLERY_CELL_MIN_CRYPTO = 88;
const ATOM_GALLERY_CELL_MIN_AVATAR = 96;
const ATOM_GALLERY_PREVIEW_SLOT = 48;

const GALLERY_FAMILY: Record<string, AtomGalleryFamily> = {
  icons: 'icon',
  crypto: 'crypto',
  avatar: 'avatar',
};

export function atomGalleryFamily(slug: string): AtomGalleryFamily | null {
  return GALLERY_FAMILY[slug] ?? null;
}

function symbolGalleryLabel(family: 'icon' | 'crypto', assetName: string) {
  if (family === 'icon') return canonicalIconAssetName(assetName);
  return formatSymbolDisplayName(assetName);
}

function filterSymbolAssets(family: 'icon' | 'crypto', query: string) {
  const names = family === 'icon' ? iconAssetNames : cryptoAssetNames;
  const q = query.trim().toLowerCase();
  return names.filter((name) => {
    if (!q) return true;
    const label = symbolGalleryLabel(family, name).toLowerCase();
    return name.toLowerCase().includes(q) || label.includes(q);
  });
}

function filterEntries(family: AtomGalleryFamily, query: string) {
  const q = query.trim().toLowerCase();
  return figmaComponentCatalog
    .filter((entry) => entry.family === family)
    .filter((entry) => {
      if (!q) return true;
      return (
        entry.slug.includes(q) ||
        entry.exportName.toLowerCase().includes(q) ||
        entry.figmaName.toLowerCase().includes(q)
      );
    })
    .slice()
    .sort((a, b) => a.exportName.localeCompare(b.exportName));
}

/**
 * Browseable atom catalog — same RN components as Playground / consumer.
 * Showcase passes ?gallery= + optional ?q=; layout follows Desktop gallery UX
 * (responsive grid + mono label) without re-implementing atoms in Vue.
 */
export function AtomGallery({
  family,
  mode = 'light',
  query = '',
}: {
  family: AtomGalleryFamily;
  mode?: ThemeMode;
  query?: string;
}) {
  const colors = getThemeColors(mode);
  const cellMinWidth =
    family === 'avatar' ? ATOM_GALLERY_CELL_MIN_AVATAR : ATOM_GALLERY_CELL_MIN_CRYPTO;

  useEffect(() => {
    if (family === 'icon') void preloadAllIconChunks();
    if (family === 'crypto') void preloadAllCryptoChunks();
  }, [family]);

  if (family === 'icon' || family === 'crypto') {
    const assets = filterSymbolAssets(family, query);
    return (
      <View style={{ width: '100%', backgroundColor: colors.page as string }}>
        <View style={styles.grid}>
          {assets.map((assetName) => {
            const label = symbolGalleryLabel(family, assetName);
            const kind = resolveSymbolKind(assetName);
            return (
              <View
                key={assetName}
                style={[
                  styles.cell,
                  {
                    minWidth: cellMinWidth,
                    backgroundColor: colors['material-card-shallow'] as string,
                    borderColor: colors['stroke-divider-page'] as string,
                  },
                ]}
              >
                <View style={styles.previewSlot}>
                  <EgSymbol name={assetName} size="lg" testID={assetName} mode={mode} />
                </View>
                <Text
                  style={[styles.label, { color: colors['text-base-secondary'] as string }]}
                  numberOfLines={2}
                >
                  {label}
                </Text>
                {family === 'crypto' ? (
                  <Text
                    style={[styles.kindLabel, { color: colors['text-base-tertiary'] as string }]}
                    numberOfLines={1}
                  >
                    {kind}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  const entries = filterEntries(family, query);

  return (
    <View style={{ width: '100%', backgroundColor: colors.page as string }}>
      <View style={styles.grid}>
        {entries.map((entry) => {
          const PreviewComponent = resolvePreviewComponent(entry.exportName);
          return (
            <View
              key={entry.slug}
              style={[
                styles.cell,
                {
                  minWidth: cellMinWidth,
                  backgroundColor: colors['material-card-shallow'] as string,
                  borderColor: colors['stroke-divider-page'] as string,
                },
              ]}
            >
              <View style={styles.previewSlot}>
                {PreviewComponent ? (
                  <PreviewComponent testID={entry.slug} mode={mode} size="lg" />
                ) : (
                  <Text
                    style={{
                      color: colors['text-base-tertiary'] as string,
                      fontSize: typography['size-bar'] as number,
                    }}
                  >
                    —
                  </Text>
                )}
              </View>
              <Text
                style={[styles.label, { color: colors['text-base-secondary'] as string }]}
                numberOfLines={2}
              >
                {entry.exportName}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['spacing-3'] as number,
    padding: spacing['spacing-4'] as number,
    alignItems: 'flex-start',
  },
  cell: {
    flexGrow: 1,
    flexBasis: ATOM_GALLERY_CELL_BASIS,
    maxWidth: ATOM_GALLERY_CELL_MAX,
    borderWidth: spacing['stroke-sm'] as number,
    borderRadius: spacing['radius-md'] as number,
    paddingVertical: spacing['spacing-8'] as number,
    paddingHorizontal: spacing['spacing-4'] as number,
    alignItems: 'center',
    gap: spacing['spacing-4'] as number,
  },
  previewSlot: {
    minHeight: ATOM_GALLERY_PREVIEW_SLOT,
    minWidth: ATOM_GALLERY_PREVIEW_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography['size-bar'] as number,
    lineHeight: typography['line-height-bar'] as number,
    textAlign: 'center',
    ...edsFontStyle('400', 'mono'),
  } as const,
  kindLabel: {
    fontSize: typography['size-footnote'] as number,
    lineHeight: typography['line-height-footnote'] as number,
    textAlign: 'center',
    ...edsFontStyle('400'),
  } as const,
});
