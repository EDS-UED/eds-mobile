#!/usr/bin/env node
/**
 * Figma → component catalog + RN scaffold generator.
 * Source: EDS Mobile Figma inventory.
 *
 * Scene export naming: Eg{Scenario}{FamilyType} — see .cursor/rules/work.mdc §3.1
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '../src');

/** @type {Array<{ figmaName: string; exportName: string; tier: string; family: string; slug: string; figmaPage: string; kind: 'set' | 'component'; variantCount?: number; figmaId?: string }>} */
const CATALOG = [
  // —— Atoms · Text ——
  { figmaName: '1-Display', exportName: 'EgTextDisplay', tier: 'atoms', family: 'text', slug: 'text-display', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1085' },
  { figmaName: '2-Headline', exportName: 'EgTextHeadline', tier: 'atoms', family: 'text', slug: 'text-headline', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1089' },
  { figmaName: '3-Title', exportName: 'EgTextTitle', tier: 'atoms', family: 'text', slug: 'text-title', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1093' },
  { figmaName: '4-Body', exportName: 'EgTextBody', tier: 'atoms', family: 'text', slug: 'text-body', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 18, figmaId: '139:1114' },
  { figmaName: '5-Detail', exportName: 'EgTextDetail', tier: 'atoms', family: 'text', slug: 'text-detail', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 6, figmaId: '139:1118' },
  { figmaName: '6-Footnote', exportName: 'EgTextFootnote', tier: 'atoms', family: 'text', slug: 'text-footnote', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 6, figmaId: '139:1122' },
  { figmaName: '7-Bar', exportName: 'EgTextBar', tier: 'atoms', family: 'text', slug: 'text-bar', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 6, figmaId: '139:1126' },
  { figmaName: 'Data Combo/Detail', exportName: 'EgDataComboDetail', tier: 'atoms', family: 'text', slug: 'data-combo-detail', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 8, figmaId: '272:2265' },
  { figmaName: 'Title Combo/1-Display', exportName: 'EgTitleComboDisplay', tier: 'atoms', family: 'text', slug: 'title-combo-display', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1168' },
  { figmaName: 'Title Combo/2-Headline', exportName: 'EgTitleComboHeadline', tier: 'atoms', family: 'text', slug: 'title-combo-headline', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1169' },
  { figmaName: 'Title Combo/3-Title', exportName: 'EgTitleComboTitle', tier: 'atoms', family: 'text', slug: 'title-combo-title', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1189' },
  { figmaName: 'Title Combo/4-Body', exportName: 'EgTitleComboBody', tier: 'atoms', family: 'text', slug: 'title-combo-body', figmaPage: 'Text 文字✅', kind: 'set', variantCount: 3, figmaId: '139:1209' },
  { figmaName: 'Divider', exportName: 'EgDivider', tier: 'atoms', family: 'divider', slug: 'divider', figmaPage: 'Divider 分割线✅', kind: 'set', variantCount: 4, figmaId: '279:2984' },
  { figmaName: 'EgAvatar', exportName: 'EgAvatar', tier: 'atoms', family: 'avatar', slug: 'avatar-body', figmaPage: 'Avatar 头像 ✅🕒', kind: 'component', figmaId: '465:1721' },
  { figmaName: 'eds-avatar-0', exportName: 'EgAvatarPreset0', tier: 'atoms', family: 'avatar', slug: 'avatar-preset-0', figmaPage: 'Avatar 头像 ✅🕒', kind: 'component', figmaId: '465:1872' },
  { figmaName: 'eds-avatar-1', exportName: 'EgAvatarPreset1', tier: 'atoms', family: 'avatar', slug: 'avatar-preset-1', figmaPage: 'Avatar 头像 ✅🕒', kind: 'component', figmaId: '465:1905' },
  { figmaName: 'eds-bitcoin-lightning-network', exportName: 'EgCryptoBitcoinLightning', tier: 'atoms', family: 'crypto', slug: 'crypto-bitcoin-lightning', figmaPage: 'Crypto 币种 ✅🕒', kind: 'component', figmaId: '465:1619' },
  { figmaName: 'eds-btc-bitcoin', exportName: 'EgCryptoBtc', tier: 'atoms', family: 'crypto', slug: 'crypto-btc', figmaPage: 'Crypto 币种 ✅🕒', kind: 'component', figmaId: '465:1720' },
  { figmaName: 'iCon_Draw', exportName: 'EgIconDraw', tier: 'atoms', family: 'icon', slug: 'icon-draw', figmaPage: 'iCons 图标 ✅🕒', kind: 'set', variantCount: 5, figmaId: '164:5370' },

  // —— Molecules · Button ——
  { figmaName: 'Brand', exportName: 'EgButtonBrand', tier: 'molecules', family: 'button', slug: 'button-brand', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 60, figmaId: '125:2441' },
  { figmaName: 'Decor', exportName: 'EgButtonDecor', tier: 'molecules', family: 'button', slug: 'button-decor', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 60, figmaId: '183:2917' },
  { figmaName: 'Danger', exportName: 'EgButtonDanger', tier: 'molecules', family: 'button', slug: 'button-danger', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 60, figmaId: '184:3181' },
  { figmaName: 'Link', exportName: 'EgButtonLink', tier: 'molecules', family: 'button', slug: 'button-link', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 9, figmaId: '141:1760' },
  { figmaName: 'Option', exportName: 'EgButtonOption', tier: 'molecules', family: 'button', slug: 'button-option', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 20, figmaId: '465:2195' },
  { figmaName: 'Combo/Action', exportName: 'EgButtonComboAction', tier: 'molecules', family: 'button', slug: 'button-combo-action', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 2, figmaId: '137:895' },
  { figmaName: 'Combo/Action', exportName: 'EgButtonComboActionAlt', tier: 'molecules', family: 'button', slug: 'button-combo-action-alt', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 2, figmaId: '185:3458' },
  { figmaName: 'iCon Container', exportName: 'EgIconContainer', tier: 'molecules', family: 'button', slug: 'icon-container', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 135, figmaId: '101:4752' },
  { figmaName: 'Glass', tier: 'molecules', family: 'button', slug: 'button-glass', figmaPage: 'Button 按钮 ✅', kind: 'set', variantCount: 2, figmaId: '710:900' },

  // —— Molecules · Input ——
  { figmaName: 'Input', exportName: 'EgInput', tier: 'molecules', family: 'input', slug: 'input', figmaPage: 'Input 输入框✅', kind: 'set', variantCount: 25, figmaId: '149:3727' },
  { figmaName: 'Search', exportName: 'EgSearch', tier: 'molecules', family: 'input', slug: 'search', figmaPage: 'Input 输入框✅', kind: 'set', variantCount: 4, figmaId: '149:4197' },
  { figmaName: 'Textarea', exportName: 'EgTextarea', tier: 'molecules', family: 'input', slug: 'textarea', figmaPage: 'Input 输入框✅', kind: 'set', variantCount: 5, figmaId: '210:1512' },
  { figmaName: 'Quick Input', exportName: 'EgQuickInput', tier: 'molecules', family: 'input', slug: 'quick-input', figmaPage: 'Input 输入框✅', kind: 'set', variantCount: 2, figmaId: '300:4662' },
  { figmaName: 'Input/Pointer', exportName: 'EgInputPointer', tier: 'molecules', family: 'input', slug: 'input-pointer', figmaPage: 'Input 输入框✅', kind: 'component', figmaId: '149:2516' },
  { figmaName: 'Combo/Input Group', exportName: 'EgInputGroup', tier: 'molecules', family: 'input', slug: 'input-group', figmaPage: 'Input 输入框✅', kind: 'component', figmaId: '272:2699' },
  { figmaName: 'Combo/Text Input', exportName: 'EgTextInputCombo', tier: 'molecules', family: 'input', slug: 'text-input-combo', figmaPage: 'Input 输入框✅', kind: 'component', figmaId: '272:2645' },
  { figmaName: 'Combo/Textarea Input', exportName: 'EgTextareaInputCombo', tier: 'molecules', family: 'input', slug: 'textarea-input-combo', figmaPage: 'Input 输入框✅', kind: 'component', figmaId: '276:2761' },

  // —— Molecules · Tag ——
  { figmaName: 'Color', exportName: 'EgTagColor', tier: 'molecules', family: 'tag', slug: 'tag-color', figmaPage: 'Tag 标签✅', kind: 'set', variantCount: 24, figmaId: '506:5162' },
  { figmaName: 'Color', exportName: 'EgTagColorAlt', tier: 'molecules', family: 'tag', slug: 'tag-color-alt', figmaPage: 'Tag 标签✅', kind: 'set', variantCount: 24, figmaId: '507:5464' },
  { figmaName: 'System', exportName: 'EgTagSystem', tier: 'molecules', family: 'tag', slug: 'tag-system', figmaPage: 'Tag 标签✅', kind: 'set', variantCount: 15, figmaId: '495:4935' },
  { figmaName: 'System', exportName: 'EgTagSystemAlt', tier: 'molecules', family: 'tag', slug: 'tag-system-alt', figmaPage: 'Tag 标签✅', kind: 'set', variantCount: 15, figmaId: '507:5433' },

  // —— Molecules · Toggle ——
  { figmaName: 'Switch', exportName: 'EgSwitch', tier: 'molecules', family: 'toggle', slug: 'switch', figmaPage: 'Toggle 切换✅', kind: 'set', variantCount: 6, figmaId: '281:3699' },
  { figmaName: 'Checkbox', exportName: 'EgCheckbox', tier: 'molecules', family: 'toggle', slug: 'checkbox', figmaPage: 'Toggle 切换✅', kind: 'set', variantCount: 4, figmaId: '281:3676' },
  { figmaName: 'Radio', exportName: 'EgRadio', tier: 'molecules', family: 'toggle', slug: 'radio', figmaPage: 'Toggle 切换✅', kind: 'set', variantCount: 2, figmaId: '281:3673' },
  { figmaName: 'Decide', exportName: 'EgDecide', tier: 'molecules', family: 'toggle', slug: 'decide', figmaPage: 'Toggle 切换✅', kind: 'set', variantCount: 2, figmaId: '493:4773' },

  // —— Molecules · Tab ——
  { figmaName: 'Base_ Tab', exportName: 'EgTabBase', tier: 'molecules', family: 'tab', slug: 'tab-base', figmaPage: 'Tab 切换✅', kind: 'set', variantCount: 2, figmaId: '493:4549' },
  { figmaName: 'Base_Segmented Control', exportName: 'EgSegmentedControlBase', tier: 'molecules', family: 'tab', slug: 'segmented-control-base', figmaPage: 'Tab 切换✅', kind: 'set', variantCount: 12, figmaId: '493:4119' },
  { figmaName: 'Segmented Control', exportName: 'EgSegmentedControl', tier: 'molecules', family: 'tab', slug: 'segmented-control', figmaPage: 'Tab 切换✅', kind: 'set', variantCount: 6, figmaId: '493:4341' },
  { figmaName: 'Tabs', exportName: 'EgTab', tier: 'molecules', family: 'tab', slug: 'tabs', figmaPage: 'Tab 切换✅', kind: 'component', figmaId: '491:3819' },

  // —— Molecules · Drop-Down ——
  { figmaName: 'Trigger', exportName: 'EgMenuTrigger', tier: 'molecules', family: 'dropdown', slug: 'dropdown-trigger', figmaPage: 'Drop-Down 下拉✅', kind: 'set', variantCount: 15, figmaId: '297:3791' },

  // —— Molecules · Feedback ——
  { figmaName: 'Form Submission', exportName: 'EgFormSubmission', tier: 'molecules', family: 'feedback', slug: 'form-submission', figmaPage: 'Feedback 反馈 ✅ 🕒', kind: 'set', variantCount: 2, figmaId: '203:1064' },
  { figmaName: 'Status Card', exportName: 'EgStatusCard', tier: 'molecules', family: 'feedback', slug: 'status-card', figmaPage: 'Feedback 反馈 ✅ 🕒', kind: 'set', variantCount: 2, figmaId: '200:792' },
  { figmaName: 'Toast', exportName: 'EgToast', tier: 'molecules', family: 'feedback', slug: 'toast', figmaPage: 'Feedback 反馈 ✅ 🕒', kind: 'set', variantCount: 2, figmaId: '201:1030' },
  { figmaName: 'Reddot', tier: 'molecules', family: 'feedback', figmaPage: 'Feedback 反馈 ✅ 🕒', kind: 'component' },

  // —— Organisms · TabBar ——
  { figmaName: 'TabBar', exportName: 'EgTabBar', tier: 'organisms', family: 'tab-bar', slug: 'tab-bar', figmaPage: 'TabBar✅', kind: 'set', variantCount: 10, figmaId: '710:137' },
  { figmaName: 'TabBar-Item', exportName: 'EgTabBarItem', tier: 'organisms', family: 'tab-bar', slug: 'tab-bar-item', figmaPage: 'TabBar✅', kind: 'set', variantCount: 4, figmaId: '702:653' },
  { figmaName: 'Glass BG.', exportName: 'EgTabBarGlassBg', tier: 'organisms', family: 'tab-bar', slug: 'tab-bar-glass-bg', figmaPage: 'TabBar✅', kind: 'set', variantCount: 2, figmaId: '710:138' },
  { figmaName: 'Apply_TabBar@Cregis', exportName: 'EgTabBarCregis', tier: 'organisms', family: 'tab-bar', slug: 'tab-bar-cregis', figmaPage: 'TabBar✅', kind: 'set', variantCount: 2, figmaId: '710:414' },
  { figmaName: 'Apply_TabBar@UDun', exportName: 'EgTabBarUDun', tier: 'organisms', family: 'tab-bar', slug: 'tab-bar-udun', figmaPage: 'TabBar✅', kind: 'set', variantCount: 2, figmaId: '710:615' },
  { figmaName: 'NavBar', exportName: 'EgNavBar', tier: 'organisms', family: 'tab-bar', slug: 'tab-bar-nav-bar', figmaPage: 'TabBar✅', kind: 'component' },

  // —— Index / Popovers ——
  { figmaName: 'Notes', exportName: 'EgPopoverNotes', tier: 'molecules', family: 'popovers', slug: 'popovers-notes', figmaPage: '⛳️   组件索引✅', kind: 'set', variantCount: 8, figmaId: '180:1982' },
  { figmaName: 'Mode', exportName: 'EgMode', tier: 'templates', family: 'index', slug: 'mode', figmaPage: '⛳️   组件索引✅', kind: 'component', figmaId: '180:1980' },
  { figmaName: 'Title', exportName: 'EgIndexTitle', tier: 'templates', family: 'index', slug: 'index-title', figmaPage: '⛳️   组件索引✅', kind: 'component', figmaId: '180:1981' },
];

/** Standalone icon components from Figma iCons page */
const ICON_NAMES = [
  'cds-user-me-set', 'eds-add', 'eds-add-circle', 'eds-add-circle-fill', 'eds-add-employer', 'eds-add-employer-fill',
  'eds-add-role', 'eds-app-ecology', 'eds-arrow-callback', 'eds-arrow-deposit', 'eds-arrow-down', 'eds-arrow-down-fill',
  'eds-arrow-down-ios', 'eds-arrow-down-mini-ios', 'eds-arrow-download', 'eds-arrow-entry', 'eds-arrow-export',
  'eds-arrow-go-first', 'eds-arrow-go-last', 'eds-arrow-integrated-sort', 'eds-arrow-integrated-sort-mini',
  'eds-arrow-launch-circle', 'eds-arrow-launch-dotted', 'eds-arrow-launch-square', 'eds-arrow-left', 'eds-arrow-left-ios',
  'eds-arrow-left-mini-ios', 'eds-arrow-market-down', 'eds-arrow-market-up', 'eds-arrow-oblique', 'eds-arrow-outflow',
  'eds-arrow-refresh', 'eds-arrow-refuses', 'eds-arrow-right', 'eds-arrow-right-ios', 'eds-arrow-right-mini-ios',
  'eds-arrow-toggle-horizontal', 'eds-arrow-toggle-length', 'eds-arrow-toggle-vertical', 'eds-arrow-up', 'eds-arrow-up-ios',
  'eds-arrow-up-mini-ios', 'eds-arrow-update', 'eds-arrow-upload', 'eds-arrow-withdrawal', 'eds-arrow-workflow',
  'eds-bill', 'eds-bill-fill', 'eds-blockchain', 'eds-briefcase', 'eds-cashflow', 'eds-categorization', 'eds-categorization-fill',
  'eds-circle', 'eds-circulate-dollar', 'eds-circulation', 'eds-circulation-fill', 'eds-clear', 'eds-close', 'eds-close-circle',
  'eds-close-circle-fill', 'eds-database-dollar', 'eds-database-safety', 'eds-database-safety-fill', 'eds-developers-code',
  'eds-developers-code-fill', 'eds-disable', 'eds-disable-fill', 'eds-earphone', 'eds-earphone-fill', 'eds-editor', 'eds-enable',
  'eds-enable-fill', 'eds-eye', 'eds-flag-dollar', 'eds-floder-favorite', 'eds-floder-favorite-fill', 'eds-global-payments',
  'eds-global-payments -fill', 'eds-information', 'eds-information-fill', 'eds-interface-lock', 'eds-interface-lock-fill',
  'eds-interface-unlock', 'eds-list-curriculum', 'eds-list-editor', 'eds-list-lattice-mobile', 'eds-list-lattice-mobile-fill',
  'eds-load', 'eds-location-dollar', 'eds-lock-dollar', 'eds-merchant', 'eds-merchant-avant-fill', 'eds-merchant-fill',
  'eds-nick-name', 'eds-notice', 'eds-notice-fill', 'eds-passkey-fill', 'eds-payee', 'eds-payor', 'eds-recycle', 'eds-reduction',
  'eds-safely-dollar', 'eds-scan-code', 'eds-search', 'eds-social-media', 'eds-square', 'eds-square-fill', 'eds-stamp',
  'eds-stamp-fill', 'eds-suspicious-dollar', 'eds-team', 'eds-team-fill', 'eds-tick', 'eds-tick-fill', 'eds-tick-strong-fill',
  'eds-uneye', 'eds-usd-accounting', 'eds-usd-accounting-fill', 'eds-usd-payment', 'eds-usd-payment-fill', 'eds-usd-receipt',
  'eds-usd-settlement', 'eds-usd-symbolic', 'eds-user-check-validate', 'eds-user-information', 'eds-user-mobiletabbar',
  'eds-user-mobiletabbar-fill', 'eds-user-multiple-group', 'eds-user-notification', 'eds-user-pointer', 'eds-user-searches',
  'eds-user-security', 'eds-vip', 'eds-vip-fill', 'eds-wallet', 'eds-wallet-fill', 'eds-warning', 'eds-warning-fill',
  'eds-world-dollar', 'eds-zoom-in', 'eds-zoom-out', 'iCon_Draw/Type6', 'oval-tick-mini',
];

function toPascalFromKebab(name) {
  return name
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function figmaNameToPascal(figmaName) {
  return figmaName
    .replace(/\//g, ' ')
    .replace(/[_.@]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function figmaNameToKebab(figmaName) {
  return figmaName
    .replace(/\//g, '-')
    .replace(/[_.@\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Scene families — suffix appended as Eg{Scenario}{Suffix} */
const SCENE_FAMILY_SUFFIX = {
  button: 'Button',
  input: 'Input',
  tag: 'Tag',
  dropdown: 'Dropdown',
  tab: 'Tab',
  feedback: 'Feedback',
  'tab-bar': 'TabBar',
  popovers: 'Popover',
};

/** Manual export overrides for edge cases */
const EXPORT_OVERRIDES = {
  'button:iCon Container': 'EgIconContainerButton',
  'button:Glass': 'EgButtonGlass',
  'input:Search': 'EgSearch',
  'input:Textarea': 'EgTextarea',
  'input:Input/Pointer': 'EgInputPointer',
  'input:Combo/Input Group': 'EgInputGroup',
  'input:Combo/Text Input': 'EgComboTextInput',
  'input:Combo/Textarea Input': 'EgComboTextareaInput',
  'tab:Segmented Control': 'EgSegmentedControl',
  'tab:Base_Segmented Control': 'EgSegmentedControlBase',
  'tab:Tabs': 'EgTab',
  'tab-bar:TabBar-Item': 'EgTabBarItem',
  'tab-bar:Glass BG.': 'EgTabBarGlassBg',
  'tab-bar:Apply_TabBar@Cregis': 'EgCregisTabBar',
  'tab-bar:Apply_TabBar@UDun': 'EgUDunTabBar',
  'tab-bar:NavBar': 'EgNavBar',
  'popovers:Notes': 'EgNotesPopover',
  'feedback:Reddot': 'EgReddot',
};

const SCAFFOLD_MARKER = 'RN implementation —';

function computeSceneExportName(family, figmaName) {
  const overrideKey = `${family}:${figmaName}`;
  if (EXPORT_OVERRIDES[overrideKey]) return EXPORT_OVERRIDES[overrideKey];

  if (family === 'toggle') return `Eg${figmaNameToPascal(figmaName)}`;

  const suffix = SCENE_FAMILY_SUFFIX[family];
  if (!suffix) return `Eg${figmaNameToPascal(figmaName)}`;

  const scenarioPascal = figmaNameToPascal(figmaName);
  const suffixLower = suffix.toLowerCase();

  if (family === 'input' && figmaName === 'Input') return 'EgInput';
  if (family === 'tab-bar' && figmaName === 'TabBar') return 'EgTabBar';

  if (
    scenarioPascal.toLowerCase().endsWith(suffixLower) ||
    figmaName.toLowerCase().includes(suffixLower)
  ) {
    return `Eg${scenarioPascal}`;
  }

  return `Eg${scenarioPascal}${suffix}`;
}

/** Manual slug overrides for edge cases */
const SLUG_OVERRIDES = {
  'button:iCon Container': 'button-icon-container',
  'tab-bar:Apply_TabBar@Cregis': 'tab-bar-cregis',
  'tab-bar:Apply_TabBar@UDun': 'tab-bar-udun',
};

function computeSceneSlug(family, figmaName, altIndex = 0) {
  const overrideKey = `${family}:${figmaName}`;
  if (SLUG_OVERRIDES[overrideKey]) {
    let slug = SLUG_OVERRIDES[overrideKey];
    if (altIndex > 0) slug += '-alt';
    return slug;
  }

  let scenarioKebab = figmaNameToKebab(figmaName);

  if (family === 'input' && figmaName === 'Input') scenarioKebab = 'input';
  if (family === 'tab-bar' && figmaName === 'TabBar') scenarioKebab = 'base';

  const familyPrefix = `${family}-`;
  if (scenarioKebab.startsWith(familyPrefix)) {
    scenarioKebab = scenarioKebab.slice(familyPrefix.length);
  }

  let slug = `${family}-${scenarioKebab}`;
  if (altIndex > 0) slug += '-alt';
  return slug;
}

function finalizeCatalog(catalog) {
  const altCounts = new Map();

  return catalog.map((entry) => {
    if (entry.tier !== 'molecules' && entry.tier !== 'organisms') {
      return entry;
    }

    const altKey = `${entry.family}:${entry.figmaName}`;
    const altIndex = altCounts.get(altKey) ?? 0;
    altCounts.set(altKey, altIndex + 1);

    let exportName = computeSceneExportName(entry.family, entry.figmaName);
    if (altIndex > 0 && !exportName.endsWith('Alt')) {
      exportName += 'Alt';
    }

    const slug = computeSceneSlug(entry.family, entry.figmaName, altIndex);
    return { ...entry, exportName, slug };
  });
}

function iconExportName(figmaName) {
  const cleaned = figmaName.replace(/^eds-|^cds-/, '').replace(/\s+-fill$/, '-fill').replace(/\s+/g, '-');
  return `EgIcon${toPascalFromKebab(cleaned)}`;
}

for (const name of ICON_NAMES) {
  CATALOG.push({
    figmaName: name,
    exportName: iconExportName(name),
    tier: 'atoms',
    family: 'icon',
    slug: `icon-${name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`,
    figmaPage: 'iCons 图标 ✅🕒',
    kind: 'component',
  });
}

function kebabFromExport(exportName) {
  return exportName.replace(/^Eg/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function isComponentImplemented(entry) {
  const componentPath = join(
    srcDir,
    entry.tier,
    entry.family,
    kebabFromExport(entry.exportName),
    `${entry.exportName}.tsx`,
  );
  if (!existsSync(componentPath)) return false;
  return !readFileSync(componentPath, 'utf8').includes(SCAFFOLD_MARKER);
}

function removeOrphanComponentDirs(entries) {
  const expected = new Set(
    entries.map((e) => join(srcDir, e.tier, e.family, kebabFromExport(e.exportName))),
  );
  /** Showcase infra / 手维实现 — 不在 Figma 202 路径下，禁止当 orphan 删除。 */
  expected.add(join(srcDir, 'molecules', 'dropdown', 'menu'));
  expected.add(join(srcDir, 'molecules', 'tab', 'tab-block'));

  for (const tier of ['atoms', 'molecules', 'organisms', 'templates']) {
    const tierPath = join(srcDir, tier);
    if (!existsSync(tierPath)) continue;

    for (const family of readdirSync(tierPath, { withFileTypes: true })) {
      if (!family.isDirectory()) continue;
      if (family.name === '_shared' || family.name === '_assets') continue;
      const familyPath = join(tierPath, family.name);

      for (const comp of readdirSync(familyPath, { withFileTypes: true })) {
        if (!comp.isDirectory()) continue;
        if (comp.name === '_shared') continue;
        const full = join(familyPath, comp.name);
        if (!expected.has(full)) {
          rmSync(full, { recursive: true, force: true });
        }
      }
    }
  }
}

function atomPropsType(exportName) {
  return `/** Figma atom — synced from EDS Mobile */\nexport type ${exportName}Props = {\n  testID?: string;\n  mode?: 'light' | 'dark';\n  size?: 'sm' | 'md' | 'lg';\n  fillTone?: 'primary' | 'brand';\n  accessibilityLabel?: string;\n};\n`;
}

function writeComponentFile(entry) {
  const folder = join(srcDir, entry.tier, entry.family, kebabFromExport(entry.exportName));
  mkdirSync(folder, { recursive: true });

  const typesPath = join(folder, `${entry.exportName}.types.ts`);
  const componentPath = join(folder, `${entry.exportName}.tsx`);
  const indexPath = join(folder, 'index.ts');

  if (existsSync(componentPath)) {
    const existing = readFileSync(componentPath, 'utf8');
    if (!existing.includes(SCAFFOLD_MARKER)) {
      return;
    }
  }

  if (entry.family === 'icon') {
    writeFileSync(
      typesPath,
      `/** Figma: ${entry.figmaName} · ${entry.figmaPage} */\n${atomPropsType(entry.exportName)}`,
    );
    writeFileSync(
      componentPath,
      `import type { ViewProps } from 'react-native';\nimport { EgSymbol } from '../../_shared/symbol/EgSymbol.js';\nimport type { ${entry.exportName}Props } from './${entry.exportName}.types.js';\n\n/** RN icon — ${entry.figmaName} */\nexport function ${entry.exportName}(props: ${entry.exportName}Props & Pick<ViewProps, 'style'>) {\n  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;\n  return (\n    <EgSymbol\n      name=${JSON.stringify(entry.figmaName)}\n      testID={testID ?? '${entry.slug}'}\n      mode={mode}\n      size={size}\n      fillTone={fillTone}\n      style={style}\n      accessibilityLabel={accessibilityLabel ?? ${JSON.stringify(entry.figmaName)}}\n    />\n  );\n}\n`,
    );
    writeFileSync(
      indexPath,
      `export { ${entry.exportName} } from './${entry.exportName}.js';\nexport type { ${entry.exportName}Props } from './${entry.exportName}.types.js';\n`,
    );
    return;
  }

  if (entry.family === 'crypto') {
    writeFileSync(
      typesPath,
      `/** Figma: ${entry.figmaName} · ${entry.figmaPage} */\n${atomPropsType(entry.exportName)}`,
    );
    writeFileSync(
      componentPath,
      `import type { ViewProps } from 'react-native';\nimport { EgSymbol } from '../../_shared/symbol/EgSymbol.js';\nimport type { ${entry.exportName}Props } from './${entry.exportName}.types.js';\n\n/** RN crypto — ${entry.figmaName} */\nexport function ${entry.exportName}(props: ${entry.exportName}Props & Pick<ViewProps, 'style'>) {\n  const { testID, mode, size, style, accessibilityLabel } = props;\n  return (\n    <EgSymbol\n      name=${JSON.stringify(entry.figmaName)}\n      testID={testID ?? '${entry.slug}'}\n      mode={mode}\n      size={size}\n      style={style}\n      accessibilityLabel={accessibilityLabel ?? ${JSON.stringify(entry.figmaName)}}\n    />\n  );\n}\n`,
    );
    writeFileSync(
      indexPath,
      `export { ${entry.exportName} } from './${entry.exportName}.js';\nexport type { ${entry.exportName}Props } from './${entry.exportName}.types.js';\n`,
    );
    return;
  }

  writeFileSync(
    typesPath,
    `/** Figma: ${entry.figmaName} · ${entry.figmaPage} */\nexport type ${entry.exportName}Props = {\n  /** Figma component set — variants synced from EDS Mobile */\n  testID?: string;\n};\n`,
  );

  writeFileSync(
    componentPath,
    `import { View, type ViewProps } from 'react-native';\nimport type { ${entry.exportName}Props } from './${entry.exportName}.types.js';\n\n/** RN implementation — ${entry.figmaName} (${entry.kind}${entry.variantCount ? ` · ${entry.variantCount} variants` : ''}) */\nexport function ${entry.exportName}(props: ${entry.exportName}Props & Pick<ViewProps, 'style'>) {\n  const { testID, style } = props;\n  return <View testID={testID ?? '${entry.slug}' } style={style} accessibilityLabel="${entry.figmaName}" />;\n}\n`,
  );

  writeFileSync(
    indexPath,
    `export { ${entry.exportName} } from './${entry.exportName}.js';\nexport type { ${entry.exportName}Props } from './${entry.exportName}.types.js';\n`,
  );
}

const FINAL_CATALOG = finalizeCatalog(CATALOG);

// Catalog TS
const catalogTs = `/** Auto-generated from EDS Mobile Figma — ${FINAL_CATALOG.length} components */\nexport type FigmaComponentEntry = {\n  figmaName: string;\n  exportName: string;\n  tier: 'atoms' | 'molecules' | 'organisms' | 'templates';\n  family: string;\n  slug: string;\n  figmaPage: string;\n  kind: 'set' | 'component';\n  variantCount?: number;\n  figmaId?: string;\n};\n\nexport const figmaComponentCatalog: FigmaComponentEntry[] = ${JSON.stringify(FINAL_CATALOG, null, 2)} as const;\n\nexport const figmaComponentCount = figmaComponentCatalog.length;\n`;
mkdirSync(join(srcDir, 'catalog'), { recursive: true });
writeFileSync(join(srcDir, 'catalog/figmaCatalog.ts'), catalogTs);

removeOrphanComponentDirs(FINAL_CATALOG);

// Generate all component files
for (const entry of FINAL_CATALOG) {
  writeComponentFile(entry);
}

const implementedSlugs = FINAL_CATALOG.filter(isComponentImplemented).map((entry) => entry.slug);
writeFileSync(
  join(srcDir, 'catalog/implementedSlugs.ts'),
  `/** Auto-generated — real RN implementations (no scaffold marker) */\nimport type { FigmaComponentEntry } from './figmaCatalog.js';\n\nexport const implementedComponentSlugs = new Set(${JSON.stringify(implementedSlugs)}) as ReadonlySet<string>;\n\nexport function isImplementedCatalogEntry(entry: Pick<FigmaComponentEntry, 'slug'>): boolean {\n  return implementedComponentSlugs.has(entry.slug);\n}\n`,
);

const previewLoaderLines = [
  ...FINAL_CATALOG.map((entry) => {
    const rel = `../${entry.tier}/${entry.family}/${kebabFromExport(entry.exportName)}/${entry.exportName}.js`;
    return `  ${entry.exportName}: () => require('${rel}').${entry.exportName},`;
  }),
  `  EgMenu: () => require('../molecules/dropdown/menu/EgMenu.js').EgMenu,`,
  `  EgMenuTrigger: () => require('../molecules/dropdown/menu/EgMenuTrigger.js').EgMenuTrigger,`,
  `  EgSheets: () => require('../organisms/sheets/EgSheets.js').EgSheets,`,
];

writeFileSync(
  join(srcDir, 'preview/previewComponentLoaders.generated.ts'),
  `/** Auto-generated — lazy catalog preview loads (no barrel import). */\nimport type { ComponentType } from 'react';\n\ntype PreviewLoader = () => ComponentType<Record<string, unknown>>;\n\nexport const previewComponentLoaders: Record<string, PreviewLoader> = {\n${previewLoaderLines.join('\n')}\n};\n\nconst cache = new Map<string, ComponentType<Record<string, unknown>> | null>();\n\nexport function loadPreviewComponent(\n  exportName: string,\n): ComponentType<Record<string, unknown>> | null {\n  if (cache.has(exportName)) {\n    return cache.get(exportName) ?? null;\n  }\n\n  const loader = previewComponentLoaders[exportName];\n  if (!loader) {\n    cache.set(exportName, null);\n    return null;\n  }\n\n  try {\n    const component = loader();\n    cache.set(exportName, component);\n    return component;\n  } catch {\n    cache.set(exportName, null);\n    return null;\n  }\n}\n`,
);

writeFileSync(
  join(srcDir, 'catalogEntry.ts'),
  `/** Auto-generated — showcase / catalog surfaces (no 202-component barrel). */\nexport { figmaComponentCatalog, figmaComponentCount } from './catalog/figmaCatalog.js';\nexport type { FigmaComponentEntry } from './catalog/figmaCatalog.js';\nexport { implementedComponentSlugs, isImplementedCatalogEntry } from './catalog/implementedSlugs.js';\nexport { createCatalogPreviewProps } from './preview/createCatalogPreviewProps.js';\nexport type { CatalogPreviewProps } from './preview/createCatalogPreviewProps.js';\nexport { catalogPreviewCanvasStyle, catalogPreviewItemStyle } from './preview/catalogPreviewCanvas.js';\nexport { resolvePreviewComponent } from './preview/resolvePreviewComponent.js';\nexport { EgSymbol } from './atoms/_shared/symbol/EgSymbol.js';\nexport type { EgSymbolProps, EgSymbolSize } from './atoms/_shared/symbol/EgSymbol.js';\nexport * from './theme/index.js';\n`,
);

// index.ts barrel exports
const exports = FINAL_CATALOG.filter(
  (e) => e.exportName !== 'EgAvatarPreset0' && e.exportName !== 'EgAvatarPreset1',
).map((e) => {
  if (e.exportName === 'EgButtonGlass') {
    return `export {
  EgButtonGlass,
  EgButtonGlassNavAvatarFrame,
  EgButtonGlassNavIconPlusSlotContent,
  egButtonGlassAvatarElementMarginPx,
  egButtonGlassAvatarInsetPx,
  egButtonGlassSplitPairGapPx,
  resolveEgButtonGlassPressIntensity,
  shouldUseEgButtonGlassNativeStack,
  resolveEgButtonGlassRenderStack,
  readEgButtonGlassStackDiagnostics,
} from './molecules/button/button-glass';
export type {
  EgButtonGlassProps,
  EgButtonGlassKind,
  EgButtonGlassIconCount,
  EgButtonGlassRenderStack,
  EgButtonGlassStackDiagnostics,
} from './molecules/button/button-glass';`;
  }
  if (e.exportName === 'EgNavBar') {
    return `export {
  EgNavBar,
  shouldUseEgNavBarNativeStack,
  egNavBarNativeStackOptions,
  egNavBarNativeStackScreenOptions,
  egNavBarNativeStackHeaderGlassItem,
  useEgNavBarScroll,
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarContentHeight,
  egNavBarScrollContentReserve,
} from './organisms/tab-bar/nav-bar';
export type {
  EgNavBarProps,
  EgNavBarAction,
  EgNavBarBackground,
  EgNavBarScrollEdgeEffect,
  EgNavBarScrollOffset,
  EgNavBarNativeStackOptions,
  EgNavBarNativeStackOptionsInput,
  EgNavBarNativeStackScreenOptionsInput,
} from './organisms/tab-bar/nav-bar';`;
  }
  if (e.exportName === 'EgAvatar') {
    return `export {
  EgAvatar,
  EgAvatarPreset0,
  EgAvatarPreset1,
  AVATAR_NATIVE_PALETTE,
  AVATAR_NATIVE_PALETTE_SIZE,
  AVATAR_ROBOT_ASSET_NAME,
  formatAvatarPaletteName,
  pickAvatarColorIndex,
  resolveAvatarAssetName,
  resolveAvatarInitials,
} from './atoms/avatar';
export type {
  EgAvatarProps,
  EgAvatarSize,
  EgAvatarVariant,
  EgAvatarPreset0Props,
  EgAvatarPreset1Props,
  AvatarPaletteColor,
} from './atoms/avatar';`;
  }
  if (e.exportName === 'EgCregisTabBar') {
    return `export {
  EgCregisTabBar,
  EgCregisTabBarNativeLayout,
  CREGIS_TAB_BAR_ITEMS,
  CREGIS_TAB_BAR_NATIVE_TABS,
  createEgCregisTabBarBottomTabsBinding,
  egCregisTabBarNativeBottomTabsScreenOptions,
} from './organisms/tab-bar/cregis-tab-bar';
export type {
  EgCregisTabBarProps,
  EgCregisTabBarNativeLayoutProps,
  EgCregisTabBarNativeBottomTabsScreenOptions,
} from './organisms/tab-bar/cregis-tab-bar';`;
  }
  if (e.exportName === 'EgTabBar') {
    return `export {
  EgTabBar,
  EgTabBarBottomTabsDock,
  EgTabBarNativeLayout,
  EgTabBarNativeView,
  EG_TAB_BAR_NATIVE_TABS,
  shouldUseEgTabBarNativeStack,
  egTabBarScrollContentReserve,
  egTabBarScrollContentReserveWithSafeArea,
  egTabBarScrollContentReserveForList,
  useEgTabBarShellLayout,
  egTabBarPillTrackHeight,
  egTabBarShellLayoutHeight,
  tabBarTrackIntrinsicHeight,
  TAB_BAR_PILL_TRACK_HEIGHT,
  createEgTabBarBottomTabsBinding,
  createEgTabBarExpoBottomTabsBinding,
  egTabBarRouteNameForIndex,
  egTabBarSelectedIndexForActiveRoute,
} from './organisms/tab-bar/tab-bar';
export type {
  EgTabBarNativeLayoutProps,
  EgTabBarNativeTabSpec,
  EgTabBarNativeImageSource,
  EgTabBarNativeTriggerIcon,
  EgTabBarNativeViewProps,
  EgTabBarBottomTabNavigation,
  EgTabBarBottomTabNavigationState,
  EgTabBarBottomTabRoute,
  EgTabBarExpoBottomTabsEmitter,
  EgTabBarNavBindItem,
} from './organisms/tab-bar/tab-bar';`;
  }
  return `export { ${e.exportName} } from './${e.tier}/${e.family}/${kebabFromExport(e.exportName)}';`;
});
writeFileSync(
  join(srcDir, 'index.ts'),
  `${exports.join('\n')}
export { EgTabBlock } from './molecules/tab/tab-block';
export type { EgTabBlockItem, EgTabBlockProps } from './molecules/tab/tab-block';
export { useEgHorizontalSegmentSwipe } from './molecules/tab/_shared/useEgHorizontalSegmentSwipe';
export { EG_TAB_BLOCK_SCENE_CONTENT_INSET } from './molecules/tab/_shared/egTabBlockMetrics';
export {
  EgMenu,
  EgMenuTrigger,
  shouldUseEgMenuNativeStack,
  resolveEgMenuRenderStack,
} from './molecules/dropdown/menu';
export type {
  EgMenuItem,
  EgMenuProps,
  EgMenuSection,
  EgMenuTriggerContext,
  EgMenuTriggerProps,
} from './molecules/dropdown/menu';
export { EgSheets } from './organisms/sheets';
export type { EgSheetsDetent, EgSheetsProps } from './organisms/sheets';
export { EgSymbol } from './atoms/_shared/symbol/EgSymbol.js';\nexport type { EgSymbolProps, EgSymbolSize } from './atoms/_shared/symbol/EgSymbol.js';\nexport {\n  EgGlass,\n  GlassSurface,\n  GlassInteraction,\n  GlassContainer,\n  GlassControlShell,\n  GlassBlurScope,\n  GlassBlurBackdrop,\n  useGlassBlurTargetRef,\n  getNativeBlurView,\n  nativeBlurIntensity,\n  resolveAndroidBlurMethod,\n  getNativeLinearGradient,\n  getSkiaModule,\n  isSkiaGlassAvailable,\n  resolveGlassBoxComposition,\n  glassBoxViewStyle,\n  glassBoxNativeBlurIntensity,\n} from './atoms/glass/index.js';\nexport type {\n  EgGlassProps,\n  GlassVariant,\n  GlassShape,\n  GlassSurfaceProps,\n  GlassInteractionProps,\n  GlassContainerProps,\n  GlassControlShape,\n  GlassControlShellProps,\n  GlassBoxClassName,\n  GlassBoxComposition,\n  GlassBoxLayer,\n  GlassBoxShadowLayer,\n} from './atoms/glass/index.js';\nexport { figmaComponentCatalog, figmaComponentCount } from './catalog/figmaCatalog';\nexport type { FigmaComponentEntry } from './catalog/figmaCatalog';\nexport { implementedComponentSlugs, isImplementedCatalogEntry } from './catalog/implementedSlugs';\nexport { createCatalogPreviewProps } from './preview/createCatalogPreviewProps';\nexport type { CatalogPreviewProps } from './preview/createCatalogPreviewProps';\nexport { catalogPreviewCanvasStyle, catalogPreviewItemStyle } from './preview/catalogPreviewCanvas';\nexport { resolvePreviewComponent } from './preview/resolvePreviewComponent';\nexport { AtomGallery, atomGalleryFamily } from './preview/AtomGallery';\nexport type { AtomGalleryFamily } from './preview/AtomGallery';\nexport { PARITY_CONTAINER_WIDTH, ParityHarness, parityCatalogEntries } from './preview/ParityHarness';\nexport type { ParityMeasurement, ParityReport } from './preview/ParityHarness';\nexport { LiquidGlassDemo } from './preview/LiquidGlassDemo';\nexport { MotionDemo } from './preview/MotionDemo';\nexport { EgEdsAnimaPress } from './shared/motion/EgEdsAnimaPress.js';\nexport type { EgEdsAnimaPressProps } from './shared/motion/EgEdsAnimaPress.js';\nexport { useEgSlideTrack } from './shared/motion/useEgSlideTrack.js';\nexport type { EgSlideTrackOptions } from './shared/motion/useEgSlideTrack.js';\nexport { EgEdsAnimaSlide } from './shared/motion/EgEdsAnimaSlide.js';\nexport type { EgEdsAnimaSlideItem, EgEdsAnimaSlideProps } from './shared/motion/EgEdsAnimaSlide.js';\nexport {\n  EgEdsAnimaPage,\n  createEgEdsAnimaPageNavigator,\n  shouldUseEgEdsAnimaNativePage,\n} from './shared/motion/EgEdsAnimaPage.js';\nexport type { EgEdsAnimaPageDirection, EgEdsAnimaPageOptions } from './shared/motion/EgEdsAnimaPage.js';\nexport { EgEdsAnimaPageShot, EgEdsAnimaPageShotTrigger } from './shared/motion/EgEdsAnimaPageShot.js';\nexport type {\n  EgEdsAnimaPageShotPageApi,\n  EgEdsAnimaPageShotProps,\n  EgEdsAnimaPageShotRootApi,\n  EgEdsAnimaPageShotSource,\n  EgEdsAnimaPageShotTriggerProps,\n} from './shared/motion/EgEdsAnimaPageShot.js';\nexport { EgEdsAnimaLayoutContent } from './shared/motion/EgEdsAnimaLayoutContent.js';\nexport type { EgEdsAnimaLayoutContentProps } from './shared/motion/EgEdsAnimaLayoutContent.js';\nexport { useMotionPressScale } from './shared/useMotionPressScale.js';\nexport type { MotionPressRecipe, UseMotionPressScaleOptions } from './shared/useMotionPressScale.js';\nexport * from './theme';\n`,
);

console.log(`✓ Generated ${FINAL_CATALOG.length} components in packages/components/src`);
