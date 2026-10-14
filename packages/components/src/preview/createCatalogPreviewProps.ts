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
      return { ...base, label: 'Link', size: 'md' };
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
        forceRnImplementation: false,
      };
    case 'tab-bar-nav-bar':
      return {
        ...base,
        title: '标题',
        right: { kind: 'icon', icon: 'eds-list-lattice-mobile' },
        topInset: 0,
        manageStatusBar: false,
        background: 'visible',
        forceRnImplementation: false,
      };

    case 'divider':
      return {
        ...base,
        variant: 'page',
        orientation: 'horizontal',
        visible: true,
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
      return { ...base, placeholder: 'Trigger' };

    case 'tab-bar-base':
      return {
        ...base,
        forceRnImplementation: true,
        defaultSelectedIndex: 0,
        items: [
          { key: '1', label: 'Label' },
          { key: '2', label: 'Label' },
          { key: '3', label: 'Label' },
          { key: '4', label: 'Label' },
          { key: '5', label: 'Label' },
        ],
      };
    case 'tab-bar-item':
      return { ...base, label: 'Label', selected: true };

    default:
      if (entry.family === 'icon' || entry.family === 'crypto') {
        return { ...base, size: 'lg' };
      }
      return base;
  }
}
