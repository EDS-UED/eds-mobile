import type { ComponentType } from 'react';
import * as MobileComponents from '@eds/mobile-components';

/** Resolve catalog exportName → RN component (same code path as consumer apps). */
export function resolvePreviewComponent(
  exportName: string,
): ComponentType<Record<string, unknown>> | null {
  const candidate = (MobileComponents as Record<string, unknown>)[exportName];
  if (typeof candidate === 'function') {
    return candidate as ComponentType<Record<string, unknown>>;
  }
  return null;
}
