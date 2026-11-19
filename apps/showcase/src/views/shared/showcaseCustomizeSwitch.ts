import type { EgSwitchProps } from '@eds/mobile-components';

/**
 * Showcase Customize 面板开关尺寸。
 * iOS 26+：`EgSwitch` 走系统 `UISwitch`（不随 size 缩放）· 其余 `EgSwitchRn` lg 轨。
 */
export const SHOWCASE_CUSTOMIZE_SWITCH_SIZE = 'lg' as NonNullable<EgSwitchProps['size']>;