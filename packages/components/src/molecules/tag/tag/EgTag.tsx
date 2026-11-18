import { EgTagBase } from '../_shared/EgTagBase.js';
import type { EgTagProps } from './EgTag.types.js';

export function EgTag({
  variant = 'subtle',
  shape = 'round',
  size = 'sm',
  label = 'Tag',
  ...props
}: EgTagProps) {
  return (
    <EgTagBase
      {...props}
      variant={variant}
      shape={shape}
      size={size}
      label={label}
      testID={props.testID ?? 'tag-color'}
    />
  );
}