import type { ComponentType } from 'react';
import { loadPreviewComponent } from './previewComponentLoaders.generated.js';

/**
 * Resolve catalog exportName → RN component (lazy — avoids importing the full barrel).
 */
export function resolvePreviewComponent(
  exportName: string,
): ComponentType<Record<string, unknown>> | null {
  return loadPreviewComponent(exportName);
}
