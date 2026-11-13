import type { EgMenuItem, EgMenuSection } from '../EgMenu.types.js';

/** Showcase / 默认预览 — 分组浮层菜单（对齐 iOS context menu 结构）。 */
export const EG_MENU_DEMO_SECTIONS: EgMenuSection[] = [
  {
    items: [
      { id: 'messages', label: '信息', icon: 'eds-chatbot' },
      { id: 'junk', label: '垃圾信息', icon: 'eds-black-list-fill' },
      { id: 'deleted', label: '最近删除', icon: 'eds-recycle' },
    ],
  },
  {
    title: '筛选方式',
    items: [
      { id: 'unread', label: '未读', icon: 'eds-text-search' },
      { id: 'drafts', label: '草稿', icon: 'eds-editor' },
    ],
  },
  {
    items: [{ id: 'filters', label: '管理过滤' }],
  },
];

export function normalizeEgMenuSections(input: {
  sections?: EgMenuSection[];
  items?: EgMenuItem[];
}): EgMenuSection[] {
  if (input.sections && input.sections.length > 0) {
    return input.sections;
  }
  if (input.items && input.items.length > 0) {
    return [{ items: input.items }];
  }
  return EG_MENU_DEMO_SECTIONS;
}

export function findEgMenuItem(
  sections: EgMenuSection[],
  id: string | undefined,
): EgMenuItem | undefined {
  if (!id) {
    return undefined;
  }
  for (const section of sections) {
    const hit = section.items.find((item) => item.id === id);
    if (hit) {
      return hit;
    }
  }
  return undefined;
}
