import { useCallback, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { triggerGlassPressHaptic } from '../../../../atoms/glass/glassPressHaptic.js';
import { hitTestMenuItemAtY, type EgMenuItemHitRect } from './egMenuItemHitTest.js';

const TAP_SLOP_PX = 8;

type UseEgMenuTrackInteractionOptions = {
  disabled: boolean;
  layoutsShared: ReturnType<typeof useSharedValue<EgMenuItemHitRect[]>>;
  isItemDisabled: (itemId: string) => boolean;
  onSlideItem: (itemId: string) => void;
  onTapItem: (itemId: string) => void;
  onTrackActiveChange: (active: boolean) => void;
};

export function useEgMenuTrackInteraction({
  disabled,
  layoutsShared,
  isItemDisabled,
  onSlideItem,
  onTapItem,
  onTrackActiveChange,
}: UseEgMenuTrackInteractionOptions) {
  const dragItemId = useSharedValue('');
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
    return Gesture.Pan()
      .enabled(!disabled)
      .minDistance(0)
      .onBegin((event) => {
        'worklet';
        scheduleOnRN(onTrackActiveChange, true);
        const hit = hitTestMenuItemAtY(event.absoluteY, layoutsShared.value);
        if (!hit) {
          return;
        }
        dragItemId.value = hit.itemId;
        scheduleOnRN(applySlide, hit.itemId);
        scheduleOnRN(fireHaptic);
      })
      .onUpdate((event) => {
        'worklet';
        const hit = hitTestMenuItemAtY(event.absoluteY, layoutsShared.value);
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
        const hit = hitTestMenuItemAtY(event.absoluteY, layoutsShared.value);
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
  ]);

  return {
    gesture,
    hoverItemId,
  };
};
