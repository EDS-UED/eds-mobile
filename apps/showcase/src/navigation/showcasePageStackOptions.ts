import { egPageScreenOptions, type ThemeMode } from '@eds/mobile-components';

type ShowcasePageStackArgs = {
  navigation: { goBack: () => void };
  route: { key?: string; name?: string };
};

function resolveRouteKey(route: ShowcasePageStackArgs['route']): string {
  return route.key ?? route.name ?? 'showcase-route';
}

/** Expo Router JS Stack — motion-page 转场（无栈内 header，与自挂 EgNavBar 并用）。 */
export function showcaseEgPageJsOptions(mode: ThemeMode) {
  const factory = egPageScreenOptions({
    jsStack: true,
    stackHeader: 'none',
    mode,
    dragDismiss: true,
  });
  return (args: ShowcasePageStackArgs) =>
    factory({ navigation: args.navigation, route: { key: resolveRouteKey(args.route) } });
}

/** Expo Router native Stack（iOS 26+）— 系统 UINavigationBar + 系统 push / pop。 */
export function showcaseEgPageNativeOptions(mode: ThemeMode) {
  const factory = egPageScreenOptions({
    mode,
    dragDismiss: true,
  });
  return (args: ShowcasePageStackArgs) =>
    factory({ navigation: args.navigation, route: { key: resolveRouteKey(args.route) } });
}