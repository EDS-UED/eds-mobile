import type { ReactNode } from 'react';
import type { ThemeMode } from '../theme/index.js';

export type ControlSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type TagSize = 'lg' | 'md' | 'sm';

/** Figma Button Type=Primary | Secondary | Tertiary */
export type ButtonFigmaType = 'primary' | 'secondary' | 'tertiary';

/** Showcase-aligned variant names */
export type ButtonVariant = 'solid' | 'outline' | 'text';

export type ButtonTone = 'brand' | 'danger' | 'decor' | 'subtle' | 'sameWhite';

export type FieldEvent = 'default' | 'tap' | 'entering' | 'done' | 'echo' | 'disable';

export type ColorTagType =
  | 'green'
  | 'yellow'
  | 'red'
  | 'blue'
  | 'purple'
  | 'blueGrey'
  | 'emeraldGreen'
  | 'gray';

export type SystemTagType = 'subtle' | 'solid' | 'strokeSubtle' | 'strokeSolid' | 'gray';

export type ToggleSize = 'lg' | 'md' | 'sm';

export type EgCommonProps = {
  testID?: string;
  mode?: ThemeMode;
  accessibilityLabel?: string;
};

export type EgLabelProps = {
  label?: string;
  children?: ReactNode;
};
