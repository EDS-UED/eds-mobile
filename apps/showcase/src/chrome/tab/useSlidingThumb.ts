import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

export function useSlidingThumb(activeIndex: Ref<number>, itemCount: Ref<number>) {
  const trackRef = ref<HTMLElement | null>(null);
  /** Non-reactive: ref callbacks must not mutate reactive state every render. */
  const itemEls: (HTMLElement | null)[] = [];

  const thumb = ref({ width: 0, x: 0 });
  /** Transitions only after first layout — avoids entrance slide from 0. */
  const ready = ref(false);
  let frame = 0;

  function resolveEl(el: unknown): HTMLElement | null {
    if (!el) return null;
    if (typeof el === 'object' && el !== null && '$el' in el) {
      return (el as { $el: HTMLElement }).$el;
    }
    return el as HTMLElement;
  }

  function setItemRef(index: number) {
    return (el: unknown) => {
      itemEls[index] = resolveEl(el);
    };
  }

  function applyThumb(width: number, x: number) {
    const prev = thumb.value;
    if (Math.abs(prev.width - width) < 0.5 && Math.abs(prev.x - x) < 0.5) {
      return;
    }
    thumb.value = { width, x };
  }

  function updateThumb() {
    const track = trackRef.value;
    const active = itemEls[activeIndex.value];
    if (!track || !active) {
      applyThumb(0, 0);
      return;
    }
    const trackRect = track.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    applyThumb(activeRect.width, activeRect.left - trackRect.left);
    if (!ready.value && activeRect.width > 0) {
      // Next frame so the first paint is already at the correct position.
      requestAnimationFrame(() => {
        ready.value = true;
      });
    }
  }

  function scheduleUpdate() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(updateThumb);
  }

  let resizeObserver: ResizeObserver | undefined;

  onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    watch(
      trackRef,
      (track, prev) => {
        if (prev && resizeObserver) resizeObserver.unobserve(prev);
        if (track && resizeObserver) resizeObserver.observe(track);
        scheduleUpdate();
      },
      { immediate: true },
    );

    watch([activeIndex, itemCount], () => nextTick(scheduleUpdate), { immediate: true });
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
  });

  const thumbStyle = computed(() => ({
    width: thumb.value.width ? `${thumb.value.width}px` : '0px',
    transform: `translateX(${thumb.value.x}px)`,
  }));

  return { trackRef, setItemRef, thumbStyle, ready };
}
