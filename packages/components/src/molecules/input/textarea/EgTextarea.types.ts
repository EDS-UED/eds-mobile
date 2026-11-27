import type { EgFieldProps } from '../../_shared/props.js';

export type EgTextareaProps = EgFieldProps & {
  /** 浅底 `material-card-moderate` · 默认 `true`；`false` → `material-hide`。 */
  showBackground?: boolean;
};
