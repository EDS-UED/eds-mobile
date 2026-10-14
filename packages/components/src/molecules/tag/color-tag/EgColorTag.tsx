import type { ColorTagType, EgCommonProps, EgLabelProps, TagSize } from '../../../shared/types.js';
import { EgTagBase } from '../_shared/EgTagBase.js';

export type EgColorTagProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    colorType?: ColorTagType;
  };

export function EgColorTag({ colorType = 'green', label = 'Tag', ...props }: EgColorTagProps) {
  return <EgTagBase {...props} colorType={colorType} label={label} testID={props.testID ?? 'tag-color'} />;
}
