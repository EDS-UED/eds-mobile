import { egNavBarNativeStackScreenOptions, shouldUseEgNavBarNativeStack } from '@eds/mobile-components';
import { useCallback } from 'react';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import {
  ShowcaseEgNavBarHeader,
  type ShowcaseEgNavBarHeaderProps,
} from '@/navigation/ShowcaseEgNavBarHeader';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

type StackScreenOptionsArgs = {
  navigation: { goBack: () => void };
};

/** 全站顶栏 = EgNavBar：iOS 26+ 系统 `UINavigationBar`，其它平台 RN `EgNavBar`（Stack `header`）。 */
export function useShowcaseStackScreenOptions() {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();

  return useCallback(
    ({ navigation }: StackScreenOptionsArgs) => {
      const shared = {
        contentStyle: { backgroundColor: colors['box-page'] as string },
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
        header: (props: Omit<ShowcaseEgNavBarHeaderProps, 'mode'>) => (
          <ShowcaseEgNavBarHeader {...props} mode={colorTheme} />
        ),
      };
    },
    [colorTheme, colors],
  );
}

/** 组件 Live 详情 — 内容延伸到顶栏下（预览区自行留顶部距离）。 */
export const showcaseComponentDetailScreenOptions = {
  headerTransparent: true,
  contentStyle: { backgroundColor: 'transparent' },
};
