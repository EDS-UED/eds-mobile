export type AvatarPaletteColor = {
  hex: string;
  displayP3: string;
};

/** web3-avatar-1 … web3-avatar-20 — Figma User / 465:1721 */
export const AVATAR_NATIVE_PALETTE: readonly AvatarPaletteColor[] = [
  { hex: '#1c58b1', displayP3: 'color(display-p3 0.1098 0.3451 0.6941)' },
  { hex: '#256034', displayP3: 'color(display-p3 0.1451 0.3765 0.2039)' },
  { hex: '#ffaa32', displayP3: 'color(display-p3 1.0000 0.6667 0.1961)' },
  { hex: '#a23ff9', displayP3: 'color(display-p3 0.6353 0.2471 0.9765)' },
  { hex: '#1fc35a', displayP3: 'color(display-p3 0.1216 0.7647 0.3529)' },
  { hex: '#d3025c', displayP3: 'color(display-p3 0.8275 0.0078 0.3608)' },
  { hex: '#0a3d62', displayP3: 'color(display-p3 0.0392 0.2392 0.3843)' },
  { hex: '#f97f51', displayP3: 'color(display-p3 0.9765 0.4980 0.3176)' },
  { hex: '#079992', displayP3: 'color(display-p3 0.0275 0.6000 0.5725)' },
  { hex: '#893b25', displayP3: 'color(display-p3 0.5373 0.2314 0.1451)' },
  { hex: '#943657', displayP3: 'color(display-p3 0.5804 0.2118 0.3412)' },
  { hex: '#33952b', displayP3: 'color(display-p3 0.2000 0.5843 0.1686)' },
  { hex: '#6a56e9', displayP3: 'color(display-p3 0.4157 0.3373 0.9137)' },
  { hex: '#4b554e', displayP3: 'color(display-p3 0.2941 0.3333 0.3059)' },
  { hex: '#7a0073', displayP3: 'color(display-p3 0.4784 0.0000 0.4510)' },
  { hex: '#2c8ebb', displayP3: 'color(display-p3 0.1725 0.5569 0.7333)' },
  { hex: '#744b5f', displayP3: 'color(display-p3 0.4549 0.2941 0.3725)' },
  { hex: '#624640', displayP3: 'color(display-p3 0.3843 0.2745 0.2510)' },
  { hex: '#2075aa', displayP3: 'color(display-p3 0.1255 0.4588 0.6667)' },
  { hex: '#485669', displayP3: 'color(display-p3 0.2824 0.3373 0.4118)' },
] as const;

export const AVATAR_NATIVE_PALETTE_SIZE = AVATAR_NATIVE_PALETTE.length;

/** Figma 机器人资产名（variant=`robot`）。 */
export const AVATAR_ROBOT_ASSET_NAME = 'eds-avatar-0' as const;

/** Figma 元数据名：web3-avatar-1 … web3-avatar-20（index 0-based）。 */
export function formatAvatarPaletteName(index: number): string {
  return `web3-avatar-${index + 1}`;
}

export function avatarPaletteBackgroundVars(color: AvatarPaletteColor): Record<string, string> {
  return {
    '--eds-avatar-bg-hex': color.hex,
    '--eds-avatar-bg-p3': color.displayP3,
  };
}
