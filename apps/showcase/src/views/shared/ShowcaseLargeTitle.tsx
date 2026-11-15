import { Stack } from 'expo-router';

type ShowcaseLargeTitleProps = {
  children: string;
};

/** @deprecated Tab 首页用 {@link ShowcaseTabHomeDisplayTitle} + {@link useShowcaseTabHomeNav}。内层列表页暂留 `Stack.Title`。 */
export function ShowcaseLargeTitle({ children }: ShowcaseLargeTitleProps) {
  return <Stack.Title large>{children}</Stack.Title>;
}
