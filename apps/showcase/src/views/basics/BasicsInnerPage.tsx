import { Stack } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type BasicsInnerPageProps = PropsWithChildren<{
  title: string;
}>;

/** 基础 Tab 内页 — 与组件 / Token 二级页同构：`EgPage` 滚动壳 + Stack 栏。 */
export function BasicsInnerPage({ title, children }: BasicsInnerPageProps) {
  const screenStyles = useShowcaseScreenStyles();
  const { onScroll, scrollEventThrottle, stackScreenOptions, nativeStackNav, rnNavBar, rnScrollPaddingTop } =
    useShowcaseStackNav(title);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          keyboardShouldPersistTaps="handled"
          withTabBarInset={false}
          sectionGap={false}
          style={screenStyles.scrollRoot}
          contentContainerStyle={styles.content}
        >
          {children}
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.layout.docSectionCardGap,
  },
});