import { Stack } from 'expo-router';

type ShowcaseLargeTitleProps = {
  children: string;
};

/** iOS large title — first child inside ScrollView / FlatList (pairs with headerLargeTitleEnabled). */
export function ShowcaseLargeTitle({ children }: ShowcaseLargeTitleProps) {
  return <Stack.Title large>{children}</Stack.Title>;
}
