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
  menuStretchReleaseSpringConfig,
  menuStretchUnmapY,
} from '../../../../shared/motion/menuMotion.js';
import { hitTestMenuItemAtY, type EgMenuItemHitRect } from './egMenuItemHitTest.js';

const TAP_SLOP_PX = 8;

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
  /** 可拉伸方向（`menuStretchAllowance`）：x 1 仅右 · −1 仅左 · 0 左右；y 1 仅下 · −1 仅上。 */
  allowX: -1 | 0 | 1;
  allowY: -1 | 1;
};

type UseEgMenuTrackInteractionOptions = {
  disabled: boolean;
  layoutsShared: ReturnType<typeof useSharedValue<EgMenuItemHitRect[]>>;
  isItemDisabled: (itemId: string) => boolean;
  onSlideItem: (itemId: string) => void;
  onTapItem: (itemId: string) => void;
  onTrackActiveChange: (active: boolean) => void;
  stretch?: EgMenuStretchState;
};

export function useEgMenuTrackInteraction({
  disabled,
  layoutsShared,
  isItemDisabled,
  onSlideItem,
  onTapItem,
  onTrackActiveChange,
  stretch,
}: UseEgMenuTrackInteractionOptions) {
  const dragItemId = useSharedValue('');
  const stretchBaseX = useSharedValue(0);
  const stretchBaseY = useSharedValue(0);
  const [hoverItemId, setHoverItemId] = useState<string | null>(null);

  const applySlide = useCallback(
    (itemId: string) => {
      if (isItemDisabled(itemId)) {
        return;
      }
      onSlideItem(itemId);
      setHoverItemId(itemId);
    },
    [isItemDisabled, onSlideItem],
  );

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
        stretch.amountY.value,
        stretch.dirY.value,
        stretch.centerY,
        stretch.height,
      );
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
        const hit = hitTestMenuItemAtY(restY(event.absoluteY), layoutsShared.value);
        if (!hit) {
          return;
        }
        dragItemId.value = hit.itemId;
        scheduleOnRN(applySlide, hit.itemId);
        scheduleOnRN(fireHaptic);
      })
      .onUpdate((event) => {
        'worklet';
        if (stretch) {
          const tx = menuStretchClampTranslation(event.translationX, stretch.allowX);
          const ty = menuStretchClampTranslation(event.translationY, stretch.allowY);
          if (stretch.allowX !== 0) {
            stretch.dirX.value = stretch.allowX;
          } else if (Math.abs(tx) > 0.5) {
            stretch.dirX.value = Math.sign(tx);
          }
          stretch.dirY.value = stretch.allowY;
          stretch.amountX.value = stretchBaseX.value + menuStretchAmount(tx, stretch.width, 'x');
          stretch.amountY.value = stretchBaseY.value + menuStretchAmount(ty, stretch.height, 'y');
        }
        const hit = hitTestMenuItemAtY(restY(event.absoluteY), layoutsShared.value);
        if (!hit) {
          return;
        }
        if (hit.itemId !== dragItemId.value) {
          dragItemId.value = hit.itemId;
          scheduleOnRN(applySlide, hit.itemId);
          scheduleOnRN(fireHaptic);
        }
      })
      .onFinalize((event) => {
        'worklet';
        const moved = Math.hypot(event.translationX, event.translationY);
        const hit = hitTestMenuItemAtY(restY(event.absoluteY), layoutsShared.value);
        if (stretch) {
          stretch.amountX.value = withSpring(0, menuStretchReleaseSpringConfig);
          stretch.amountY.value = withSpring(0, menuStretchReleaseSpringConfig);
        }
        dragItemId.value = '';
        scheduleOnRN(onTrackActiveChange, false);
        scheduleOnRN(setHoverItemId, null);
        if (moved < TAP_SLOP_PX && hit) {
          scheduleOnRN(onTapItem, hit.itemId);
        }
      });
  }, [
    applySlide,
    disabled,
    dragItemId,
    fireHaptic,
    layoutsShared,
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
