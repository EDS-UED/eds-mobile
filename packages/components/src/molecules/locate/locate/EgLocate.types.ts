import type { ThemeMode } from '../../../theme/index.js';

/** A–Z 与「#」。调用方可传入自己的索引键。 */
export const EG_LOCATE_DEFAULT_KEYS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '#',
] as const;

export type EgLocateProps = {
  mode?: ThemeMode;
  /** 右侧索引。默认 A–Z 与 #。 */
  keys?: readonly string[];
  /** 当前字母。不传则组件自己记住。 */
  activeKey?: string;
  onActiveKeyChange?: (key: string) => void;
  testID?: string;
};
