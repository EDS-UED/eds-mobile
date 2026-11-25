import {
  EgEdsAnimaPageShot,
  EgEdsAnimaPageShotTrigger,
} from '../../shared/motion/EgEdsAnimaPageShot.js';
import type { EgPageShotProps, EgPageShotTriggerProps } from './EgPageShot.types.js';

/**
 * Templates · 弹层页面本体（motion-page-shot）。
 * 业务：`EgPageShot` + `EgPageShotTrigger` + **`EgPageShotContent`**（根/子页滚动区）；
 * 收回飞回触发卡片、滚后内容同轨收进卡片由壳层与 `EgPageShotContent` 内建，勿自写 scroll 同步。
 */
export function EgPageShot(props: EgPageShotProps) {
  return <EgEdsAnimaPageShot {...props} />;
}

export function EgPageShotTrigger(props: EgPageShotTriggerProps) {
  return <EgEdsAnimaPageShotTrigger {...props} />;
}