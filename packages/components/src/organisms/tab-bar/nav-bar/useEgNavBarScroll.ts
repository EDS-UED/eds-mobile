import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

type ScrollEventLike = { nativeEvent: { contentOffset: { y: number } } };

/**
 * `background="auto"` 的滚动驱动 — 展开到任意 `ScrollView` / `FlatList`：
 * `<ScrollView onScroll={onScroll} scrollEventThrottle={scrollEventThrottle} />`
 */
export function useEgNavBarScroll() {
  const scrollOffset = useSharedValue(0);
  const onScroll = useCallback(
    (event: ScrollEventLike) => {
      scrollOffset.value = event.nativeEvent.contentOffset.y;
    },
    [scrollOffset],
  );
  return { scrollOffset, onScroll, scrollEventThrottle: 16 as const };
}
