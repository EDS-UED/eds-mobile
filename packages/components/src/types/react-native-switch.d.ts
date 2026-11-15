/** RN 0.88 · bundler 解析 types 时 `Switch` 命名导出不可用 · Metro 走 deep import。 */
declare module 'react-native/Libraries/Components/Switch/Switch' {
  import type { ComponentType } from 'react';

  export type EgSwitchNativeSwitchProps = {
    value?: boolean;
    disabled?: boolean;
    onValueChange?: (value: boolean) => void;
    testID?: string;
    accessibilityLabel?: string;
    accessibilityRole?: 'switch';
    accessibilityState?: { checked?: boolean; disabled?: boolean };
    trackColor?: { false?: string; true?: string };
    thumbColor?: string;
    ios_backgroundColor?: string;
  };

  const Switch: ComponentType<EgSwitchNativeSwitchProps>;
  export default Switch;
}