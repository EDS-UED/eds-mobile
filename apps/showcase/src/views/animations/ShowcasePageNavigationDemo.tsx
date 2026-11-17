import {
  createEgPageNavigator,
  EgEdsAnimaPress,
  EgNavBar,
  EgPageShot,
  EgPageShotTrigger,
  egNavBarScrollContentReserve,
  egPageScreenOptions,
  shouldUseEgPageNativeStack,
  useEgNavBarScroll,
  type EgPageDirection,
  type EgPageShotPageApi,
  type EgPageShotRootApi,
  type EgPageShotSource,
} from '@eds/mobile-components';
import { EgEdsAnimaOverlayModal, PageStackDemoPage } from '@eds/mobile-components/preview/motion';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type PageParams = { title: string; depth: number };
type StackParams = { Launcher: undefined; Page: PageParams };

const Stack = createEgPageNavigator<StackParams>();
const MAX_DEPTH = 3;
const ROOT_ROWS = ['订单详情', '回调记录', '操作日志'];

const ExitContext = createContext<() => void>(() => {});

/** 透明底页 · 呈现后推入根页；回到 Launcher（仅余 Launcher 路由）时关闭演示。 */
function LauncherScreen({ navigation }: NativeStackScreenProps<StackParams, 'Launcher'>) {
  const exit = useContext(ExitContext);
  useEffect(() => {
    let pushed = false;
    const pushRoot = () => {
      if (pushed) return;
      pushed = true;
      navigation.push('Page', { title: '列表', depth: 0 });
    };

    const offFocus = navigation.addListener('focus', () => {
      const routes = navigation.getState().routes;
      if (routes.length === 1 && routes[0]?.name === 'Launcher' && pushed) {
        exit();
      }
    });

    const offEnd = navigation.addListener('transitionEnd', (event) => {
      if (event.data.closing) return;
      pushRoot();
    });

    const frame = requestAnimationFrame(pushRoot);

    return () => {
      offFocus();
      offEnd();
      cancelAnimationFrame(frame);
    };
  }, [exit, navigation]);
  return null;
}

function PageScreen({ navigation, route }: NativeStackScreenProps<StackParams, 'Page'>) {
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const nativePage = shouldUseEgPageNativeStack();
  const scrollTopInset = nativePage ? 0 : egNavBarScrollContentReserve(insets.top);
  const navScroll = useEgNavBarScroll({ nativeScrollEdge: false });
  const { title, depth } = route.params;
  const exit = useContext(ExitContext);

  useLayoutEffect(() => {
    if (nativePage) return;
    navigation.setOptions({
      header: ({
        options,
        back,
        navigation: nav,
      }: {
        options: { title?: string };
        back?: unknown;
        navigation: { goBack: () => void };
      }) => (
        <EgNavBar
          title={options.title ?? title}
          showLeft={back != null}
          showTitle
          background="auto"
          scrollOffset={navScroll.scrollOffset}
          mode="light"
          chromeContext="overlay"
          left={{
            kind: 'icon',
            icon: 'eds-arrow-left-ios',
            accessibilityLabel: '返回',
            onPress: () => nav.goBack(),
          }}
        />
      ),
    } as object);
  }, [nativePage, navScroll.scrollOffset, navigation, title]);
  useEffect(() => {
    if (depth !== 0) return;
    return navigation.addListener('transitionEnd', (event) => {
      if (!event.data.closing) return;
      if (navigation.getState().routes.some((item) => item.key === route.key)) return;
      exit();
    });
  }, [depth, exit, navigation, route.key]);
  const rows =
    depth >= MAX_DEPTH - 1 ? [] : depth === 0 ? ROOT_ROWS : [`${title} · 下一层`];

  return (
    <EgPageShot
      mode="light"
      title={(_source: EgPageShotSource, pageKey: string | null) => pageKey ?? `${title} · 弹层`}
      renderRoot={(api: EgPageShotRootApi) => (
        <PageStackDemoPage
          mode="light"
          title={`${title} · 弹层`}
          backLabel="关闭"
          topInset={api.scrollTopInset}
          contentInsetAdjustmentBehavior={api.contentInsetAdjustmentBehavior}
          showHeader={false}
          rows={['相关文章', '开发者信息']}
          onBack={api.close}
          onPush={api.push}
        />
      )}
      renderPage={(api: EgPageShotPageApi) => (
        <PageStackDemoPage
          mode="light"
          title={api.pageKey}
          backLabel="‹ 返回"
          topInset={api.scrollTopInset}
          contentInsetAdjustmentBehavior={api.contentInsetAdjustmentBehavior}
          showHeader={false}
          rows={api.canPush ? [`${api.pageKey} · 下一层`] : []}
          onBack={api.back}
          onPush={api.push}
        />
      )}
    >
      <PageStackDemoPage
        mode="light"
        title={title}
        backLabel="返回"
        topInset={scrollTopInset}
        contentInsetAdjustmentBehavior={nativePage ? 'automatic' : 'never'}
        showHeader={false}
        rows={rows}
        onScroll={navScroll.onScroll}
        scrollEventThrottle={navScroll.scrollEventThrottle}
        onBack={() => navigation.goBack()}
        onPush={(next) => navigation.push('Page', { title: next, depth: depth + 1 })}
        footer={
          <EgPageShotTrigger id="nested-shot" radius="capsule" morph>
            <View style={[styles.shotTrigger, { backgroundColor: colors.brand as string }]}>
              <Text style={[styles.triggerLabel, { color: colors['text-same-white'] as string }]}>
                打开弹层（page-shot）
              </Text>
            </View>
          </EgPageShotTrigger>
        }
      />
    </EgPageShot>
  );
}

