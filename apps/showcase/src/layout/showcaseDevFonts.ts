import { edsFontAssets } from '@eds/mobile-tokens/fonts-native';

/**
 * Dev / 刷新：少载字体（正文 + 标题 + 等宽代码页再补全）。
 * 设 `EXPO_PUBLIC_SHOWCASE_FULL_FONTS=1` 与生产一致。
 */
export function resolveShowcaseFontAssets(): Record<string, number> {
  if (process.env.EXPO_PUBLIC_SHOWCASE_FULL_FONTS === '1') {
    return edsFontAssets;
  }

  if (!__DEV__) {
    return edsFontAssets;
  }

  return {
    'EDSText-Regular': edsFontAssets['EDSText-Regular'],
    'EDSText-Medium': edsFontAssets['EDSText-Medium'],
    'EDSText-SemiBold': edsFontAssets['EDSText-SemiBold'],
    'EDSText-Bold': edsFontAssets['EDSText-Bold'],
  };
}
