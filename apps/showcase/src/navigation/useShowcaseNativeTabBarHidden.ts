import { useEffect, useRef, useState } from 'react';

import { shouldHideShowcaseTabBar } from '@/navigation/tabBarVisibility';

/**
 * NativeTabs `hidden` 与路由同帧切换易触发 iOS 原生 Tab 控制器崩溃。
 * 显示：立即；隐藏：延后一帧提交，避免与 tab 点击 / pop 竞态。
 */
export function useShowcaseNativeTabBarHidden(pathname: string, segments: string[]) {
  const shouldHide = shouldHideShowcaseTabBar(pathname, segments);
  const [hidden, setHidden] = useState(shouldHide);
  const shouldHideRef = useRef(shouldHide);
  shouldHideRef.current = shouldHide;

  useEffect(() => {
    if (!shouldHide) {
      setHidden(false);
      return;
    }
    const frame = requestAnimationFrame(() => {
      if (shouldHideRef.current) {
        setHidden(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [shouldHide]);

  return hidden;
}
