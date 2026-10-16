import {
  AVATAR_NATIVE_PALETTE_SIZE,
  formatAvatarPaletteName,
} from '@eds/mobile-components';

import type { DocCustomizeControl, DocPropRow } from './types.js';
import { buildRnSelfClosingSnippet } from './buildRnUsageSnippet.js';
import {
  BUTTON_SHOWCASE_SIZES,
  BUTTON_SHOWCASE_TONES,
  BUTTON_SHOWCASE_VARIANTS,
  BUTTON_SHOWCASE_WIDTHS,
  buttonShowcaseDefaults,
  buttonShowcaseExportForTone,
  buttonShowcaseVariantToFigmaType,
  type ButtonShowcaseTone,
} from './buttonShowcaseModel.js';

export type RnDocConfig = {
  componentTag: string;
  /** Catalog preview slug (playground ComponentDetailScreen). */
  previewSlug: string;
  previewMode?: 'slug' | 'family';
  family?: string;
  importCode: string;
  customizeDefaults: Record<string, unknown>;
  customizeControls: DocCustomizeControl[];
  propRows: DocPropRow[];
  buildUsageSnippet?: (state: Record<string, unknown>) => string;
  propQueryKeys?: string[];
};

const FIELD_EVENTS = [
  { value: 'default', label: '默认' },
  { value: 'entering', label: '输入中' },
  { value: 'done', label: '已完成' },
  { value: 'tap', label: '点击' },
  { value: 'disable', label: '禁用' },
] as const;

const CONTROL_SIZES = [
  { value: 'xl', label: 'XL' },
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
  { value: 'xs', label: 'XS' },
] as const;

const fieldCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: [...CONTROL_SIZES],
  },
  {
    kind: 'select',
    key: 'event',
    label: '交互',
    options: [...FIELD_EVENTS],
  },
  { kind: 'text', key: 'placeholder', label: '占位符' },
  { kind: 'boolean', key: 'disabled', label: '禁用' },
];

const fieldCustomizeDefaults = {
  size: 'xl',
  event: 'default',
  placeholder: 'Input',
  disabled: false,
} as const;

const fieldPropRows: DocPropRow[] = [
  { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'xl'", description: '控件尺寸' },
  { name: 'event', type: 'FieldEvent', defaultValue: 'undefined', description: '视觉交互态' },
  { name: 'placeholder', type: 'string', defaultValue: 'undefined', description: '占位文案' },
  { name: 'value', type: 'string', defaultValue: 'undefined', description: '受控值' },
  { name: 'defaultValue', type: 'string', defaultValue: 'undefined', description: '非受控初始值' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
  { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
];

function fieldDoc(
  componentTag: string,
  previewSlug: string,
  placeholder: string,
): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...fieldCustomizeDefaults, placeholder },
    customizeControls: fieldCustomizeControls,
    propRows: fieldPropRows,
    propQueryKeys: ['size', 'event', 'placeholder', 'disabled'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, {
        defaults: { ...fieldCustomizeDefaults, placeholder },
      }),
  };
}

const buttonCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: '色调',
    options: [...BUTTON_SHOWCASE_TONES],
  },
  {
    kind: 'select',
    key: 'variant',
    label: '风格',
    options: [...BUTTON_SHOWCASE_VARIANTS],
  },
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: [...BUTTON_SHOWCASE_SIZES],
  },
  {
    kind: 'select',
    key: 'width',
    label: '宽度',
    options: [...BUTTON_SHOWCASE_WIDTHS],
  },
  { kind: 'text', key: 'label', label: '文案' },
  { kind: 'boolean', key: 'disabled', label: '禁用' },
  { kind: 'boolean', key: 'loading', label: '加载中' },
];

const TAG_SIZES = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
] as const;

function colorTagDoc(componentTag: string, previewSlug: string): RnDocConfig {
  const defaults = { label: 'Tag', colorType: 'green', size: 'md' } as const;
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...defaults },
    customizeControls: [
      { kind: 'text', key: 'label', label: '文案' },
      {
        kind: 'select',
        key: 'colorType',
        label: '颜色',
        options: [
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' },
          { value: 'orange', label: 'Orange' },
          { value: 'red', label: 'Red' },
        ],
      },
      { kind: 'select', key: 'size', label: '尺寸', options: [...TAG_SIZES] },
    ],
    propRows: [
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '标签文案' },
      { name: 'colorType', type: 'ColorTagType', defaultValue: "'green'", description: '颜色族' },
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
    ],
    propQueryKeys: ['label', 'colorType', 'size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults: { ...defaults } }),
  };
}

function systemTagDoc(componentTag: string, previewSlug: string): RnDocConfig {
  const defaults = { label: 'Tag', systemType: 'subtle', size: 'md' } as const;
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...defaults },
    customizeControls: [
      { kind: 'text', key: 'label', label: '文案' },
      {
        kind: 'select',
        key: 'systemType',
        label: '类型',
        options: [
          { value: 'subtle', label: 'Subtle' },
          { value: 'strokeSubtle', label: 'Stroke Subtle' },
          { value: 'stroke', label: 'Stroke' },
        ],
      },
      { kind: 'select', key: 'size', label: '尺寸', options: [...TAG_SIZES] },
    ],
    propRows: [
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '标签文案' },
      { name: 'systemType', type: 'SystemTagType', defaultValue: "'subtle'", description: '系统样式' },
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
    ],
    propQueryKeys: ['label', 'systemType', 'size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults: { ...defaults } }),
  };
}

