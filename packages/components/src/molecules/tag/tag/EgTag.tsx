import { EgTagBase } from '../_shared/EgTagBase.js';
import type { EgTagProps } from './EgTag.types.js';

export function EgTag({
  family = 'system',
  variant = 'subtle',
  status = 'danger',
  colorfulStyle = 'apricot',
  customStyle = 'vermilion',
  shape = 'round',
  size = 'sm',
  label = 'Tag',
  ...props
}: EgTagProps) {
  return (
    <EgTagBase
      {...props}
      family={family}
      variant={family === 'system' ? variant : undefined}
      status={family === 'status' ? status : undefined}
      colorfulStyle={family === 'colorful' ? colorfulStyle : undefined}
      customStyle={family === 'custom' ? customStyle : undefined}
      shape={shape}
      size={size}
      label={label}
      testID={props.testID ?? 'tag-color'}
    />
  );
}