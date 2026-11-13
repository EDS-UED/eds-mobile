import { useCallback, useEffect, useRef, useState } from 'react';

import { resolveMotionLayoutContentSwapMs } from './layoutContentMotionTokens.js';

export type MotionLayoutContentSwitch = {
  contentExiting: boolean;
  contentEntering: boolean;
  isAnimating: boolean;
  switchContent: (onSwap: () => void) => void;
  whenIdle: () => Promise<void>;
  reset: () => void;
};

/** 同壳内容切换 · crossfade 状态机（对齐 Desktop `useMotionLayoutContentSwitch`）。 */
export function useMotionLayoutContentSwitch(
  swapMs: number = resolveMotionLayoutContentSwapMs(),
): MotionLayoutContentSwitch {
  const [contentExiting, setContentExiting] = useState(false);
  const [contentEntering, setContentEntering] = useState(false);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enterFrameRef = useRef(0);
  const idleResolversRef = useRef<Array<() => void>>([]);

  const clearSwapTimer = useCallback(() => {
    if (swapTimerRef.current !== undefined) {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = undefined;
    }
  }, []);

  const clearEnterFrame = useCallback(() => {
    if (enterFrameRef.current) {
      cancelAnimationFrame(enterFrameRef.current);
      enterFrameRef.current = 0;
    }
  }, []);

  const notifyIdle = useCallback(() => {
    if (contentExiting || contentEntering) {
      return;
    }
    const pending = idleResolversRef.current;
    idleResolversRef.current = [];
    pending.forEach((resolve) => resolve());
  }, [contentEntering, contentExiting]);

  const reset = useCallback(() => {
    clearSwapTimer();
    clearEnterFrame();
    setContentExiting(false);
    setContentEntering(false);
    idleResolversRef.current = [];
  }, [clearEnterFrame, clearSwapTimer]);

  const whenIdle = useCallback((): Promise<void> => {
    if (!contentExiting && !contentEntering) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      idleResolversRef.current.push(resolve);
    });
  }, [contentEntering, contentExiting]);

  const switchContent = useCallback(
    (onSwap: () => void) => {
      clearSwapTimer();
      clearEnterFrame();
      setContentEntering(false);
      setContentExiting(true);

      swapTimerRef.current = setTimeout(() => {
        onSwap();
        setContentExiting(false);
        setContentEntering(true);

        enterFrameRef.current = requestAnimationFrame(() => {
          setContentEntering(false);
          enterFrameRef.current = 0;
          notifyIdle();
        });

        swapTimerRef.current = undefined;
      }, swapMs);
    },
    [clearEnterFrame, clearSwapTimer, notifyIdle, swapMs],
  );

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return {
    contentExiting,
    contentEntering,
    isAnimating: contentExiting || contentEntering,
    switchContent,
    whenIdle,
    reset,
  };
}
