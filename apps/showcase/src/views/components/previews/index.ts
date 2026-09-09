/** Auto-generated Mobile preview registry */
import type { ComponentPreviewEntry } from './componentPreviewTypes';
import ShowcasePlaceholderPreview from './ShowcasePlaceholderPreview.vue';
import IconPreview from './IconPreview.vue';
import CryptoPreview from './CryptoPreview.vue';
import AvatarPreview from './AvatarPreview.vue';

export type { ComponentPreviewEntry } from './componentPreviewTypes';

const REAL_PREVIEWS: Record<string, ComponentPreviewEntry> = {
  icons: { slug: 'icons', title: 'Icons', exportName: 'EgIcon', component: IconPreview },
  crypto: { slug: 'crypto', title: 'Crypto', exportName: 'EgCrypto', component: CryptoPreview },
  avatar: { slug: 'avatar', title: 'Avatar', exportName: 'EgAvatar', component: AvatarPreview, usesComponentDocHeader: true },
};

function placeholder(slug: string, title: string, exportName?: string): ComponentPreviewEntry {
  return { slug, title, exportName, component: ShowcasePlaceholderPreview };
}

export const componentPreviewBySlug: Record<string, ComponentPreviewEntry> = {
  'avatar': REAL_PREVIEWS['avatar'],
  'avatar-preset-0': placeholder('avatar-preset-0', 'eds-avatar-0', 'EgAvatarPreset0'),
  'avatar-preset-1': placeholder('avatar-preset-1', 'eds-avatar-1', 'EgAvatarPreset1'),
  'button-body': placeholder('button-body', 'Button'),
  'button-brand': placeholder('button-brand', 'Brand', 'EgBrandButton'),
  'button-combo-action': placeholder('button-combo-action', 'Combo/Action', 'EgComboActionButton'),
  'button-combo-action-alt': placeholder('button-combo-action-alt', 'Combo/Action', 'EgComboActionButtonAlt'),
  'button-danger': placeholder('button-danger', 'Danger', 'EgDangerButton'),
  'button-decor': placeholder('button-decor', 'Decor', 'EgDecorButton'),
  'button-icon-container': placeholder('button-icon-container', 'iCon Container', 'EgIconContainerButton'),
  'button-link': placeholder('button-link', 'Link', 'EgLinkButton'),
  'button-option': placeholder('button-option', 'Option', 'EgOptionButton'),
  'crypto': REAL_PREVIEWS['crypto'],
  'data-combo-detail': placeholder('data-combo-detail', 'Data Combo/Detail', 'EgDataComboDetail'),
  'divider': placeholder('divider', 'Divider', 'EgDivider'),
  'dropdown-body': placeholder('dropdown-body', 'Drop-Down'),
  'dropdown-trigger': placeholder('dropdown-trigger', 'Trigger', 'EgTriggerDropdown'),
  'feedback-body': placeholder('feedback-body', 'Feedback'),
  'feedback-form-submission': placeholder('feedback-form-submission', 'Form Submission', 'EgFormSubmissionFeedback'),
  'feedback-status-card': placeholder('feedback-status-card', 'Status Card', 'EgStatusCardFeedback'),
  'feedback-toast': placeholder('feedback-toast', 'Toast', 'EgToastFeedback'),
  'icons': REAL_PREVIEWS['icons'],
  'index-body': placeholder('index-body', 'Index'),
  'index-title': placeholder('index-title', 'Title', 'EgIndexTitle'),
  'input-body': placeholder('input-body', 'Input'),
  'input-combo-input-group': placeholder('input-combo-input-group', 'Combo/Input Group', 'EgInputGroup'),
  'input-combo-text-input': placeholder('input-combo-text-input', 'Combo/Text Input', 'EgComboTextInput'),
  'input-combo-textarea-input': placeholder('input-combo-textarea-input', 'Combo/Textarea Input', 'EgComboTextareaInput'),
  'input-input': placeholder('input-input', 'Input', 'EgInput'),
  'input-pointer': placeholder('input-pointer', 'Input/Pointer', 'EgInputPointer'),
  'input-quick-input': placeholder('input-quick-input', 'Quick Input', 'EgQuickInput'),
  'input-search': placeholder('input-search', 'Search', 'EgSearchInput'),
  'input-textarea': placeholder('input-textarea', 'Textarea', 'EgTextareaInput'),
  'mode': placeholder('mode', 'Mode', 'EgMode'),
  'popovers-body': placeholder('popovers-body', 'Popovers'),
  'popovers-notes': placeholder('popovers-notes', 'Notes', 'EgNotesPopover'),
  'tab-bar-base': placeholder('tab-bar-base', 'TabBar', 'EgTabBar'),
  'tab-bar-body': placeholder('tab-bar-body', 'TabBar'),
  'tab-bar-cregis': placeholder('tab-bar-cregis', 'Apply_TabBar@Cregis', 'EgCregisTabBar'),
  'tab-bar-glass-bg': placeholder('tab-bar-glass-bg', 'Glass BG.', 'EgTabBarGlassBg'),
  'tab-bar-item': placeholder('tab-bar-item', 'TabBar-Item', 'EgTabBarItem'),
  'tab-bar-udun': placeholder('tab-bar-udun', 'Apply_TabBar@UDun', 'EgUDunTabBar'),
  'tab-base-segmented-control': placeholder('tab-base-segmented-control', 'Base_Segmented Control', 'EgSegmentedControlBase'),
  'tab-base-tab': placeholder('tab-base-tab', 'Base_ Tab', 'EgBaseTab'),
  'tab-body': placeholder('tab-body', 'Tab'),
  'tab-segmented-control': placeholder('tab-segmented-control', 'Segmented Control', 'EgSegmentedControl'),
  'tab-tabs': placeholder('tab-tabs', 'Tabs', 'EgTabs'),
  'tag-body': placeholder('tag-body', 'Tag'),
  'tag-color': placeholder('tag-color', 'Color', 'EgColorTag'),
  'tag-color-alt': placeholder('tag-color-alt', 'Color', 'EgColorTagAlt'),
  'tag-system': placeholder('tag-system', 'System', 'EgSystemTag'),
  'tag-system-alt': placeholder('tag-system-alt', 'System', 'EgSystemTagAlt'),
  'text-bar': placeholder('text-bar', '7-Bar', 'EgTextBar'),
  'text-body': placeholder('text-body', 'Text'),
  'text-detail': placeholder('text-detail', '5-Detail', 'EgTextDetail'),
  'text-display': placeholder('text-display', '1-Display', 'EgTextDisplay'),
  'text-footnote': placeholder('text-footnote', '6-Footnote', 'EgTextFootnote'),
  'text-headline': placeholder('text-headline', '2-Headline', 'EgTextHeadline'),
  'text-title': placeholder('text-title', '3-Title', 'EgTextTitle'),
  'title-combo-body': placeholder('title-combo-body', 'Title Combo/4-Body', 'EgTitleComboBody'),
  'title-combo-display': placeholder('title-combo-display', 'Title Combo/1-Display', 'EgTitleComboDisplay'),
  'title-combo-headline': placeholder('title-combo-headline', 'Title Combo/2-Headline', 'EgTitleComboHeadline'),
  'title-combo-title': placeholder('title-combo-title', 'Title Combo/3-Title', 'EgTitleComboTitle'),
  'toggle-body': placeholder('toggle-body', 'Toggle'),
  'toggle-checkbox': placeholder('toggle-checkbox', 'Checkbox', 'EgCheckbox'),
  'toggle-decide': placeholder('toggle-decide', 'Decide', 'EgDecide'),
  'toggle-radio': placeholder('toggle-radio', 'Radio', 'EgRadio'),
  'toggle-switch': placeholder('toggle-switch', 'Switch', 'EgSwitch'),
};

export const compactComponentPreviewSlugs = new Set<string>([
  'input-body', 'button-body', 'tag-body', 'toggle-body', 'tab-body', 'dropdown-body', 'icons', 'crypto',
]);

export function usesCompactComponentPreview(slug: string) {
  return compactComponentPreviewSlugs.has(slug);
}

export function usesScrollComponentPreview(_slug: string) {
  return false;
}

export function usesTagComponentPreview(slug: string) {
  return slug.startsWith('tag-');
}

export function usesAvatarComponentPreview(slug: string) {
  return slug.startsWith('avatar-');
}
