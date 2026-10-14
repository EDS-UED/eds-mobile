import { useMemo } from 'react';
import { Platform } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { isIOS26OrLater } from '@/navigation/iosPlatform';

const iosNativeHeader =
  Platform.OS === 'ios'
    ? {
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
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

/** Native stack options — page background & header tint follow system light/dark. */
export function useShowcaseStackScreenOptions() {
  const colors = useShowcaseColors();

  return useMemo(() => {
    const pageBg = colors['box-page'] as string;

    return {
      contentStyle: { backgroundColor: pageBg },
      statusBarTranslucent: true,
      statusBarBackgroundColor: 'transparent',
      headerBackButtonDisplayMode: 'minimal' as const,
      headerBackTitleVisible: false,
      headerTintColor: colors['text-base-primary'] as string,
      headerTitleStyle: {
        color: colors['text-base-primary'] as string,
      },
      headerLargeTitleStyle: {
        color: colors['text-base-primary'] as string,
      },
      ...(isIOS26OrLater
        ? {}
        : {
            headerLargeStyle: {
              backgroundColor: pageBg,
            },
          }),
      ...iosNativeHeader,
    };
  }, [colors]);
}

export const showcaseHomeScreenOptions =
  Platform.OS === 'ios' ? { headerLargeTitleEnabled: true as const } : {};

export const showcaseDetailScreenOptions = { headerLargeTitleEnabled: false as const };

/** 组件 Live 详情 — 透明导航栏 + Card Shallow 延伸至状态栏下（系统栏无独立底色）。 */
export const showcaseComponentDetailScreenOptions = {
  headerLargeTitleEnabled: false as const,
  headerTransparent: true,
  headerStyle: { backgroundColor: 'transparent' },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: 'transparent' },
  statusBarTranslucent: true,
  statusBarBackgroundColor: 'transparent',
  ...(Platform.OS === 'ios'
    ? {
        headerLargeTitleShadowVisible: false,
        ...(isIOS26OrLater ? { scrollEdgeEffects: { top: 'automatic' as const } } : {}),
      }
    : {}),
};
