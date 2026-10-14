export type ShowcasePreviewMode = 'preview' | 'inspect';

export type ShowcaseInspectSelection = {
  label: string;
  layoutLines: string[];
  styleLines: string[];
  motionLines?: string[];
};
