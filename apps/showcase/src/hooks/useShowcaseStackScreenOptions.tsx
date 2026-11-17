import { shouldUseEgPageNativeStack } from '@eds/mobile-components';
import { useCallback } from 'react';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import {
  showcaseEgPageJsOptions,
  showcaseEgPageNativeOptions,
} from '@/navigation/showcasePageStackOptions';
import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

type StackScreenOptionsArgs = {
  navigation: { goBack: () => void };
  route: { key?: string; name?: string };
};

/** 各 Tab 内 Stack — iOS 26+ 原生 motion-page；其余 expo-router/js-stack + EDS page 弹簧。 */
export function useShowcaseStackScreenOptions() {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const nativePage = shouldUseEgPageNativeStack();
  const nativePageOptions = showcaseEgPageNativeOptions(colorTheme);
  const jsPageOptions = showcaseEgPageJsOptions(colorTheme);

  return useCallback(
    (args: StackScreenOptionsArgs) => {
      const shared = {
        contentStyle: { backgroundColor: showcasePageBackgroundColor(colors) },
        statusBarTranslucent: true,
        statusBarBackgroundColor: 'transparent',
      };

      if (nativePage) {
        return {
          ...shared,
          ...nativePageOptions(args),
        };
      }

      const motion = jsPageOptions(args);
      return {
        ...shared,
        ...motion,
        ...showcaseRnHiddenStackHeaderOptions,
      };
    },
    [colorTheme, colors, jsPageOptions, nativePage, nativePageOptions],
  ) as (props: StackScreenOptionsArgs & { theme?: unknown }) => object;
}

/** 组件 Live 详情 — 透明内容区；顶栏仍走 EgNavBar 方案。 */
export const showcaseComponentDetailScreenOptions = {
  contentStyle: { backgroundColor: 'transparent' },
};