const TOGGLE_SIZES = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
] as const;

function toggleDoc(
  componentTag: string,
  previewSlug: string,
  checkedKey: string,
  checkedLabel: string,
): RnDocConfig {
  const defaults = { size: 'md', [checkedKey]: false } as Record<string, unknown>;
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'select', key: 'size', label: '尺寸', options: [...TOGGLE_SIZES] },
      { kind: 'boolean', key: checkedKey, label: checkedLabel },
    ],
    propRows: [
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
      { name: checkedKey, type: 'boolean', defaultValue: 'false', description: checkedLabel },
    ],
    propQueryKeys: ['size', checkedKey],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults }),
  };
}

const DIVIDER_VARIANTS = [
  { value: 'module', label: 'Module (stroke-xs)' },
  { value: 'page', label: 'Page (stroke-xs)' },
] as const;

const DIVIDER_ORIENTATIONS = [
  { value: 'horizontal', label: '水平' },
  { value: 'vertical', label: '垂直' },
] as const;

function dividerDoc(): RnDocConfig {
  const componentTag = 'EgDivider';
  const defaults = {
    variant: 'page',
    orientation: 'horizontal',
    visible: true,
  } as const;
  return {
    componentTag,
    previewSlug: 'divider',
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...defaults },
    customizeControls: [
      { kind: 'select', key: 'variant', label: '类型', options: [...DIVIDER_VARIANTS] },
      { kind: 'select', key: 'orientation', label: '方向', options: [...DIVIDER_ORIENTATIONS] },
      { kind: 'boolean', key: 'visible', label: '显示' },
    ],
    propRows: [
      {
        name: 'variant',
        type: "'module' | 'page'",
        defaultValue: "'page'",
        description: 'Module / Page 线宽 stroke-xs；色 stroke-divider-module / stroke-divider-page',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: '水平或垂直',
      },
      { name: 'visible', type: 'boolean', defaultValue: 'true', description: '是否渲染分割线' },
      { name: 'length', type: 'number', defaultValue: 'undefined', description: '长轴长度（px）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['variant', 'orientation', 'visible'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, { defaults: { ...defaults } }),
  };
}

function minimalDoc(componentTag: string, previewSlug: string): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: {},
    customizeControls: [],
    propRows: [
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
      { name: 'testID', type: 'string', defaultValue: 'undefined', description: '测试 ID' },
    ],
    propQueryKeys: [],
    buildUsageSnippet: () => buildRnSelfClosingSnippet(componentTag, {}, { defaults: {} }),
  };
}

