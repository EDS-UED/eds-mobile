import type { Component } from 'vue';

export type ComponentPreviewEntry = {
  slug: string;
  title: string;
  /** Eg* export — matches catalog `exportName` and import snippet. */
  exportName?: string;
  component: Component;
  /** Component doc layout: no molecule lead; hide doc h2 when it matches page title. */
  usesComponentDocHeader?: boolean;
};
