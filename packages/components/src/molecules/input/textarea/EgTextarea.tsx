import type { EgTextareaProps } from './EgTextarea.types.js';
import { EgFieldBase } from '../_shared/EgFieldBase.js';

export function EgTextarea({ showBackground = true, ...props }: EgTextareaProps) {
  return (
    <EgFieldBase
      {...props}
      showBackground={showBackground}
      kind="textarea"
      size={props.size ?? 'md'}
      testID={props.testID ?? 'input-textarea'}
      placeholder={props.placeholder ?? 'Textarea'}
    />
  );
}
