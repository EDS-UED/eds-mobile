import system from '../../../../../packages/tokens/spec/liquid-glass/system.json';

export type LiquidGlassStackNode = {
  id?: string;
  label: string;
  primary: string;
  secondary: string;
};

export type LiquidGlassArchitecture = {
  architectureSummary: string;
  conceptTitle: string;
  trunk: LiquidGlassStackNode[];
  stacks: LiquidGlassStackNode[];
  platformSplit: {
    label: string;
    branches: LiquidGlassStackNode[];
  };
  cssImports: { effect: string; liquidGlass: string };
};

export const liquidGlassArchitecture = system as LiquidGlassArchitecture;
