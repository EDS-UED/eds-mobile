import type { FigmaComponentEntry } from '@eds/mobile-components';

export type RootStackParamList = {
  Catalog: undefined;
  ComponentPreview: {
    slug: string;
    exportName: string;
    figmaName: string;
    tier: FigmaComponentEntry['tier'];
    family: string;
  };
};
