import {
  createEgEdsAnimaPageNavigator,
  EgEdsAnimaPage,
  EgEdsAnimaPageShot,
  EgEdsAnimaPageShotTrigger,
  EgEdsAnimaPress,
  shouldUseEgEdsAnimaNativePage,
  type EgEdsAnimaPageDirection,
} from '@eds/mobile-components';
import { EgEdsAnimaOverlayModal, PageStackDemoPage } from '@eds/mobile-components/preview/motion';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type PageParams = { title: string; depth: number };
type StackParams = { Launcher: undefined; Page: PageParams };

const Stack = createEgEdsAnimaPageNavigator<StackParams>();
const MAX_DEPTH = 3;
const ROOT_ROWS = ['订单详情', '回调记录', '操作日志'];

const ExitContext = createContext<() => void>(() => {});

/** 透明底页 · 挂载即推入根页（根页亦走 page 动效）；根页出栈后关闭演示。 */
function LauncherScreen({ navigation }: NativeStackScreenProps<StackParams, 'Launcher'>) {
  const exit = useContext(ExitContext);
  useEffect(() => {
    const native = shouldUseEgEdsAnimaNativePage();
    let covered = false;
    const offBlur = navigation.addListener('blur', () => {
      covered = true;
    });
    // 原生栈：浮层呈现后（Launcher 首次出现）再推入根页，系统 push 才有转场；
    // 根页出栈后其监听已卸载，由重新露出的 Launcher 关闭演示（否则透明浮层残留挡住点按）。
    const offEnd = navigation.addListener('transitionEnd', (event) => {
      if (event.data.closing) return;
      if (covered) exit();
      else if (native) navigation.push('Page', { title: '列表', depth: 0 });
    });
    if (!native) navigation.push('Page', { title: '列表', depth: 0 });
    return () => {
      offBlur();
      offEnd();
    };
  }, [exit, navigation]);
  return null;
}

function PageScreen({ navigation, route }: NativeStackScreenProps<StackParams, 'Page'>) {
  const colors = useShowcaseColors();
  const { title, depth } = route.params;
  const exit = useContext(ExitContext);
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
    <EgEdsAnimaPageShot
      mode="light"
      title={(_source, pageKey) => pageKey ?? `${title} · 弹层`}
      renderRoot={(api) => (
        <PageStackDemoPage
          mode="light"
          title={`${title} · 弹层`}
          backLabel="关闭"
          topInset={api.scrollTopInset}
          showHeader={false}
          rows={['相关文章', '开发者信息']}
          onBack={api.close}
          onPush={api.push}
        />
      )}
      renderPage={(api) => (
        <PageStackDemoPage
          mode="light"
          title={api.pageKey}
          backLabel="‹ 返回"
          topInset={api.scrollTopInset}
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
        topInset={0}
        showHeader={false}
        rows={rows}
        onBack={() => navigation.goBack()}
        onPush={(next) => navigation.push('Page', { title: next, depth: depth + 1 })}
        footer={
          <EgEdsAnimaPageShotTrigger id="nested-shot" radius="capsule" morph>
            <View style={[styles.shotTrigger, { backgroundColor: colors.brand as string }]}>
              <Text style={[styles.triggerLabel, { color: colors['text-same-white'] as string }]}>
                打开弹层（page-shot）
              </Text>
            </View>
          </EgEdsAnimaPageShotTrigger>
        }
      />
    </EgEdsAnimaPageShot>
  );
}

/**
 * motion-page · 业务路径：`createEgEdsAnimaPageNavigator` + `screenOptions={EgEdsAnimaPage({ direction, dragDismiss })}`，各页 `options={{ title }}`；
 * iOS 26+ 系统 NavBar + 系统转场，其余 EDS page 弹簧 + EgNavBar。每页可嵌套 page-shot。
 * 演示挂在 `EgEdsAnimaOverlayModal`（iOS 26+ RNS transparentModal · 其余 RN Modal）；RN 栈须 `detachInactiveScreens={false}`（RN Modal 内 react-native-screens `Screen` 不接点按）。
 */
export function ShowcasePageNavigationDemo({
  direction = 'horizontal',
  dragDismiss = true,
}: {
  direction?: EgEdsAnimaPageDirection;
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
        <GestureHandlerRootView style={styles.fill}>
          <ExitContext.Provider value={close}>
          <NavigationIndependentTree>
            <NavigationContainer
              theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } }}
            >
              <Stack.Navigator
                {...({ detachInactiveScreens: false } as object)}
                screenOptions={EgEdsAnimaPage({ direction, dragDismiss, mode: 'light' })}
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
                  {(props) => <LauncherScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen
                  name="Page"
                  component={PageScreen}
                  options={({ route }) =>
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
