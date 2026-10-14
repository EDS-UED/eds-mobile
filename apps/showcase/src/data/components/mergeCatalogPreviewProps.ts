import { createCatalogPreviewProps } from '@eds/mobile-components/catalog';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

/** Merge Figma catalog defaults with playground Customize panel state. */
export function mergeCatalogPreviewProps(
  entry: Pick<FigmaComponentEntry, 'slug' | 'family' | 'exportName' | 'figmaName'>,
  customize: Record<string, unknown>,
  mode: 'light' | 'dark' = 'light',
) {
  const base = createCatalogPreviewProps(entry, mode);
  return {
    ...base,
    ...customize,
    testID: base.testID,
  };
}
