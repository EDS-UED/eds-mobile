import type { EgMenuProps } from './EgMenu.types.js';
import { EgMenuNative } from './EgMenuNative.js';
import { EgMenuRn } from './EgMenuRn.js';
import { resolveEgMenuRenderStack } from './_shared/resolveEgMenuStack.js';

export {
  resolveEgMenuRenderStack,
  shouldUseEgMenuNativeStack,
  type EgMenuRenderStack,
} from './_shared/resolveEgMenuStack.js';
export { EG_MENU_DEMO_SECTIONS } from './_shared/egMenuModel.js';

/** 分组浮层菜单 — iOS 26+ / RN 同视觉；触发器 + 锚定 blur 面板。 */
export function EgMenu(props: EgMenuProps) {
  if (!props.forceRnImplementation && resolveEgMenuRenderStack() === 'native') {
    return <EgMenuNative {...props} />;
  }
  return <EgMenuRn {...props} />;
}
