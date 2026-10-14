import type { EgCommonProps, EgLabelProps, SystemTagType, TagSize } from '../../../shared/types.js';
import type { TagStatus } from '../../../shared/tagPalette.js';
import { EgTagBase } from '../_shared/EgTagBase.js';

export type EgSystemTagProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    systemType?: SystemTagType;
    status?: TagStatus;
    alt?: boolean;
  };

export function EgSystemTag({ systemType = 'subtle', ...props }: EgSystemTagProps) {
  return <EgTagBase {...props} systemType={systemType} testID={props.testID ?? 'tag-system'} />;
}
