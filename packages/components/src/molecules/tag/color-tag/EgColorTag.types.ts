import type { ColorTagType, EgCommonProps, EgLabelProps, TagSize } from '../../../shared/types.js';
export type EgColorTagProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    colorType?: ColorTagType;
  };
