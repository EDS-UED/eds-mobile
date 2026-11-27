import type { TagFamily, TagColorfulStyle, TagCustomStyle } from '../../../shared/tagFamilyTypes.js';
import type { EgCommonProps, EgLabelProps, EgTagVariant, TagShape, TagSize } from '../../../shared/types.js';
import type { TagStatus } from '../../../shared/tagPalette.js';

export type EgTagProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    shape?: TagShape;
    /** 类型 · 系统 / 状态 / 彩色 / 商业（custom）。 */
    family?: TagFamily;
    /** 样式 · 仅 `family=system`；原「类型」语义。 */
    variant?: EgTagVariant;
    /** `family=status` */
    status?: TagStatus;
    /** `family=colorful` */
    colorfulStyle?: TagColorfulStyle;
    /** `family=custom` · 商业 */
    customStyle?: TagCustomStyle;
    /** 与列表/表格主文同行纵向居中 · 默认 `flex-start`。 */
    rowAlign?: boolean;
  };