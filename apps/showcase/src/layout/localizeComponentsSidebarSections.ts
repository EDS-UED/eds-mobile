import type { ShowcaseI18nRegistry } from '@/data/i18n/types';
import type {
  ComponentsSidebarGroup,
  ComponentsSidebarSection,
} from './buildComponentsSidebarSections';

function localizeGroup(
  group: ComponentsSidebarGroup,
  i18n: ShowcaseI18nRegistry,
): ComponentsSidebarGroup {
  return {
    ...group,
    label: i18n.name(group.labelKey, group.label),
  };
}

/** 侧栏 section / group 走 i18n；组件族名称固定 catalog 英文，不翻译。 */
export function localizeComponentsSidebarSections(
  sections: ComponentsSidebarSection[],
  i18n: ShowcaseI18nRegistry,
): ComponentsSidebarSection[] {
  return sections.map((section) => ({
    ...section,
    label: i18n.name(section.labelKey, section.label),
    groups: section.groups?.map((group) => localizeGroup(group, i18n)),
  }));
}
