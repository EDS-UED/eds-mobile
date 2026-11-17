import { Stack } from 'expo-router';

import { liquidGlassArchitecture } from '@/data/tokens/liquidGlassArchitecture';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { LiquidGlassStackTree } from '@/views/tokens/LiquidGlassStackTree';

type LiquidGlassTokensViewProps = {
  title: string;
};

/** 与 dist/css/liquid-glass/architecture.css · spec/liquid-glass/system.json 同栈说明。 */
export function LiquidGlassTokensView({ title }: LiquidGlassTokensViewProps) {
  const screenStyles = useShowcaseScreenStyles();
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(title);
  const { conceptTitle, trunk, stacks, platformSplit } = liquidGlassArchitecture;

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
          withTabBarInset={false}
          style={screenStyles.scrollRoot}
        >
          <LiquidGlassStackTree
            conceptTitle={conceptTitle}
            trunk={trunk}
            stacks={stacks}
            platformSplit={platformSplit}
          />
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}