import {
  EgEdsAnimaPageShot,
  EgEdsAnimaPageShotTrigger,
} from '../../shared/motion/EgEdsAnimaPageShot.js';
import type { EgPageShotProps, EgPageShotTriggerProps } from './EgPageShot.types.js';

/**
 * Templates · 弹层页面本体（motion-page-shot 叠在 `EgEdsAnimaPageShot`；业务用本组件 + `EgPage` / `EgPageShotContent` 铺内容）。
 */
export function EgPageShot(props: EgPageShotProps) {
  return <EgEdsAnimaPageShot {...props} />;
}

export function EgPageShotTrigger(props: EgPageShotTriggerProps) {
  return <EgEdsAnimaPageShotTrigger {...props} />;
}