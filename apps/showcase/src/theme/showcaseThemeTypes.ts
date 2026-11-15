/** Resolved semantic color map + Showcase `page`（`--box-page-card` 别名）。 */
export type ShowcaseColorMap = Record<string, string> & {
  page: string;
  'box-page': string;
  'box-page-card': string;
  'material-card-shallow': string;
};

export type ShowcaseColorTheme = 'light' | 'dark';
