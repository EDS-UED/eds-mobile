import type { EgFieldProps } from '../../_shared/props.js';
import { EgFieldBase } from '../../input/_shared/EgFieldBase.js';

export type EgTriggerDropdownProps = EgFieldProps;

export function EgTriggerDropdown(props: EgTriggerDropdownProps) {
  return (
    <EgFieldBase
      {...props}
      kind="dropdown"
      size={props.size ?? 'xl'}
      event={props.event ?? 'default'}
      echoValue={props.echoValue ?? 'Echo Value'}
      testID={props.testID ?? 'dropdown-trigger'}
      placeholder={props.placeholder ?? 'Trigger'}
    />
  );
}
