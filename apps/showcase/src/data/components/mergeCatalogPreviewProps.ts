import { resolveEgSwitchSize } from '@eds/mobile-components';
import { createCatalogPreviewProps } from '@eds/mobile-components/catalog';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import { applyMenuTriggerPreviewProps } from './applyMenuTriggerPreviewProps.js';
import { applyTabBarTextPreviewProps } from './tabBarTextCustomizeModel.js';
import { applyPageBodyPreviewProps } from './pageBodyCustomizeModel.js';
import { applySwitchPreviewProps } from './switchCustomizeModel.js';
import { applyToggleMarkPreviewProps } from './toggleMarkCustomizeModel.js';
import { applyTabSlidePreviewProps } from './tabCustomizeModel.js';

/** Merge Figma catalog defaults with playground Customize panel state. */
export function mergeCatalogPreviewProps(
  entry: Pick<FigmaComponentEntry, 'slug' | 'family' | 'exportName' | 'figmaName'>,
  customize: Record<string, unknown>,
  mode: 'light' | 'dark' = 'light',
) {
  const base = createCatalogPreviewProps(entry, mode);

  const merged = {
    ...base,
    ...customize,
    testID: base.testID,
    mode,
  };

  if (entry.exportName === 'EgSwitch') {
    merged.size = resolveEgSwitchSize(merged.size);
  }

  return applyTabSlidePreviewProps(
    entry,
    applyToggleMarkPreviewProps(
      entry,
      applySwitchPreviewProps(
        entry,
        applyMenuTriggerPreviewProps(entry, merged),
      ),
    ),
  );
}
