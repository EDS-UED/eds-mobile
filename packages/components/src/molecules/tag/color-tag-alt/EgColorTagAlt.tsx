import type { ColorTagType, EgCommonProps, EgLabelProps, TagSize } from '../../../shared/types.js';
import { EgTagBase } from '../_shared/EgTagBase.js';

export type EgColorTagAltProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    colorType?: ColorTagType;
  };

export function EgColorTagAlt({ colorType = 'green', ...props }: EgColorTagAltProps) {
  return (
    <EgTagBase {...props} alt colorType={colorType} testID={props.testID ?? 'tag-color-alt'} label={props.label ?? 'Tag'} />
  );
}
