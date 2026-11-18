import type { ColorTagType, EgCommonProps, EgLabelProps, TagSize } from '../../../shared/types.js';

export type EgTagAltProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    colorType?: ColorTagType;
  };