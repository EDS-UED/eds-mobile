export type TokenLayer = 'base' | 'semantic' | 'recipe';

export type TokenEntry = {
  name: string;
  layer: TokenLayer;
  /** Hero title — eds-* / --* / .* */
  cssVar: string;
  /** Detail subtext lines (Semantic: dist CSS value + `;`). */
  detailLines: string[];
};

export type TokenGroup = {
  comment: string;
  tokens: TokenEntry[];
};
