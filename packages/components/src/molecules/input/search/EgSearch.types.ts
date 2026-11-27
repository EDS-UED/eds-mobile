import type { EgFieldProps } from '../../_shared/props.js';

export type EgSearchHandle = {
  /** 失焦并收起关闭钮（等同点关闭 / 点空白退出搜索）。 */
  dismiss: () => void;
};

/** Figma Search — 固定 `input-md`；无尺寸定制。 */
export type EgSearchProps = Omit<
  EgFieldProps,
  'size' | 'showClear' | 'showPaste' | 'showUnit' | 'showMax' | 'unit' | 'multiline'
> & {
  onFocus?: () => void;
  onBlur?: () => void;
};