/** Catalog / `EgSymbol` name → on-disk SVG base name. */
export const ICON_ASSET_ALIASES: Record<string, string> = {
  'eds-global-payments-fill': 'eds-global-payments -fill',
};

const ICON_FILE_TO_CANONICAL = Object.fromEntries(
  Object.entries(ICON_ASSET_ALIASES).map(([canonical, fileName]) => [fileName, canonical]),
) as Record<string, string>;

export function resolveIconAssetFileName(assetName: string): string {
  return ICON_ASSET_ALIASES[assetName] ?? assetName;
}

/** Gallery / docs label — canonical `EgIcon` name aligned with Desktop `iconNames`. */
export function canonicalIconAssetName(fileName: string): string {
  return ICON_FILE_TO_CANONICAL[fileName] ?? fileName;
}
