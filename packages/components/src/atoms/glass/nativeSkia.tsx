import { Platform } from 'react-native';

export type SkiaModule = typeof import('@shopify/react-native-skia');

let skiaModule: SkiaModule | null | undefined;
let skiaNativeLinked: boolean | undefined;

function hasSkiaNativeModule(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    const { TurboModuleRegistry } = require('react-native') as {
      TurboModuleRegistry?: { get: (name: string) => unknown };
    };
    return TurboModuleRegistry?.get('RNSkiaModule') != null;
  } catch {
    return false;
  }
}

export function getSkiaModule(): SkiaModule | null {
  if (skiaModule !== undefined) {
    return skiaModule;
  }

  if (!hasSkiaNativeModule()) {
    skiaModule = null;
    return skiaModule;
  }

  try {
    skiaModule = require('@shopify/react-native-skia') as SkiaModule;
  } catch {
    skiaModule = null;
  }

  return skiaModule;
}

/** JS 包存在且原生 ViewManager 已编进 dev client。 */
export function isSkiaGlassAvailable(): boolean {
  if (skiaNativeLinked === undefined) {
    skiaNativeLinked = hasSkiaNativeModule();
  }
  return skiaNativeLinked && getSkiaModule() != null;
}
