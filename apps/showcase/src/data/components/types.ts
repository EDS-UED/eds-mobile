export type DocPropRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export type DocCustomizeSelectControl = {
  kind: 'select';
  key: string;
  label: string;
  options: { value: string; label: string }[];
  /** Sequential layout: fields with the same row render on one horizontal line. */
  row?: number;
  visibleWhen?: (state: Record<string, unknown>) => boolean;
};

export type DocCustomizeBooleanControl = {
  kind: 'boolean';
  key: string;
  label: string;
  row?: number;
  visibleWhen?: (state: Record<string, unknown>) => boolean;
  /** 勾选为 true 时，将对应 key 置为 false（如角标 / 红点互斥）。 */
  exclusiveKey?: string;
  /** 勾选为 true 时，将列出的 keys 全部置为 false（如 Paste / Unit / Max 互斥）。 */
  exclusiveKeys?: string[];
  /** 勾选后在同一控件槽右侧展示的下拉（如显示图标 → 图标位置）。 */
  inlineSelect?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  };
};

export type DocCustomizeTextControl = {
  kind: 'text';
  key: string;
  label: string;
  placeholder?: string;
  row?: number;
  visibleWhen?: (state: Record<string, unknown>) => boolean;
};

export type DocCustomizeHeadingControl = {
  kind: 'heading';
  key: string;
  label: string;
  row?: number;
  visibleWhen?: (state: Record<string, unknown>) => boolean;
};

export type DocCustomizeControl =
  | DocCustomizeSelectControl
  | DocCustomizeBooleanControl
  | DocCustomizeTextControl
  | DocCustomizeHeadingControl;

export function isControlVisible(
  control: DocCustomizeControl,
  state: Record<string, unknown>,
): boolean {
  return control.visibleWhen ? control.visibleWhen(state) : true;
}

const NATIVE_BUTTON_TYPE_VALUES = new Set(['button', 'submit', 'reset']);

/** Customize 保留 Input / Divider 的 `type`；不暴露原生 `<button type>`。 */
export function isAllowedTypeCustomizeControl(control: DocCustomizeControl): boolean {
  if (control.kind !== 'select' || control.key !== 'type') return true;
  const values = control.options.map((option) => String(option.value));
  if (values.some((value) => NATIVE_BUTTON_TYPE_VALUES.has(value))) return false;
  return true;
}

export function filterDocCustomizeControls(controls: DocCustomizeControl[]): DocCustomizeControl[] {
  return controls.filter((control) => isAllowedTypeCustomizeControl(control));
}