function familyDoc(family: string): RnDocConfig {
  const title = family.replace(/-/g, ' ');
  return {
    componentTag: title,
    previewSlug: `${family}-body`,
    previewMode: 'family',
    family,
    importCode: `// Import scene components from '@eds/mobile-components'`,
    customizeDefaults: {},
    customizeControls: [],
    propRows: [
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: [],
    buildUsageSnippet: () => `// See individual scene pages under ${family}`,
  };
}

function symbolBodyDoc(): RnDocConfig {
  const defaults = {
    name: 'eds-wallet',
    size: 'lg',
    fillTone: '',
    strokeColorToken: '',
  };
  return {
    componentTag: 'EgSymbol',
    previewSlug: 'symbol-body',
    importCode: `import { EgSymbol } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'name', label: 'name（资产名）', placeholder: 'eds-wallet' },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
        ],
      },
      {
        kind: 'select',
        key: 'fillTone',
        label: 'fillTone',
        options: [
          { value: '', label: '默认' },
          { value: 'primary', label: 'primary' },
          { value: 'brand', label: 'brand' },
        ],
      },
      {
        kind: 'text',
        key: 'strokeColorToken',
        label: 'strokeColorToken',
        placeholder: 'stroke-base-primary',
      },
    ],
    propRows: [
      { name: 'name', type: 'string', defaultValue: 'required', description: 'icon/crypto 资产名' },
      { name: 'size', type: 'EgSymbolSize', defaultValue: "'md'", description: 'symbol-xs … symbol-lg' },
      { name: 'fillTone', type: "'primary' | 'brand'", defaultValue: 'undefined', description: 'token icon 填色' },
      { name: 'strokeColorToken', type: 'string', defaultValue: "'text-base-primary'", description: '描边 semantic token' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['name', 'size', 'fillTone', 'strokeColorToken'],
    buildUsageSnippet: (state) => {
      const payload: Record<string, unknown> = {
        name: state.name ?? defaults.name,
        size: state.size ?? defaults.size,
      };
      if (state.fillTone) payload.fillTone = state.fillTone;
      if (state.strokeColorToken) payload.strokeColorToken = state.strokeColorToken;
      return buildRnSelfClosingSnippet('EgSymbol', payload, {
        defaults: { name: defaults.name, size: defaults.size },
      });
    },
  };
}

function avatarBodyDoc(): RnDocConfig {
  const avatarSizeOptions = [
    { value: 'xs', label: 'xs · 16px' },
    { value: 'sm', label: 'sm · 24px' },
    { value: 'md', label: 'md · 32px' },
    { value: 'lg', label: 'lg · 36px' },
    { value: 'xl', label: 'xl · 40px' },
    { value: '2xl', label: '2xl · 40px' },
  ] as const;
  const colorIndexOptions = [
    { value: 'auto', label: '自动（按 name）' },
    ...Array.from({ length: AVATAR_NATIVE_PALETTE_SIZE }, (_, index) => ({
      value: String(index),
      label: formatAvatarPaletteName(index),
    })),
  ];
  const defaults = {
    name: 'Nancy',
    initials: '',
    size: 'lg',
    variant: 'initials',
    colorIndexMode: 'auto',
    randomColor: false,
  };
  return {
    componentTag: 'EgAvatar',
    previewSlug: 'avatar-body',
    importCode: `import { EgAvatar } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'name', label: '姓名' },
      { kind: 'text', key: 'initials', label: '缩写', placeholder: '留空则取首字' },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [...avatarSizeOptions],
      },
      {
        kind: 'select',
        key: 'variant',
        label: '类型',
        options: [
          { value: 'initials', label: '首字（web3-avatar）' },
          { value: 'robot', label: 'eds-avatar-0' },
        ],
      },
      {
        kind: 'select',
        key: 'colorIndexMode',
        label: '原色盘',
        options: colorIndexOptions,
      },
      { kind: 'boolean', key: 'randomColor', label: '随机 web3-avatar' },
    ],
    propRows: [
      { name: 'name', type: 'string', defaultValue: 'undefined', description: '姓名 seed' },
      { name: 'initials', type: 'string', defaultValue: 'undefined', description: '显式首字' },
      { name: 'size', type: 'EgAvatarSize', defaultValue: "'lg'", description: '尺寸 token' },
      { name: 'variant', type: "'initials' | 'robot'", defaultValue: "'initials'", description: '首字 / 机器人' },
      { name: 'source', type: 'ImageSourcePropType', defaultValue: 'undefined', description: '图片头像（企业 Logo 等），优先于 variant' },
      { name: 'colorIndex', type: 'number', defaultValue: 'undefined', description: '0–19 原色索引' },
      { name: 'randomColor', type: 'boolean', defaultValue: 'false', description: '随机原色' },
      { name: 'colorSeed', type: 'string', defaultValue: 'undefined', description: '映射 seed' },
    ],
    propQueryKeys: ['name', 'initials', 'size', 'variant', 'colorIndexMode', 'randomColor'],
    buildUsageSnippet: (state) => {
      const payload: Record<string, unknown> = {
        name: state.name,
        size: state.size,
        variant: state.variant,
      };
      if (state.initials) payload.initials = state.initials;
      if (state.randomColor) {
        payload.randomColor = true;
      } else if (state.colorIndexMode !== 'auto') {
        payload.colorIndex = Number(state.colorIndexMode);
      }
      return buildRnSelfClosingSnippet('EgAvatar', payload, {
        defaults: { name: defaults.name, size: defaults.size, variant: defaults.variant },
      });
    },
  };
}

function avatarPreset0Doc(): RnDocConfig {
  const defaults = { size: 'lg' };
  return {
    componentTag: 'EgAvatarPreset0',
    previewSlug: 'avatar-preset-0',
    importCode: `import { EgAvatarPreset0 } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
          { value: 'xl', label: 'xl' },
          { value: '2xl', label: '2xl' },
        ],
      },
    ],
    propRows: [
      { name: 'size', type: 'EgAvatarSize', defaultValue: "'lg'", description: '尺寸' },
    ],
    propQueryKeys: ['size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgAvatarPreset0', state, { defaults }),
  };
}

function avatarPreset1Doc(): RnDocConfig {
  const defaults = { name: 'Nancy', size: 'lg' };
  return {
    componentTag: 'EgAvatarPreset1',
    previewSlug: 'avatar-preset-1',
    importCode: `import { EgAvatarPreset1 } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'name', label: '姓名' },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
          { value: 'xl', label: 'xl' },
          { value: '2xl', label: '2xl' },
        ],
      },
    ],
    propRows: [
      { name: 'name', type: 'string', defaultValue: 'undefined', description: '姓名' },
      { name: 'size', type: 'EgAvatarSize', defaultValue: "'lg'", description: '尺寸' },
    ],
    propQueryKeys: ['name', 'size'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgAvatarPreset1', state, { defaults }),
  };
}

