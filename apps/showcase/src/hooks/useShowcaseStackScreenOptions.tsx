import { egNavBarNativeStackScreenOptions, shouldUseEgNavBarNativeStack } from '@eds/mobile-components';
import { useCallback } from 'react';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

type StackScreenOptionsArgs = {
  navigation: { goBack: () => void };
};

/** 全站 Stack — iOS 26+ 系统栏；RN `headerShown: false`（各页自挂浮层 `EgNavBar`）。 */
export function useShowcaseStackScreenOptions() {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();

  return useCallback(
    ({ navigation }: StackScreenOptionsArgs) => {
      const shared = {
        contentStyle: { backgroundColor: showcasePageBackgroundColor(colors) },
        statusBarTranslucent: true,
        statusBarBackgroundColor: 'transparent',
      };

      if (shouldUseEgNavBarNativeStack()) {
        return {
          ...shared,
          ...egNavBarNativeStackScreenOptions({ mode: colorTheme, onBack: () => navigation.goBack() }),
        };
      }

      return {
        ...shared,
        ...showcaseRnHiddenStackHeaderOptions,
      };
    },
    [colorTheme, colors],
  );
}

/** 组件 Live 详情 — 透明内容区；顶栏仍走 EgNavBar 方案。 */
export const showcaseComponentDetailScreenOptions = {
  contentStyle: { backgroundColor: 'transparent' },
};