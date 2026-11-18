import { EgSegmentedControl, type EgPageScrollViewHandle } from '@eds/mobile-components';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

const HOME_SEGMENTS = ['动效', '动画'] as const;

type ScrollPreserveApi = {
  readY: () => number;
  readScrollEdgeActive: () => boolean;
  readCardsAnchorY: () => number | null;
  setCardsAnchorY: (y: number) => void;
  restore: (y: number) => void;
};

type AnimationsHomeSegmentContextValue = {
  segmentIndex: number;
  selectSegmentFromNav: (index: number) => void;
  selectSegmentFromInline: (index: number) => void;
  preserveRef: MutableRefObject<ScrollPreserveApi | null>;
};

const AnimationsHomeSegmentContext = createContext<AnimationsHomeSegmentContextValue | null>(null);

export function AnimationsHomeSegmentProvider({ children }: { children: ReactNode }) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const preserveRef = useRef<ScrollPreserveApi | null>(null);

  const selectSegmentFromNav = useCallback((index: number) => {
    setSegmentIndex(index);
    const api = preserveRef.current;
    if (!api?.readScrollEdgeActive()) {
      return;
    }
    const cardsY = api.readCardsAnchorY();
    const target = cardsY != null ? Math.max(api.readY(), cardsY) : api.readY();
    if (target > 0) {
      requestAnimationFrame(() => api.restore(target));
    }
  }, []);

  const selectSegmentFromInline = useCallback((index: number) => {
    setSegmentIndex(index);
  }, []);

  const value = useMemo(
    () => ({ segmentIndex, selectSegmentFromNav, selectSegmentFromInline, preserveRef }),
    [segmentIndex, selectSegmentFromInline, selectSegmentFromNav],
  );

  return <AnimationsHomeSegmentContext.Provider value={value}>{children}</AnimationsHomeSegmentContext.Provider>;
}

export function useAnimationsHomeSegment() {
  const ctx = useContext(AnimationsHomeSegmentContext);
  if (!ctx) {
    throw new Error('useAnimationsHomeSegment must be used within AnimationsHomeSegmentProvider');
  }
  return ctx;
}

/** 栏内标题 — 稳定组件引用；滚入栏下后点击切档 → 视口对齐卡片区。 */
export function AnimationsHomeNavSegment() {
  const { segmentIndex, selectSegmentFromNav } = useAnimationsHomeSegment();
  const { colorTheme } = useShowcaseThemeContext();

  return (
    <EgSegmentedControl
      segments={[...HOME_SEGMENTS]}
      selectedIndex={segmentIndex}
      onSelect={selectSegmentFromNav}
      widthMode="hug"
      mode={colorTheme}
      testID="animations-home-segment-nav"
    />
  );
}

/** 动效首页 — 副文案下、左缘与 Tab 副文案同 28px。 */
export function AnimationsHomeInlineSegment({ testID }: { testID: string }) {
  const { segmentIndex, selectSegmentFromInline } = useAnimationsHomeSegment();
  const { colorTheme } = useShowcaseThemeContext();

  return (
    <EgSegmentedControl
      segments={[...HOME_SEGMENTS]}
      selectedIndex={segmentIndex}
      onSelect={selectSegmentFromInline}
      widthMode="hug"
      mode={colorTheme}
      testID={testID}
    />
  );
}

export function useAnimationsHomeScrollPreserve(
  scrollRef: RefObject<EgPageScrollViewHandle | null>,
  scrollEdgeActive: boolean,
  onScrollFromNav?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
) {
  const { preserveRef } = useAnimationsHomeSegment();
  const yRef = useRef(0);
  const scrollEdgeActiveRef = useRef(scrollEdgeActive);
  const cardsAnchorYRef = useRef<number | null>(null);

  scrollEdgeActiveRef.current = scrollEdgeActive;

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      yRef.current = event.nativeEvent.contentOffset.y;
      onScrollFromNav?.(event);
    },
    [onScrollFromNav],
  );

  const onCardsSectionLayout = useCallback((y: number) => {
    cardsAnchorYRef.current = y;
    preserveRef.current?.setCardsAnchorY(y);
  }, [preserveRef]);

  useEffect(() => {
    preserveRef.current = {
      readY: () => yRef.current,
      readScrollEdgeActive: () => scrollEdgeActiveRef.current,
      readCardsAnchorY: () => cardsAnchorYRef.current,
      setCardsAnchorY: (y) => {
        cardsAnchorYRef.current = y;
      },
      restore: (y) => scrollRef.current?.scrollTo({ y, animated: false }),
    };
    return () => {
      preserveRef.current = null;
    };
  }, [preserveRef, scrollRef]);

  return { onScroll, onCardsSectionLayout };
}