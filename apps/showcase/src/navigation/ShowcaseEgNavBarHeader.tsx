import { EgNavBar, egNavBarScrollContentReserve, type ThemeMode } from '@eds/mobile-components';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ShowcaseEgNavBarHeaderProps = {
  navigation: { goBack: () => void };
  options: { title?: string; headerTitle?: unknown };
  back?: unknown;
  mode: ThemeMode;
};

/** Android / iOS ≤25 — Stack `header`：RN `EgNavBar`，外层定高让内容排在栏下。 */
export function ShowcaseEgNavBarHeader({ navigation, options, back, mode }: ShowcaseEgNavBarHeaderProps) {
  const insets = useSafeAreaInsets();
  const title = typeof options.headerTitle === 'string' ? options.headerTitle : (options.title ?? '');

  return (
    <View style={{ height: egNavBarScrollContentReserve(insets.top) }}>
      <EgNavBar
        title={title}
        mode={mode}
        showLeft={back != null}
        showRight={false}
        left={{
          kind: 'icon',
          icon: 'eds-arrow-left-ios',
          accessibilityLabel: '返回',
          onPress: () => navigation.goBack(),
        }}
      />
    </View>
  );
}
