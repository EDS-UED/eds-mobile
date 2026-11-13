import type { FigmaComponentEntry } from '../catalog/figmaCatalog.js';
import type { ThemeMode } from '../theme/index.js';

/**
 * Figma default-variant props for catalog preview surfaces.
 *
 * Variant props only — never layout. Sizing must come from each component's own
 * styles so Playground and consumer screens all resolve identically.
 */
export type CatalogPreviewProps = Record<string, unknown> & {
  testID: string;
  mode: ThemeMode;
};

export function createCatalogPreviewProps(
  entry: Pick<FigmaComponentEntry, 'slug' | 'family' | 'exportName' | 'figmaName'>,
  mode: ThemeMode = 'light',
): CatalogPreviewProps {
  const base: CatalogPreviewProps = {
    testID: entry.slug,
    mode,
  };

  switch (entry.slug) {
    case 'button-brand':
      return { ...base, label: 'Button', figmaType: 'primary', size: 'lg' };
    case 'button-decor':
      return { ...base, label: 'Button', figmaType: 'primary', size: 'lg' };
    case 'button-danger':
      return { ...base, label: 'Button', figmaType: 'primary', size: 'lg' };
    case 'button-link':
      return { ...base, label: 'Link', size: 'md', tone: 'brand' };
    case 'button-option':
      return { ...base, label: 'Option', figmaType: 'primary', size: 'lg' };
    case 'button-combo-action':
      return {
        ...base,
        primary: { label: 'Primary', size: 'lg' },
        secondary: { label: 'Secondary', size: 'lg' },
        layout: 'vertical',
      };
    case 'button-combo-action-alt':
      return {
        ...base,
        primary: { label: 'Primary', size: 'lg' },
        secondary: { label: 'Secondary', size: 'lg' },
        layout: 'horizontal',
      };
    case 'button-icon-container':
      return { ...base, figmaType: 'primary', size: 'md' };
    case 'button-glass':
      return {
        ...base,
        kind: 'text',
        size: 'md',
        label: '编辑',
      };
    case 'tab-bar-nav-bar':
      return {
        ...base,
        title: '标题',
        right: { kind: 'icon', icon: 'eds-list-lattice-mobile' },
        topInset: 0,
        manageStatusBar: false,
        background: 'visible',
      };

    case 'divider':
      return {
        ...base,
        variant: 'page',
        orientation: 'horizontal',
        visible: true,
      };

    case 'symbol-body':
      return {
        ...base,
        name: 'eds-wallet',
        size: 'lg',
      };

    case 'avatar-body':
      return {
        ...base,
        name: 'Nancy',
        size: 'lg',
        variant: 'initials',
        colorIndexMode: 'auto',
        randomColor: false,
      };
    case 'avatar-preset-0':
      return { ...base, size: 'lg' };
    case 'avatar-preset-1':
      return {
        ...base,
        name: 'Nancy',
        size: 'lg',
      };

    case 'input-input':
      return { ...base, placeholder: 'Input', size: 'xl' };
    case 'input-search':
      return { ...base, placeholder: 'Search' };
    case 'input-textarea':
      return { ...base, placeholder: 'Textarea' };
    case 'input-quick-input':
      return { ...base, placeholder: 'Quick input' };
    case 'input-pointer':
      return base;
    case 'input-combo-input-group':
      return {
        ...base,
        fields: [{ placeholder: 'Input' }, { placeholder: 'Input' }],
      };
    case 'input-combo-text-input':
      return {
        ...base,
        leading: { placeholder: 'Unit', size: 'sm' },
        main: { placeholder: 'Input' },
      };
    case 'input-combo-textarea-input':
      return {
        ...base,
        header: { placeholder: 'Header', size: 'sm' },
        body: { placeholder: 'Textarea' },
      };

    case 'tag-color':
      return { ...base, label: 'Tag', colorType: 'green', size: 'md' };
    case 'tag-color-alt':
      return { ...base, label: 'Tag', colorType: 'green', size: 'md' };
    case 'tag-system':
      return { ...base, label: 'Tag', systemType: 'subtle', size: 'md' };
    case 'tag-system-alt':
      return { ...base, label: 'Tag', systemType: 'strokeSubtle', size: 'md' };

    case 'toggle-switch':
      return { ...base, size: 'md', defaultValue: false };
    case 'toggle-checkbox':
      return { ...base, size: 'md', defaultChecked: false };
    case 'toggle-radio':
      return { ...base, size: 'md', defaultChecked: false };
    case 'toggle-decide':
      return { ...base, size: 'md', defaultDecided: false };

    case 'dropdown-trigger':
      return {
        ...base,
        defaultSelectedId: 'messages',
        triggerIcon: 'eds-more-ios',
        size: 'md',
        forceRnImplementation: true,
        placement: 'bottom',
        align: 'start',
        menuWidth: 268,
        menuMaxHeight: 580,
      };

    case 'menu-body':
      return {
        ...base,
        sections: [
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
          { items: [{ id: 'filters', label: '管理过滤' }] },
        ],
        defaultSelectedId: 'messages',
        triggerIcon: 'eds-more-ios',
        size: 'md',
        forceRnImplementation: true,
        placement: 'bottom',
        align: 'start',
        menuWidth: 268,
        menuMaxHeight: 580,
      };

    case 'tab-bar-base':
      return {
        ...base,
        defaultSelectedIndex: 0,
        items: [
          { key: '1', label: 'Label' },
          { key: '2', label: 'Label' },
          { key: '3', label: 'Label' },
          { key: '4', label: 'Label' },
          { key: '5', label: 'Label' },
        ],
      };
    case 'tab-bar-cregis':
      return {
        ...base,
        defaultSelectedIndex: 0,
      };
    case 'tab-bar-item':
      return { ...base, label: 'Label', selected: true };

    case 'tab-tabs':
      return {
        ...base,
        defaultSelectedId: '1',
        items: [
          { id: '1', label: 'Label' },
          { id: '2', label: 'Label' },
          { id: '3', label: 'Label' },
        ],
      };
    case 'tab-segmented-control':
      return {
        ...base,
        size: 'md',
        defaultSelectedIndex: 0,
        segments: ['Label', 'Label', 'Label'],
      };

    case 'feedback-reddot':
      return base;

    default:
      if (entry.family === 'icon' || entry.family === 'crypto') {
        return { ...base, size: 'lg' };
      }
      return base;
  }
}
