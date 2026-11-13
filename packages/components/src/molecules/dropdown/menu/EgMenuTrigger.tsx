import type { EgMenuProps } from './EgMenu.types.js';
import { EgMenu } from './EgMenu.js';

/** Menu 场景化入口（Figma Trigger）— 与 {@link EgMenu} 同 API。 */
export function EgMenuTrigger(props: EgMenuProps) {
  return <EgMenu {...props} />;
}

export type { EgMenuProps as EgMenuTriggerProps } from './EgMenu.types.js';
