import type { EgFieldProps } from '../../_shared/props.js';
import { EgFieldBase } from '../_shared/EgFieldBase.js';

export type EgQuickInputProps = EgFieldProps;

export function EgQuickInput(props: EgQuickInputProps) {
  return (
    <EgFieldBase
      {...props}
      size={props.size ?? 'xs'}
      testID={props.testID ?? 'input-quick-input'}
      placeholder={props.placeholder ?? 'Quick input'}
    />
  );
}
