import type { ComponentType, ReactNode } from 'react';

export type NativeMenuAction = {
  id?: string;
  title: string;
  titleColor?: import('react-native').ColorValue;
  image?: string | import('react-native').ImageSourcePropType;
  imageColor?: import('react-native').ColorValue;
  state?: 'on' | 'off';
  attributes?: {
    destructive?: boolean;
    disabled?: boolean;
    hidden?: boolean;
  };
  subactions?: NativeMenuAction[];
  displayInline?: boolean;
};

export type NativeMenuViewProps = {
  title?: string;
  actions: NativeMenuAction[];
  onPressAction?: (event: { nativeEvent: { event: string } }) => void;
  shouldOpenOnLongPress?: boolean;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
  testID?: string;
  children?: ReactNode;
};

let MenuViewComponent: ComponentType<NativeMenuViewProps> | null | undefined;

/** `@expo/ui/community/menu` — SwiftUI Menu / UIMenu 语义（consumer 可选依赖）。 */
export function getNativeMenuView(): ComponentType<NativeMenuViewProps> | null {
  if (MenuViewComponent !== undefined) {
    return MenuViewComponent;
  }

  try {
    MenuViewComponent = require('@expo/ui/community/menu').MenuView as ComponentType<NativeMenuViewProps>;
  } catch {
    MenuViewComponent = null;
  }

  return MenuViewComponent;
}

export function isNativeMenuViewAvailable(): boolean {
  return Boolean(getNativeMenuView());
}
