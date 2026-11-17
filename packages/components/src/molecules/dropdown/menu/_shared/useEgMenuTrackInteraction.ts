import { useCallback, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../../../atoms/glass/glassPressHaptic.js';
import {
  menuStretchAmount,
  menuStretchClampTranslation,
  menuStretchOverflow,
  menuStretchReleaseSpringConfig,
  menuStretchUnmapY,
} from '../../../../shared/motion/menuMotion.js';
import { hitTestMenuItemAtY, type EgMenuItemHitRect } from './egMenuItemHitTest.js';

export type EgMenuPanelBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function resolveMenuPanelBounds(
  stretch: EgMenuStretchState | undefined,
  menuPanelBounds: EgMenuPanelBounds | undefined,
): EgMenuPanelBounds | undefined {
  'worklet';
  if (stretch) {
    return {
      left: stretch.left,
      top: stretch.top,
      width: stretch.width,
      height: stretch.height,
    };
  }
  return menuPanelBounds;
}

function fingerInMenuPanel(x: number, y: number, bounds: EgMenuPanelBounds) {
  'worklet';
  return (
    x >= bounds.left &&
    x <= bounds.left + bounds.width &&
    y >= bounds.top &&
    y <= bounds.top + bounds.height
  );
}

/** 按住拖拽拉伸：额外宽 / 高（px）与方向（±1），由浮层拉伸层消费。 */
export type EgMenuStretchState = {
  amountX: SharedValue<number>;
  amountY: SharedValue<number>;
  dirX: SharedValue<number>;
  dirY: SharedValue<number>;
  width: number;
  height: number;
  /** 面板中心窗口 Y（静止布局）。 */
  centerY: number;
  /** 面板左缘 / 上缘窗口坐标（静止布局）— 判定手指是否越出面板。 */
  left: number;
  top: number;
  /** 可拉伸方向（`menuStretchAllowance`）：x 1 仅右 · −1 仅左 · 0 左右；y 1 仅下 · −1 仅上。 */
  allowX: -1 | 0 | 1;
  allowY: -1 | 1;
};

type UseEgMenuTrackInteractionOptions = {
  disabled: boolean;
  layoutsShared: ReturnType<typeof useSharedValue<EgMenuItemHitRect[]>>;
  isItemDisabled: (itemId: string) => boolean;
  /** 松手命中行内时选中（滑动过程仅跟手高亮，不改 selectedId）。 */
  onTapItem: (itemId: string) => void;
  onTrackActiveChange: (active: boolean) => void;
  stretch?: EgMenuStretchState;
  /** Reduce Motion 无 stretch 时仍用手势边界判定是否离开浮层。 */
  menuPanelBounds?: EgMenuPanelBounds;
};

export function useEgMenuTrackInteraction({
  disabled,
  layoutsShared,
  isItemDisabled,
  onTapItem,
  onTrackActiveChange,
  stretch,
  menuPanelBounds,
}: UseEgMenuTrackInteractionOptions) {
  const dragItemId = useSharedValue('');
  const stretchBaseX = useSharedValue(0);
  const stretchBaseY = useSharedValue(0);
  /** 本次手势是否从某一行按下开始（非空白区拉伸）。 */
  const beganOnItemRow = useSharedValue(false);
  /** 按住后跟手曾离开全部选项行（松手不再提交选中）。 */
  const leftItemRowWhileTracking = useSharedValue(false);
  /** 按住后手指曾越出 EgMenu 浮层外框（松手不再提交选中）。 */
  const leftMenuPanelWhileTracking = useSharedValue(false);
  const [hoverItemId, setHoverItemId] = useState<string | null>(null);

  const applyPressHover = useCallback(
    (itemId: string) => {
      if (isItemDisabled(itemId)) {
        setHoverItemId(null);
        return;
      }
      setHoverItemId(itemId);
    },
    [isItemDisabled],
  );

  const clearPressHover = useCallback(() => {
    setHoverItemId(null);
  }, []);

  const fireHaptic = useCallback(() => {
    triggerGlassPressHaptic();
  }, []);

  const gesture = useMemo(() => {
    const restY = (windowY: number) => {
      'worklet';
      if (!stretch) {
        return windowY;
      }
      return menuStretchUnmapY(
        windowY,
        stretch.amountX.value,
        stretch.amountY.value,
        stretch.dirY.value,
        stretch.centerY,
        stretch.width,
        stretch.height,
      );
    };
    const markPanelContainment = (absoluteX: number, absoluteY: number) => {
      'worklet';
      const bounds = resolveMenuPanelBounds(stretch, menuPanelBounds);
      if (!bounds) {
        return;
      }
      if (!fingerInMenuPanel(absoluteX, absoluteY, bounds)) {
        leftMenuPanelWhileTracking.value = true;
      }
    };
    return Gesture.Pan()
      .enabled(!disabled)
      .minDistance(0)
      .onBegin((event) => {
        'worklet';
        if (stretch) {
          cancelAnimation(stretch.amountX);
          cancelAnimation(stretch.amountY);
          stretchBaseX.value = stretch.amountX.value;
          stretchBaseY.value = stretch.amountY.value;
        }
        scheduleOnRN(onTrackActiveChange, true);
        beganOnItemRow.value = false;
        leftItemRowWhileTracking.value = false;
        leftMenuPanelWhileTracking.value = false;
        markPanelContainment(event.absoluteX, event.absoluteY);
        const hit = hitTestMenuItemAtY(restY(event.absoluteY), layoutsShared.value);
        if (!hit) {
          dragItemId.value = '';
          return;
        }
        beganOnItemRow.value = true;
        dragItemId.value = hit.itemId;
        scheduleOnRN(applyPressHover, hit.itemId);
        scheduleOnRN(fireHaptic);
      })
      .onUpdate((event) => {
        'worklet';
        markPanelContainment(event.absoluteX, event.absoluteY);
        if (stretch) {
          const tx = menuStretchClampTranslation(event.translationX, stretch.allowX);
          const ty = menuStretchClampTranslation(event.translationY, stretch.allowY);
          if (stretch.allowX !== 0) {
            stretch.dirX.value = stretch.allowX;
          } else if (Math.abs(tx) > 0.5) {
            stretch.dirX.value = Math.sign(tx);
          }
          stretch.dirY.value = stretch.allowY;
          const overflowX = menuStretchOverflow(
            event.absoluteX,
            stretch.left,
            stretch.left + stretch.width,
            stretch.allowX,
          );
          const overflowY = menuStretchOverflow(
            event.absoluteY,
            stretch.top,
            stretch.top + stretch.height,
            stretch.allowY,
          );
          stretch.amountX.value =
            stretchBaseX.value + menuStretchAmount(tx, overflowX, stretch.width, 'x');
          stretch.amountY.value =
            stretchBaseY.value + menuStretchAmount(ty, overflowY, stretch.height, 'y');
        }
        const hit = hitTestMenuItemAtY(restY(event.absoluteY), layoutsShared.value);
        if (!hit) {
          if (dragItemId.value !== '') {
            leftItemRowWhileTracking.value = true;
            dragItemId.value = '';
            scheduleOnRN(clearPressHover);
          }
          return;
        }
        if (hit.itemId !== dragItemId.value) {
          dragItemId.value = hit.itemId;
          scheduleOnRN(applyPressHover, hit.itemId);
          scheduleOnRN(fireHaptic);
        }
      })
      .onFinalize((event) => {
        'worklet';
        const hit = hitTestMenuItemAtY(restY(event.absoluteY), layoutsShared.value);
        if (stretch) {
          stretch.amountX.value = withSpring(0, menuStretchReleaseSpringConfig);
          stretch.amountY.value = withSpring(0, menuStretchReleaseSpringConfig);
        }
        dragItemId.value = '';
        scheduleOnRN(onTrackActiveChange, false);
        scheduleOnRN(setHoverItemId, null);
        const commitSelect =
          Boolean(hit) &&
          beganOnItemRow.value &&
          !leftItemRowWhileTracking.value &&
          !leftMenuPanelWhileTracking.value;
        beganOnItemRow.value = false;
        leftItemRowWhileTracking.value = false;
        leftMenuPanelWhileTracking.value = false;
        if (commitSelect && hit) {
          scheduleOnRN(onTapItem, hit.itemId);
        }
      });
  }, [
    applyPressHover,
    beganOnItemRow,
    clearPressHover,
    disabled,
    dragItemId,
    fireHaptic,
    leftItemRowWhileTracking,
    leftMenuPanelWhileTracking,
    layoutsShared,
    menuPanelBounds,
    onTapItem,
    onTrackActiveChange,
    stretch,
    stretchBaseX,
    stretchBaseY,
  ]);

  return {
    gesture,
    hoverItemId,
  };
};