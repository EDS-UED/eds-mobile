/**
 * @deprecated Use `useShowcaseStackScreenOptions()` from `@/hooks/useShowcaseStackScreenOptions`.
 */
export {
  showcaseDetailScreenOptions,
  showcaseHomeScreenOptions,
  useShowcaseStackScreenOptions as useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';

import mobileTheme from '@eds/mobile-tokens/theme';
import { Platform } from 'react-native';

import { isIOS26OrLater } from '@/navigation/iosPlatform';

const colors = mobileTheme.colors.light;

const iosNativeHeader =
  Platform.OS === 'ios'
    ? {
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: 'transparent',
        },
        ...(isIOS26OrLater
          ? {
              scrollEdgeEffects: {
                top: 'automatic' as const,
              },
            }
          : {
              headerBlurEffect: 'systemMaterial' as const,
            }),
      }
    : {};

/** @deprecated Light-only — use `useShowcaseStackScreenOptions()`. */
export const showcaseStackScreenOptions = {
  contentStyle: { backgroundColor: colors.page as string },
  headerBackButtonDisplayMode: 'minimal' as const,
  headerBackTitleVisible: false,
  headerTintColor: colors['text-base-primary'] as string,
  headerTitleStyle: {
    color: colors['text-base-primary'] as string,
  },
  headerLargeTitleStyle: {
    color: colors['text-base-primary'] as string,
  },
  ...iosNativeHeader,
};
