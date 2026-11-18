import type { ColorTagType, EgCommonProps, EgLabelProps, TagSize } from '../../../shared/types.js';
import { EgTagBase } from '../_shared/EgTagBase.js';

export type EgTagAltProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    colorType?: ColorTagType;
  };

export function EgTagAlt({ colorType = 'green', ...props }: EgTagAltProps) {
  return (
    <EgTagBase {...props} alt colorType={colorType} testID={props.testID ?? 'tag-color-alt'} label={props.label ?? 'Tag'} />
  );
}