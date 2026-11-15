import { showcaseRuntimeFontAssets } from '@/layout/showcaseFontAssets';

/**
 * Dev / 刷新：少载字体（正文 + 标题 + 等宽代码页再补全）。
 * 设 `EXPO_PUBLIC_SHOWCASE_FULL_FONTS=1` 与生产一致。
 */
export function resolveShowcaseFontAssets(): Record<string, number> {
  const all = showcaseRuntimeFontAssets();
  if (process.env.EXPO_PUBLIC_SHOWCASE_FULL_FONTS === '1') {
    return all;
  }

  if (!__DEV__) {
    return all;
  }

  return {
    'EDSText-Regular': all['EDSText-Regular'],
    'EDSText-Medium': all['EDSText-Medium'],
    'EDSText-SemiBold': all['EDSText-SemiBold'],
    'EDSText-Bold': all['EDSText-Bold'],
  };
}