function cregisTabBarDoc(): RnDocConfig {
  const tabIndexOptions = [
    { value: '0', label: '主页' },
    { value: '1', label: '钱包' },
    { value: '2', label: '协作' },
    { value: '3', label: '交易记录' },
  ] as const;
  const defaults = { defaultSelectedIndex: 0, disabled: false };
  return {
    componentTag: 'EgCregisTabBar',
    previewSlug: 'tab-bar-cregis',
    importCode: `// iOS 26+ 系统 Tab 条：根 _layout 用 Layout · 页内容器用 NativeView
import { EgCregisTabBarNativeLayout, EgTabBarNativeView, CREGIS_TAB_BAR_NATIVE_TABS } from '@eds/mobile-components';
// Android / iOS ≤25：RN
import { EgCregisTabBar } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'defaultSelectedIndex',
        label: '默认选中',
        options: [...tabIndexOptions],
      },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
    ],
    propRows: [
      { name: 'items', type: 'EgTabBarItemData[]', defaultValue: 'CREGIS_TAB_BAR_ITEMS', description: '可选覆盖；默认主页 / 钱包 / 协作 / 交易记录' },
      { name: 'selectedIndex', type: 'number', defaultValue: 'undefined', description: '受控选中索引' },
      { name: 'defaultSelectedIndex', type: 'number', defaultValue: '0', description: '非受控默认选中' },
      { name: 'onSelectedIndexChange', type: '(index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['defaultSelectedIndex', 'disabled'],
    buildUsageSnippet: (state) => {
      const index = Number(state.defaultSelectedIndex ?? 0);
      return buildRnSelfClosingSnippet('EgCregisTabBar', { ...state, defaultSelectedIndex: index }, {
        defaults,
      });
    },
  };
}

function tabBarBaseDoc(): RnDocConfig {
  const tabIndexOptions = [
    { value: '0', label: 'Tab 1' },
    { value: '1', label: 'Tab 2' },
    { value: '2', label: 'Tab 3' },
    { value: '3', label: 'Tab 4' },
    { value: '4', label: 'Tab 5' },
  ] as const;
  const defaults = { defaultSelectedIndex: 0, disabled: false };
  return {
    componentTag: 'EgTabBar',
    previewSlug: 'tab-bar-base',
    importCode: `// iOS 26+ 系统 Tab 条：根 _layout 用 Layout · 页内容器用 NativeView
import { EgTabBarNativeLayout, EgTabBarNativeView } from '@eds/mobile-components';
// Android / iOS ≤25：RN
import { EgTabBar } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      {
        kind: 'select',
        key: 'defaultSelectedIndex',
        label: '默认选中',
        options: [...tabIndexOptions],
      },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
    ],
    propRows: [
      { name: 'items', type: 'EgTabBarItemData[]', defaultValue: '5 × Label', description: 'Tab 配置' },
      { name: 'selectedIndex', type: 'number', defaultValue: 'undefined', description: '受控选中索引' },
      { name: 'defaultSelectedIndex', type: 'number', defaultValue: '0', description: '非受控默认选中' },
      { name: 'onSelectedIndexChange', type: '(index: number) => void', defaultValue: 'undefined', description: '选中变化' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['defaultSelectedIndex', 'disabled'],
    buildUsageSnippet: (state) => {
      const index = Number(state.defaultSelectedIndex ?? 0);
      return buildRnSelfClosingSnippet('EgTabBar', { ...state, defaultSelectedIndex: index }, {
        defaults,
      });
    },
  };
}

function tabBarItemDoc(): RnDocConfig {
  const defaults = { label: 'Label', selected: true };
  return {
    componentTag: 'EgTabBarItem',
    previewSlug: 'tab-bar-item',
    importCode: `import { EgTabBarItem } from '@eds/mobile-components';`,
    customizeDefaults: defaults,
    customizeControls: [
      { kind: 'text', key: 'label', label: '文案' },
      { kind: 'boolean', key: 'selected', label: '选中' },
    ],
    propRows: [
      { name: 'label', type: 'string', defaultValue: 'undefined', description: 'Tab 文案' },
      { name: 'selected', type: 'boolean', defaultValue: 'false', description: '选中态' },
      { name: 'embedded', type: 'boolean', defaultValue: 'false', description: '嵌入 EgTabBar（指示器负责底）' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['label', 'selected'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgTabBarItem', state, { defaults }),
  };
}

const BUTTON_IMPORT =
  "import { EgBrandButton, EgDecorButton, EgDangerButton, EgOptionButton } from '@eds/mobile-components';";

function buttonDoc(
  componentTag: string,
  previewSlug: string,
  options?: { label?: string; defaultTone?: ButtonShowcaseTone },
): RnDocConfig {
  const label = options?.label ?? 'Button';
  const defaultTone = options?.defaultTone ?? 'brand';
  const customizeDefaults = { ...buttonShowcaseDefaults, tone: defaultTone, label };

  return {
    componentTag,
    previewSlug,
    importCode: componentTag === 'EgButton' ? BUTTON_IMPORT : `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults,
    customizeControls: buttonCustomizeControls,
    propRows: [
      {
        name: 'tone',
        type: "'brand' | 'decor' | 'danger' | 'option'",
        defaultValue: `'${defaultTone}'`,
        description: '色调（Mobile 对应 EgBrand / Decor / Danger / Option）',
      },
      {
        name: 'variant',
        type: "'solid' | 'outline' | 'text'",
        defaultValue: "'solid'",
        description: '风格 · RN 映射 figmaType primary / secondary / tertiary',
      },
      { name: 'size', type: "'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'lg'", description: '尺寸' },
      { name: 'width', type: "'hug' | 'fill'", defaultValue: "'hug'", description: 'Hug 自适应 · Fill 撑满容器' },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '按钮文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '加载态' },
      {
        name: 'figmaType',
        type: "'primary' | 'secondary' | 'tertiary'",
        defaultValue: "'primary'",
        description: '由 variant 推导 · solid→primary · outline→secondary · text→tertiary',
      },
    ],
    propQueryKeys: ['tone', 'variant', 'size', 'width', 'label', 'disabled', 'loading'],
    buildUsageSnippet: (state) => {
      const tone = String(state.tone ?? defaultTone);
      const tag = buttonShowcaseExportForTone(tone);
      const figmaType = buttonShowcaseVariantToFigmaType(String(state.variant ?? 'solid'));
      const snippetProps: Record<string, unknown> = {
        figmaType,
        size: state.size,
        label: state.label,
        disabled: state.disabled,
        loading: state.loading,
      };
      if (state.width === 'fill') {
        snippetProps.style = { alignSelf: 'stretch', width: '100%' };
      }
      return buildRnSelfClosingSnippet(tag, snippetProps, {
        defaults: {
          figmaType: buttonShowcaseVariantToFigmaType(String(customizeDefaults.variant)),
          size: customizeDefaults.size,
          label: customizeDefaults.label,
          disabled: customizeDefaults.disabled,
          loading: customizeDefaults.loading,
        },
      });
    },
  };
}

/** `{family}-body` → 族基准场景 slug（对齐 Desktop「本体」文档页）。 */
export const familyBodyPreviewSlug: Record<string, string> = {
  'input-body': 'input-input',
  'button-body': 'button-brand',
  'tag-body': 'tag-color',
  'toggle-body': 'toggle-switch',
  'dropdown-body': 'dropdown-trigger',
  'tab-bar-body': 'tab-bar-base',
  'tab-body': 'tab-base-tab',
  'avatar-body': 'avatar-body',
  'symbol-body': 'symbol-body',
};

const inputCustomizeControls: DocCustomizeControl[] = [
  ...fieldCustomizeControls,
  {
    kind: 'boolean',
    key: 'showPaste',
    label: '粘贴',
    exclusiveKeys: ['showUnit', 'showMax'],
  },
  {
    kind: 'boolean',
    key: 'showUnit',
    label: '单位',
    exclusiveKey: 'showPaste',
  },
  {
    kind: 'text',
    key: 'unit',
    label: '单位文案',
    visibleWhen: (state) => Boolean(state.showUnit),
  },
  {
    kind: 'boolean',
    key: 'showMax',
    label: 'Max',
    exclusiveKey: 'showPaste',
  },
];

const inputCustomizeDefaults = {
  ...fieldCustomizeDefaults,
  showPaste: false,
  showUnit: false,
  showMax: false,
  unit: 'Unit',
} as const;

const inputPropRows: DocPropRow[] = [
  ...fieldPropRows,
  { name: 'showPaste', type: 'boolean', defaultValue: 'false', description: '显示 Paste（Body Small Strong · brand）' },
  { name: 'showUnit', type: 'boolean', defaultValue: 'false', description: '显示单位后缀' },
  { name: 'unit', type: 'string', defaultValue: "'Unit'", description: '单位文案' },
  { name: 'showMax', type: 'boolean', defaultValue: 'false', description: '显示 Max（Body Medium Strong · brand）' },
];

function inputDoc(componentTag: string, previewSlug: string): RnDocConfig {
  return {
    componentTag,
    previewSlug,
    importCode: `import { ${componentTag} } from '@eds/mobile-components';`,
    customizeDefaults: { ...inputCustomizeDefaults, placeholder: 'Input' },
    customizeControls: inputCustomizeControls,
    propRows: inputPropRows,
    propQueryKeys: [
      'size',
      'event',
      'placeholder',
      'disabled',
      'showPaste',
      'showUnit',
      'showMax',
      'unit',
    ],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(componentTag, state, {
        defaults: { ...inputCustomizeDefaults, placeholder: 'Input' },
      }),
  };
}

const GLASS_BOX_TYPE_OPTIONS = [
  { value: 'glass-button-box', label: 'Button' },
  { value: 'glass-flotation-box', label: 'Flotation' },
  { value: 'glass-tabbar-box', label: 'TabBar' },
  { value: 'glass-mask-box', label: 'Mask' },
] as const;

function egGlassShowcaseDoc(): RnDocConfig {
  const defaultBox = 'glass-button-box';
  return {
    componentTag: 'EgGlass',
    previewSlug: 'glass-eg',
    importCode: `import { EgGlass, GlassBlurScope } from '@eds/mobile-components';`,
    customizeDefaults: { box: defaultBox, mode: 'light' },
    customizeControls: [
      {
        kind: 'select',
        key: 'box',
        label: 'Type',
        options: [...GLASS_BOX_TYPE_OPTIONS],
      },
      {
        kind: 'select',
        key: 'mode',
        label: '主题',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
      },
    ],
    propRows: [
      {
        name: 'box',
        type: 'GlassBoxClassName',
        defaultValue: JSON.stringify(defaultBox),
        description: 'Effect Glass Box 场景（Type）',
      },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['mode', 'box'],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet('EgGlass', state, {
        defaults: { box: defaultBox, mode: 'light' },
      }),
  };
}

export const rnDocBySlug: Record<string, RnDocConfig> = {
  'input-body': inputDoc('EgInput', 'input-input'),
  'input-input': inputDoc('EgInput', 'input-input'),
  'input-search': {
    ...fieldDoc('EgSearch', 'input-search', 'Search'),
    customizeDefaults: { size: 'md', event: 'default', placeholder: 'Search', disabled: false },
    propRows: [
      { name: 'size', type: "'xl' | 'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: '控件尺寸（Figma Search 为 md / 48px）' },
      {
        name: 'event',
        type: "'default' | 'tap' | 'entering' | 'done'",
        defaultValue: "'default'",
        description: 'Default=居中 pill；Tap=展开+光标在前；Entering=输入中；Done=已填内容',
      },
      { name: 'placeholder', type: 'string', defaultValue: "'Search'", description: '占位文案' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
  },
  'input-textarea': fieldDoc('EgTextarea', 'input-textarea', 'Textarea'),
  'input-quick-input': fieldDoc('EgQuickInput', 'input-quick-input', 'Quick input'),
  'input-pointer': {
    componentTag: 'EgInputPointer',
    previewSlug: 'input-pointer',
    importCode: `import { EgInputPointer } from '@eds/mobile-components';`,
    customizeDefaults: {},
    customizeControls: [],
    propRows: [{ name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' }],
    propQueryKeys: [],
    buildUsageSnippet: () => '<EgInputPointer />',
  },
  'button-body': buttonDoc('EgButton', 'button-brand'),
  'button-link': {
    componentTag: 'EgLinkButton',
    previewSlug: 'button-link',
    importCode: `import { EgLinkButton } from '@eds/mobile-components';`,
    customizeDefaults: { size: 'md', label: 'Link' },
    customizeControls: [
      { kind: 'select', key: 'size', label: '尺寸', options: [{ value: 'lg', label: 'LG' }, { value: 'md', label: 'MD' }, { value: 'sm', label: 'SM' }] },
      { kind: 'text', key: 'label', label: '文案' },
    ],
    propRows: [
      { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸' },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '链接文案' },
    ],
    propQueryKeys: ['size', 'label'],
    buildUsageSnippet: (state) => buildRnSelfClosingSnippet('EgLinkButton', state, { defaults: { size: 'md', label: 'Link' } }),
  },
  'tag-body': colorTagDoc('EgColorTag', 'tag-color'),
  'tag-color': colorTagDoc('EgColorTag', 'tag-color'),
  'tag-color-alt': colorTagDoc('EgColorTagAlt', 'tag-color-alt'),
  'tag-system': systemTagDoc('EgSystemTag', 'tag-system'),
  'tag-system-alt': systemTagDoc('EgSystemTagAlt', 'tag-system-alt'),
  'dropdown-body': fieldDoc('EgTriggerDropdown', 'dropdown-trigger', 'Trigger'),
  'dropdown-trigger': fieldDoc('EgTriggerDropdown', 'dropdown-trigger', 'Trigger'),
  'tab-bar-body': tabBarBaseDoc(),
  'tab-bar-base': tabBarBaseDoc(),
  'tab-bar-cregis': cregisTabBarDoc(),
  'tab-bar-item': tabBarItemDoc(),
  'toggle-body': toggleDoc('EgSwitch', 'toggle-switch', 'defaultValue', '默认开启'),
  'toggle-switch': toggleDoc('EgSwitch', 'toggle-switch', 'defaultValue', '默认开启'),
  'toggle-checkbox': toggleDoc('EgCheckbox', 'toggle-checkbox', 'defaultChecked', '默认选中'),
  'toggle-radio': toggleDoc('EgRadio', 'toggle-radio', 'defaultChecked', '默认选中'),
  'toggle-decide': toggleDoc('EgDecide', 'toggle-decide', 'defaultDecided', '默认决定'),
  'button-combo-action': minimalDoc('EgComboActionButton', 'button-combo-action'),
  'button-combo-action-alt': minimalDoc('EgComboActionButtonAlt', 'button-combo-action-alt'),
  'button-icon-container': minimalDoc('EgIconContainerButton', 'button-icon-container'),
  'button-glass': {
    componentTag: 'EgButtonGlass',
    previewSlug: 'button-glass',
    importCode: `import { EgButtonGlass } from '@eds/mobile-components';`,
    customizeDefaults: {
      kind: 'text',
      size: 'md',
      label: '编辑',
      icon: 'eds-list-lattice-mobile',
      iconCount: 1,
      iconAlt: 'eds-add',
      disabled: false,
      showAvatarSlot: false,
      forceRnImplementation: false,
    },
    customizeControls: [
      {
        kind: 'select',
        key: 'kind',
        label: '类型',
        options: [
          { value: 'text', label: '文本胶囊' },
          { value: 'icon', label: '圆形图标' },
        ],
      },
      {
        kind: 'select',
        key: 'size',
        label: '尺寸',
        options: [
          { value: 'lg', label: 'LG' },
          { value: 'md', label: 'MD' },
          { value: 'sm', label: 'SM' },
          { value: 'xs', label: 'XS' },
        ],
        visibleWhen: (state) => state.kind === 'text' || state.kind === undefined,
      },
      {
        kind: 'text',
        key: 'label',
        label: '文案',
        visibleWhen: (state) => state.kind === 'text' || state.kind === undefined,
      },
      {
        kind: 'select',
        key: 'iconCount',
        label: '数量',
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
        ],
        visibleWhen: (state) => state.kind === 'icon',
      },
      {
        kind: 'text',
        key: 'icon',
        label: 'Symbol',
        visibleWhen: (state) => state.kind === 'icon',
      },
      {
        kind: 'text',
        key: 'iconAlt',
        label: 'Symbol 2',
        visibleWhen: (state) => state.kind === 'icon' && String(state.iconCount ?? '1') === '2',
      },
      {
        kind: 'boolean',
        key: 'showAvatarSlot',
        label: '头像槽（EgAvatar lg）',
        visibleWhen: (state) =>
          state.kind === 'text' ||
          (state.kind === 'icon' && String(state.iconCount ?? '1') !== '2'),
      },
      { kind: 'boolean', key: 'disabled', label: '禁用' },
      {
        kind: 'boolean',
        key: 'forceRnImplementation',
        label: '文档对照：RN 实现（业务侧 iOS 26+ 强制系统 Liquid Glass）',
      },
    ],
    propRows: [
      {
        name: 'kind',
        type: "'text' | 'icon'",
        defaultValue: "'text'",
        description: '文本胶囊 / 圆形图标',
      },
      { name: 'label', type: 'string', defaultValue: 'undefined', description: '文本按钮文案' },
      {
        name: 'size',
        type: "'lg' | 'md' | 'sm' | 'xs'",
        defaultValue: "'md'",
        description:
          'RN / iOS 26+ 原生：Pressable 边距同 token（文本同 EgButton；icon spacing-1 / 双 icon spacing-4）；勿在 GlassView 上叠 padding',
      },
      {
        name: 'avatarSlot',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'icon — count 1 替换 icon；count 2 替换右侧 iconAlt（EgAvatar lg）',
      },
      { name: 'icon', type: 'string', defaultValue: 'undefined', description: '主 icon symbol' },
      {
        name: 'iconCount',
        type: '1 | 2',
        defaultValue: '1',
        description: 'Icon 数量（最大 2）',
      },
      { name: 'iconAlt', type: 'string', defaultValue: 'undefined', description: '第二个 symbol（iconCount=2）' },
      { name: 'variant', type: "'regular' | 'prominent' | 'clear'", defaultValue: "'clear'", description: 'iOS 液态玻璃档位' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用' },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: ['kind', 'size', 'label', 'avatarSlot', 'icon', 'iconCount', 'iconAlt', 'disabled'],
    buildUsageSnippet: (state) => {
      const kind = String(state.kind ?? 'text');
      if (kind === 'icon') {
        return buildRnSelfClosingSnippet('EgButtonGlass', state, {
          defaults: { kind: 'icon', icon: 'eds-list-lattice-mobile', iconCount: 1 },
        });
      }
      return buildRnSelfClosingSnippet('EgButtonGlass', state, {
        defaults: { kind: 'text', size: 'md', label: '编辑' },
      });
    },
  },
  'tab-bar-nav-bar': {
    componentTag: 'EgNavBar',
    previewSlug: 'tab-bar-nav-bar',
    importCode: `// iOS 26+：<Stack.Screen options={egNavBarNativeStackOptions({ title })} />
import { egNavBarNativeStackOptions } from '@eds/mobile-components';
// Android / iOS ≤25：RN
import { EgNavBar, useEgNavBarScroll } from '@eds/mobile-components';`,
    customizeDefaults: {
      title: '标题',
      showLeft: true,
      showTitle: true,
      showRight: true,
      rightIconCount: 1,
      background: 'auto',
      statusBarZone: true,
    },
    customizeControls: [
      { kind: 'boolean', key: 'showLeft', label: '左侧（返回）' },
      { kind: 'boolean', key: 'showTitle', label: '标题' },
      {
        kind: 'text',
        key: 'title',
        label: '标题文案（隐藏时 iOS 26+ 仍须非空 · VoiceOver）',
      },
      { kind: 'boolean', key: 'showRight', label: '右侧' },
      {
        kind: 'select',
        key: 'rightIconCount',
        label: '右侧数量',
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
        ],
        visibleWhen: (state) => state.showRight !== false,
      },
      {
        kind: 'select',
        key: 'background',
        label: '背景',
        options: [
          { value: 'auto', label: '自动（滚动显现）' },
          { value: 'visible', label: '显示' },
          { value: 'hidden', label: '隐藏' },
        ],
      },
      { kind: 'boolean', key: 'statusBarZone', label: '状态栏区（safeArea.top）' },
    ],
    propRows: [
      {
        name: 'title',
        type: 'string',
        defaultValue: 'undefined',
        description:
          '中间标题 · 17 / 600。iOS 26+ 系统栏不可为空串；showTitle: false 时 EDS 透明隐藏，scroll edge 仍生效',
      },
      {
        name: 'left',
        type: 'EgNavBarAction',
        defaultValue: "{ icon: 'eds-arrow-left-ios' }",
        description: '左侧 icon 胶囊（EgButtonGlass）',
      },
      { name: 'right', type: 'EgNavBarAction', defaultValue: 'undefined', description: '右侧 icon 胶囊，iconCount 1 / 2' },
      { name: 'showLeft', type: 'boolean', defaultValue: 'true', description: '显示左侧' },
      {
        name: 'showTitle',
        type: 'boolean',
        defaultValue: 'true',
        description: '标题可见性；false 时不删 title（iOS 26+ scroll edge 依赖非空 title）',
      },
      { name: 'showRight', type: 'boolean', defaultValue: 'true', description: '显示右侧' },
      {
        name: 'background',
        type: "'auto' | 'visible' | 'hidden'",
        defaultValue: "'auto'",
        description: 'glass-mask-box 背景，贯穿状态栏；auto = 内容滚入栏下才显现',
      },
      {
        name: 'scrollOffset',
        type: 'SharedValue<number>',
        defaultValue: 'undefined',
        description: 'auto 背景驱动 — useEgNavBarScroll().scrollOffset',
      },
      { name: 'contentUnder', type: 'boolean', defaultValue: 'false', description: 'auto 且无 scrollOffset 时手动告知栏下有内容' },
      { name: 'topInset', type: 'number', defaultValue: 'safeArea.top', description: '状态栏区高度（不写死 20）' },
      {
        name: 'manageStatusBar',
        type: 'boolean',
        defaultValue: 'true',
        description: '透明沉浸 StatusBar（修复 Android 状态栏一片黑）',
      },
      { name: 'mode', type: "'light' | 'dark'", defaultValue: "'light'", description: '主题' },
    ],
    propQueryKeys: [
      'title',
      'showLeft',
      'showTitle',
      'showRight',
      'rightIconCount',
      'background',
      'statusBarZone',
    ],
    buildUsageSnippet: (state) =>
      buildRnSelfClosingSnippet(
        'EgNavBar',
        {
          title: state.title,
          showLeft: state.showLeft,
          showTitle: state.showTitle,
          showRight: state.showRight,
          background: state.background,
        },
        { defaults: { title: '标题', showLeft: true, showTitle: true, showRight: true, background: 'auto' } },
      ),
  },
  'input-combo-input-group': minimalDoc('EgInputGroup', 'input-combo-input-group'),
  'input-combo-text-input': minimalDoc('EgComboTextInput', 'input-combo-text-input'),
  'input-combo-textarea-input': minimalDoc('EgComboTextareaInput', 'input-combo-textarea-input'),
  divider: dividerDoc(),
  'glass-eg': egGlassShowcaseDoc(),
  'avatar-body': avatarBodyDoc(),
  'symbol-body': symbolBodyDoc(),
  'avatar-preset-0': avatarPreset0Doc(),
  'avatar-preset-1': avatarPreset1Doc(),
};

/** 旧 slug 深链 → 统一 EgButton 文档（默认 tone 对齐原场景）。 */
const BUTTON_LEGACY_DOC_TONE: Record<string, ButtonShowcaseTone> = {
  'button-brand': 'brand',
  'button-decor': 'decor',
  'button-danger': 'danger',
  'button-option': 'option',
};

function resolveButtonLegacyDoc(slug: string): RnDocConfig | null {
  const tone = BUTTON_LEGACY_DOC_TONE[slug];
  const base = rnDocBySlug['button-body'];
  if (!tone || !base) {
    return null;
  }
  return {
    ...base,
    componentTag: buttonShowcaseExportForTone(tone),
    customizeDefaults: { ...base.customizeDefaults, tone },
  };
}

export function resolveRnDocConfig(slug: string, exportName?: string): RnDocConfig | null {
  const legacyButton = resolveButtonLegacyDoc(slug);
  if (legacyButton) {
    return legacyButton;
  }

  if (rnDocBySlug[slug]) {
    return rnDocBySlug[slug];
  }

  const baseSlug = familyBodyPreviewSlug[slug];
  if (baseSlug && rnDocBySlug[baseSlug]) {
    return rnDocBySlug[baseSlug];
  }

  if (exportName) {
    const byComponentTag = Object.values(rnDocBySlug).find(
      (config) => config.componentTag === exportName,
    );
    if (byComponentTag) {
      return byComponentTag;
    }
    return minimalDoc(exportName, slug);
  }

  if (slug.endsWith('-body')) {
    return familyDoc(slug.slice(0, -'-body'.length));
  }

  return null;
}
