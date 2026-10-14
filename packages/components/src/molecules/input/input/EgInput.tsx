import type { EgFieldProps } from '../../_shared/props.js';
import { EgFieldBase } from '../_shared/EgFieldBase.js';

export type EgInputProps = EgFieldProps;

export function EgInput(props: EgInputProps) {
  return (
    <EgFieldBase
      {...props}
      size={props.size ?? 'xl'}
      testID={props.testID ?? 'input-input'}
      placeholder={props.placeholder ?? 'Input'}
    />
  );
}
