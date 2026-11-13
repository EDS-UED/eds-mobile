import type { EgMenuProps } from './EgMenu.types.js';
import { EgMenuAnchored } from './EgMenuAnchored.js';

/** Android / iOS ≤25 — 分组浮层 + blur 面板。 */
export function EgMenuRn(props: EgMenuProps) {
  return <EgMenuAnchored {...props} />;
}
