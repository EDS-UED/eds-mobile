import { edsFontAssets } from '@eds/mobile-tokens/fonts-native';

/**
 * Paths for expo-font config plugin — Android release / dev client 须在原生侧注册 face，
 * 否则 TabBar / NavBar 等早期挂载的 Text 可能回落系统字。
 */
export const showcaseEmbeddedFontPaths = [
  '../../packages/tokens/assets/fonts/EDSText-Regular.ttf',
  '../../packages/tokens/assets/fonts/EDSText-Medium.ttf',
  '../../packages/tokens/assets/fonts/EDSText-SemiBold.ttf',
  '../../packages/tokens/assets/fonts/EDSText-Bold.ttf',
  '../../packages/tokens/assets/fonts/IBMPlexMono-Regular.ttf',
  '../../packages/tokens/assets/fonts/IBMPlexMono-Medium.ttf',
  '../../packages/tokens/assets/fonts/IBMPlexMono-SemiBold.ttf',
  '../../packages/tokens/assets/fonts/IBMPlexMono-Bold.ttf',
] as const;

/** Runtime `useFonts` —与 plugin 注册的 PostScript 名一致。 */
export function showcaseRuntimeFontAssets(): Record<string, number> {
  return edsFontAssets;
}