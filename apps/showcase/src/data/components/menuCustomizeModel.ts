import type { DocCustomizeControl } from './types.js';

export const MENU_MAX_SECTIONS = 6;
export const MENU_MAX_ITEMS = 6;
export const MENU_MIN_SECTIONS = 1;
export const MENU_MIN_ITEMS = 1;

export function readMenuSectionCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.sectionCount ?? '2'), 10);
  if (!Number.isFinite(parsed)) {
    return 2;
  }
  return Math.min(MENU_MAX_SECTIONS, Math.max(MENU_MIN_SECTIONS, parsed));
}

export function patchMenuSectionCount(
  state: Record<string, unknown>,
  nextCount: number,
): Record<string, unknown> {
  const clamped = Math.min(MENU_MAX_SECTIONS, Math.max(MENU_MIN_SECTIONS, nextCount));
  const patch: Record<string, unknown> = { sectionCount: String(clamped) };
  const prefix = `group${clamped}`;
  if (state[`${prefix}ItemCount`] === undefined) {
    Object.assign(patch, groupDefaults(clamped));
  }
  return { ...state, ...patch };
}

function copyGroupFields(
  from: Record<string, unknown>,
  fromIndex: number,
  to: Record<string, unknown>,
  toIndex: number,
): void {
  const fromPrefix = `group${fromIndex}`;
  const toPrefix = `group${toIndex}`;
  to[`${toPrefix}ShowTitle`] = from[`${fromPrefix}ShowTitle`];
  to[`${toPrefix}Title`] = from[`${fromPrefix}Title`];
  to[`${toPrefix}ItemCount`] = from[`${fromPrefix}ItemCount`];
  for (let slot = 1; slot <= MENU_MAX_ITEMS; slot += 1) {
    to[`${toPrefix}Item${slot}Label`] = from[`${fromPrefix}Item${slot}Label`];
    to[`${toPrefix}Item${slot}Icon`] = from[`${fromPrefix}Item${slot}Icon`];
  }
}

function clearGroupFields(target: Record<string, unknown>, groupIndex: number): void {
  const prefix = `group${groupIndex}`;
  delete target[`${prefix}ShowTitle`];
  delete target[`${prefix}Title`];
  delete target[`${prefix}ItemCount`];
  for (let slot = 1; slot <= MENU_MAX_ITEMS; slot += 1) {
    delete target[`${prefix}Item${slot}Label`];
    delete target[`${prefix}Item${slot}Icon`];
  }
}

/** 删除指定组（至少保留 1 组）；其后组序号前移。 */
export function removeMenuSection(
  state: Record<string, unknown>,
  removeIndex: number,
): Record<string, unknown> {
  const count = readMenuSectionCount(state);
  if (count <= MENU_MIN_SECTIONS || removeIndex < 1 || removeIndex > count) {
    return state;
  }
  const next: Record<string, unknown> = { ...state, sectionCount: String(count - 1) };
  for (let g = removeIndex; g < count; g += 1) {
    copyGroupFields(state, g + 1, next, g);
  }
  clearGroupFields(next, count);
  return next;
}

export function readMenuItemCount(state: Record<string, unknown>, groupIndex: number): number {
  return readItemCount(state, groupIndex);
}

export function addMenuItem(
  state: Record<string, unknown>,
  groupIndex: number,
): Record<string, unknown> {
  const count = readItemCount(state, groupIndex);
  if (count >= MENU_MAX_ITEMS) {
    return state;
  }
  const prefix = `group${groupIndex}`;
  const newSlot = count + 1;
  return {
    ...state,
    [`${prefix}ItemCount`]: String(newSlot),
    [`${prefix}Item${newSlot}Label`]: `选项 ${newSlot}`,
    [`${prefix}Item${newSlot}Icon`]: 'eds-more-ios',
  };
}

