import type { EgMenuItem, EgMenuSection } from '../EgMenu.types.js';
import type { NativeMenuAction } from './nativeMenuView.js';

/** iOS 菜单仅认 SF Symbol — EDS 资产名做有限映射；未知则仅文案。 */
const EG_MENU_ICON_TO_SF: Record<string, string> = {
  'eds-chatbot': 'message.fill',
  'eds-black-list-fill': 'xmark.bin.fill',
  'eds-recycle': 'trash',
  'eds-text-search': 'envelope.badge',
  'eds-editor': 'doc.text',
};

function mapItemToAction(item: EgMenuItem, selectedId: string | undefined): NativeMenuAction {
  const sf = item.icon ? EG_MENU_ICON_TO_SF[item.icon] : undefined;
  return {
    id: item.id,
    title: item.label,
    state: item.id === selectedId ? 'on' : 'off',
    image: sf,
    attributes: {
      destructive: item.destructive,
      disabled: item.disabled,
    },
  };
}

export function mapEgMenuSectionsToNativeActions(
  sections: EgMenuSection[],
  selectedId: string | undefined,
): NativeMenuAction[] {
  return sections.map((section, sectionIndex) => {
    const subactions = section.items.map((item) => mapItemToAction(item, selectedId));
    if (section.title) {
      return {
        id: `eg-menu-section-${sectionIndex}`,
        title: section.title,
        displayInline: true,
        subactions,
      };
    }
    return {
      id: `eg-menu-section-${sectionIndex}`,
      title: '',
      displayInline: true,
      subactions,
    };
  });
}
