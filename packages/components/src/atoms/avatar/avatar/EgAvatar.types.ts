import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

export type EgAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export type EgAvatarVariant = 'initials' | 'robot';

/** Figma Avatar 族 — 行为对齐 Desktop `EgAvatar`。 */
export type EgAvatarProps = {
  testID?: string;
  name?: string;
  initials?: string;
  size?: EgAvatarSize;
  variant?: EgAvatarVariant;
  /** 图片头像（企业 Logo / 用户照片）；设置后优先于 initials / robot，圆形裁切。 */
  source?: ImageSourcePropType;
  /** 0–19，指定 web3 原色盘索引；未传时按 seed 稳定映射或 random。 */
  colorIndex?: number;
  /** Showcase / 演示 — 每次渲染随机原色。 */
  randomColor?: boolean;
  /** 原色映射 seed，默认取 name。 */
  colorSeed?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};
