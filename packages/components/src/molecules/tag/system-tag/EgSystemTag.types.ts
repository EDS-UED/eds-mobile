import type { EgCommonProps, EgLabelProps, SystemTagType, TagSize } from '../../../shared/types.js';
import type { TagStatus } from '../../../shared/tagPalette.js';

export type EgSystemTagProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    systemType?: SystemTagType;
    status?: TagStatus;
  };