/** 删除组内 Item（至少保留 1 个）；其后 Item 前移。 */
export function removeMenuItem(
  state: Record<string, unknown>,
  groupIndex: number,
  removeSlot: number,
): Record<string, unknown> {
  const count = readItemCount(state, groupIndex);
  if (count <= MENU_MIN_ITEMS || removeSlot < 1 || removeSlot > count) {
    return state;
  }
  const prefix = `group${groupIndex}`;
  const next: Record<string, unknown> = {
    ...state,
    [`${prefix}ItemCount`]: String(count - 1),
  };
  for (let slot = removeSlot; slot < count; slot += 1) {
    next[`${prefix}Item${slot}Label`] = state[`${prefix}Item${slot + 1}Label`];
    next[`${prefix}Item${slot}Icon`] = state[`${prefix}Item${slot + 1}Icon`];
  }
  delete next[`${prefix}Item${count}Label`];
  delete next[`${prefix}Item${count}Icon`];
  return next;
}

type MenuPreviewItem = {
  id: string;
  label: string;
  icon?: string;
};

export type MenuPreviewSection = {
  title?: string;
  items: MenuPreviewItem[];
};

const GROUP_PRESETS: Record<
  number,
  {
    showTitle: boolean;
    title: string;
    itemCount: string;
    items: { label: string; icon: string }[];
  }
> = {
  1: {
    showTitle: false,
    title: '',
    itemCount: '3',
    items: [
      { label: '信息', icon: 'eds-chatbot' },
      { label: '垃圾信息', icon: 'eds-black-list-fill' },
      { label: '最近删除', icon: 'eds-recycle' },
    ],
  },
  2: {
    showTitle: true,
    title: '筛选方式',
    itemCount: '2',
    items: [
      { label: '未读', icon: 'eds-text-search' },
      { label: '草稿', icon: 'eds-editor' },
    ],
  },
  3: {
    showTitle: false,
    title: '',
    itemCount: '1',
    items: [{ label: '管理过滤', icon: 'eds-list-setting' }],
  },
};

function groupDefaults(groupIndex: number): Record<string, unknown> {
  const preset = GROUP_PRESETS[groupIndex];
  if (!preset) {
    return {};
  }
  const prefix = `group${groupIndex}`;
  const out: Record<string, unknown> = {
    [`${prefix}ShowTitle`]: preset.showTitle,
    [`${prefix}Title`]: preset.title,
    [`${prefix}ItemCount`]: preset.itemCount,
  };
  preset.items.forEach((item, index) => {
    const slot = index + 1;
    out[`${prefix}Item${slot}Label`] = item.label;
    out[`${prefix}Item${slot}Icon`] = item.icon;
  });
  for (let slot = preset.items.length + 1; slot <= MENU_MAX_ITEMS; slot += 1) {
    out[`${prefix}Item${slot}Label`] = `选项 ${slot}`;
    out[`${prefix}Item${slot}Icon`] = 'eds-more-ios';
  }
  return out;
}

export const menuCustomizeDefaults: Record<string, unknown> = {
  triggerVariant: 'capsule',
  triggerSlotLabel: '自定义触发器',
  size: 'md',
  disabled: false,
  /** 预览项左侧 symbol；关时保留各 Item 的 icon 字段，仅不向 sections 输出。 */
  showItemIcon: true,
  defaultSelectedId: 'g1-item-1',
  triggerIcon: 'eds-more-ios',
  sectionCount: '2',
  placement: 'bottom',
  align: 'start',
  menuWidth: 268,
  menuMaxHeight: 580,
  forceRnImplementation: true,
  ...groupDefaults(1),
  ...groupDefaults(2),
  ...groupDefaults(3),
};

function groupControls(groupIndex: number): DocCustomizeControl[] {
  const prefix = `group${groupIndex}`;
  const showTitleKey = `${prefix}ShowTitle`;
  const titleKey = `${prefix}Title`;

  return [
    {
      kind: 'boolean',
      key: showTitleKey,
      label: '显示分组标题',
    },
    {
      kind: 'text',
      key: titleKey,
      label: '分组标题',
      placeholder: '如：筛选方式',
      visibleWhen: (state) => Boolean(state[showTitleKey]),
    },
  ];
}