/**
 * EgPage · `createEgPageNavigator` + `screenOptions={egPageScreenOptions({ direction, dragDismiss })}` · 每屏内容 `EgPage`（经 `PageStackDemoPage` 演示）。
 * iOS 26+ 系统 NavBar + 系统转场，其余 EDS page 弹簧 + EgNavBar。每页可嵌套 page-shot。
 * 演示挂在 `EgEdsAnimaOverlayModal`（iOS 26+ RNS transparentModal · 其余 RN Modal）；RN 栈须 `detachInactiveScreens={false}`（RN Modal 内 react-native-screens `Screen` 不接点按）。
 */
export function ShowcasePageNavigationDemo({
  direction = 'horizontal',
  dragDismiss = true,
}: {
  direction?: EgPageDirection;
  /** 按住页面拖拽返回；关闭后仅点按返回。 */
  dragDismiss?: boolean;
}) {
  const colors = useShowcaseColors();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const pageBackground = { backgroundColor: colors.page as string };

  return (
    <View style={styles.root}>
      <EgEdsAnimaPress
        onPress={() => setOpen(true)}
        style={[styles.trigger, { backgroundColor: colors.brand as string }]}
      >
        <Text style={[styles.triggerLabel, { color: colors['text-same-white'] as string }]}>
          打开全屏页面
        </Text>
      </EgEdsAnimaPress>

      <EgEdsAnimaOverlayModal visible={open} onRequestClose={close}>
          <GestureHandlerRootView style={styles.overlayFill}>
            <ExitContext.Provider value={close}>
              <NavigationIndependentTree>
                <NavigationContainer
                  theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } }}
                >
                  <Stack.Navigator
                    {...({ detachInactiveScreens: false } as object)}
                    screenOptions={egPageScreenOptions({ direction, dragDismiss, mode: 'light' })}
                  >
                    <Stack.Screen
                      name="Launcher"
                      options={
                        {
                          headerShown: false,
                          contentStyle: { backgroundColor: 'transparent' },
                          cardStyle: { backgroundColor: 'transparent' },
                        } as object
                      }
                    >
                      {(props: NativeStackScreenProps<StackParams, 'Launcher'>) => (
                        <LauncherScreen {...props} />
                      )}
                    </Stack.Screen>
                    <Stack.Screen
                      name="Page"
                      component={PageScreen}
                      options={({ route }: { route: { params: PageParams } }) =>
                        ({
                          title: route.params.title,
                          cardOverlayEnabled: route.params.depth > 0,
                          contentStyle: pageBackground,
                          cardStyle: pageBackground,
                        }) as object
                      }
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </NavigationIndependentTree>
            </ExitContext.Provider>
          </GestureHandlerRootView>
      </EgEdsAnimaOverlayModal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
  overlayFill: {
    flex: 1,
  },
  trigger: {
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    borderRadius: theme.radius.full,
  },
  shotTrigger: {
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    borderRadius: theme.radius.full,
  },
  triggerLabel: {
    ...edsTokenFont('body-large', '600'),
  },
});
