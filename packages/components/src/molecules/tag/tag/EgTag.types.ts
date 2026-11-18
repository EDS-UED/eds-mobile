import type { EgCommonProps, EgLabelProps, EgTagVariant, TagShape, TagSize } from '../../../shared/types.js';

export type EgTagProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    variant?: EgTagVariant;
    shape?: TagShape;
  };