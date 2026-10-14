import type { EgSystemTagProps } from '../system-tag/EgSystemTag.js';
import { EgSystemTag } from '../system-tag/EgSystemTag.js';

export type EgSystemTagAltProps = EgSystemTagProps;

export function EgSystemTagAlt(props: EgSystemTagAltProps) {
  return <EgSystemTag {...props} alt testID={props.testID ?? 'tag-system-alt'} label={props.label ?? 'Tag'} />;
}
