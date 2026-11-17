import { StyleSheet, Text } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsFontStyle } from '@/lib/edsFontFamily';
import { edsTypographyRole } from '@/views/shared/resolveEdsTheme';
import { showcasePageHeadingInsetLeft } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type ShowcaseTabHomeDisplayTitleProps = {
  children: string;
};

/** Tab 栈首页 — 大标题在滚动内容区（`.typography-display`），栏内标题滚动后才显。 */
export function ShowcaseTabHomeDisplayTitle({ children }: ShowcaseTabHomeDisplayTitleProps) {
  const colors = useShowcaseColors();

  return (
    <Text
      accessibilityRole="header"
      style={[styles.title, { color: colors['text-base-primary'] as string }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    ...edsTypographyRole('display'),
    ...edsFontStyle('700'),
    paddingLeft: showcasePageHeadingInsetLeft,
  },
});