export const menuTriggerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerVariant',
    label: '触发器',
    options: [
      { value: 'capsule', label: '胶囊' },
      { value: 'slot', label: '插槽' },
    ],
  },
  {
    kind: 'text',
    key: 'triggerSlotLabel',
    label: '插槽内容',
    visibleWhen: (state) => state.triggerVariant === 'slot',
  },
  {
    kind: 'select',
    key: 'size',
    label: '胶囊尺寸',
    options: [
      { value: 'xl', label: 'XL' },
      { value: 'lg', label: 'LG' },
      { value: 'md', label: 'MD' },
      { value: 'sm', label: 'SM' },
      { value: 'xs', label: 'XS' },
    ],
  },
  { kind: 'text', key: 'triggerIcon', label: '胶囊 icon' },
  { kind: 'boolean', key: 'disabled', label: '禁用' },
  { kind: 'boolean', key: 'showItemIcon', label: '显示图标' },
  {
    kind: 'select',
    key: 'placement',
    label: '出现方向',
    options: [
      { value: 'bottom', label: '下' },
      { value: 'top', label: '上' },
    ],
  },
  {
    kind: 'select',
    key: 'align',
    label: '对齐',
    options: [
      { value: 'start', label: '左' },
      { value: 'center', label: '中' },
      { value: 'end', label: '右' },
    ],
  },
  { kind: 'boolean', key: 'forceRnImplementation', label: '强制 RN 浮层' },
  { kind: 'text', key: 'menuWidth', label: '浮层宽度 (px)', placeholder: '268' },
  { kind: 'text', key: 'menuMaxHeight', label: '最大高度 (px)', placeholder: '580' },
];

/** 单组字段 — 由 MenuSectionsCustomizePanel 按当前选中组渲染。 */
export function menuGroupCustomizeControls(groupIndex: number): DocCustomizeControl[] {
  return groupControls(groupIndex);
}

/** 扁平列表（非 Menu 分段 UI）— 保留给 prop 文档等。 */
export const menuCustomizeControls: DocCustomizeControl[] = [
  ...menuTriggerCustomizeControls,
  ...menuGroupCustomizeControls(1),
  ...menuGroupCustomizeControls(2),
  ...menuGroupCustomizeControls(3),
];

function readItemCount(state: Record<string, unknown>, groupIndex: number): number {
  const raw = state[`group${groupIndex}ItemCount`];
  const parsed = Number.parseInt(String(raw ?? '1'), 10);
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  return Math.min(MENU_MAX_ITEMS, Math.max(MENU_MIN_ITEMS, parsed));
}

export function buildMenuSectionsFromCustomize(state: Record<string, unknown>): MenuPreviewSection[] {
  const sectionCount = readMenuSectionCount(state);
  const showItemIcon = state.showItemIcon !== false;
  const sections: MenuPreviewSection[] = [];

  for (let groupIndex = 1; groupIndex <= sectionCount; groupIndex += 1) {
    const prefix = `group${groupIndex}`;
    const showTitle = Boolean(state[`${prefix}ShowTitle`]);
    const titleRaw = String(state[`${prefix}Title`] ?? '').trim();
    const itemCount = readItemCount(state, groupIndex);
    const items: MenuPreviewItem[] = [];

    for (let slot = 1; slot <= itemCount; slot += 1) {
      const label =
        String(state[`${prefix}Item${slot}Label`] ?? `选项 ${slot}`).trim() || `选项 ${slot}`;
      const iconRaw = String(state[`${prefix}Item${slot}Icon`] ?? '').trim();
      items.push({
        id: `g${groupIndex}-item-${slot}`,
        label,
        ...(showItemIcon && iconRaw ? { icon: iconRaw } : {}),
      });
    }

    sections.push({
      ...(showTitle && titleRaw ? { title: titleRaw } : {}),
      items,
    });
  }

  return sections;
}

export function resolveMenuDefaultSelectedId(
  state: Record<string, unknown>,
  sections: MenuPreviewSection[],
): string {
  const preferred = String(state.defaultSelectedId ?? '');
  const allIds = sections.flatMap((section) => section.items.map((item) => item.id));
  if (preferred && allIds.includes(preferred)) {
    return preferred;
  }
  return allIds[0] ?? 'g1-item-1';
}

const MENU_META_KEY_PATTERN =
  /^(sectionCount|group\d+(ShowTitle|Title|ItemCount|Item\d+Label|Item\d+Icon)|triggerVariant|triggerSlotLabel|showItemIcon|placement|align|forceRnImplementation|menuWidth|menuMaxHeight)$/;

export function stripMenuCustomizeMeta(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (MENU_META_KEY_PATTERN.test(key)) {
      continue;
    }
    if (key.endsWith('-heading')) {
      continue;
    }
    out[key] = value;
  }
  return out;
}
