import { createContext, useContext, type ReactNode } from 'react';
import type { GestureType } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

/** page-shot 停顶下拉 · 滚动 `Native` 与壳层 `Pan` 并联（仅此，不改动效几何）。 */
export type EgPageShotPullBridge = {
  /** 展开 0 → 1 · 收回 1 → 0；与 `pageShotFrame` 同轨，供收回时滚动回顶插值。 */
  pageShotProgressSv: SharedValue<number>;
  /** 根页滚动偏移 · `close()` 与收回插值同帧读取。 */
  scrollOffsetYSv: SharedValue<number>;
  closeScrollStartYSv: SharedValue<number>;
  closeProgressStartSv: SharedValue<number>;
  closeScrollArmedSv: SharedValue<boolean>;
  scrollAtTopSv: SharedValue<boolean>;
  openSettledSv: SharedValue<boolean>;
  scrollNative: GestureType;
  /** 停顶轻扫 / 长按下滑 · 与 `scrollNative` 同挂在 `EgPageShotScroll` 上。 */
  scrollDismissDown: GestureType;
  /** 停顶快速下滑 Fling · ScrollView 未激活 Pan 时由滚动松手速度触发。 */
  onFlingDismissAtTop: (velocityY: number) => void;
  /** 与 `PageShotLayer` `chromeSession` 同步 · 仅新场次重置滚动偏移。 */
  chromeSession: number;
  /** 与 `close()` 同刻置位 · `EgPageShotScroll` 滚动条（不经 React commit）。 */
  closingSv: SharedValue<boolean>;
};

const EgPageShotPullBridgeContext = createContext<EgPageShotPullBridge | null>(null);

export function EgPageShotPullBridgeProvider({
  value,
  children,
}: {
  value: EgPageShotPullBridge;
  children: ReactNode;
}) {
  return <EgPageShotPullBridgeContext.Provider value={value}>{children}</EgPageShotPullBridgeContext.Provider>;
}

export function useEgPageShotPullBridge() {
  return useContext(EgPageShotPullBridgeContext);
}