#!/usr/bin/env node
/**
 * Generate packages/tokens/spec from Mobile Figma variable export.
 * Source: EverGreen Design System (Mobile) — fileKey LlB2jT8KdxM6taf5wOSAEM
 * Run: node scripts/import-mobile-figma.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const specDir = resolve(__dirname, '../spec');
const FIGMA_URL =
  'https://www.figma.com/design/LlB2jT8KdxM6taf5wOSAEM/EverGreen-Design-System--Mobile-';

function hexToDisplayP3(hex) {
  const normalized = hex.replace('#', '').slice(0, 6);
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [Number(r.toFixed(4)), Number(g.toFixed(4)), Number(b.toFixed(4))];
}

function baseEntry(hex) {
  return { hex: hex.slice(0, 7), displayP3: hexToDisplayP3(hex) };
}

const primitives = {
  light: {
    'eds-brand': baseEntry('#5f2243'),
    'eds-match': baseEntry('#003a6d'),
    'eds-decor': baseEntry('#022d0d'),
    'eds-success': baseEntry('#1fc35a'),
    'eds-danger': baseEntry('#d7462d'),
    'eds-warning': baseEntry('#eb9114'),
    'eds-base': baseEntry('#020304'),
    'eds-face': baseEntry('#ffffff'),
    'eds-same-black': baseEntry('#020304'),
    'eds-same-white': baseEntry('#ffffff'),
    'eds-page': baseEntry('#ffffff'),
    'eds-flotation': baseEntry('#ffffff'),
  },
  dark: {
    'eds-brand': baseEntry('#5f2243'),
    'eds-match': baseEntry('#004178'),
    'eds-decor': baseEntry('#ffffff'),
    'eds-success': baseEntry('#1fc35a'),
    'eds-danger': baseEntry('#fa6950'),
    'eds-warning': baseEntry('#ffaa32'),
    'eds-base': baseEntry('#ffffff'),
    'eds-face': baseEntry('#020304'),
    'eds-same-black': baseEntry('#020304'),
    'eds-same-white': baseEntry('#ffffff'),
    'eds-page': baseEntry('#020304'),
    'eds-flotation': baseEntry('#1c1d1f'),
  },
};

const semanticTokens = [
  ['box-page', '#ffffff', '#020304'],
  ['box-flotation', '#ffffff', '#1c1d1f'],
  ['stroke-hide', '#02030400', '#ffffff00'],
  ['stroke-divider', '#0203040d', '#ffffff0d'],
  ['stroke-base-primary', '#020304', '#ffffff'],
  ['stroke-base-secondary', '#02030499', '#ffffff99'],
  ['stroke-base-tertiary', '#02030466', '#ffffff66'],
  ['stroke-base-quaternary', '#02030433', '#ffffff33'],
  ['stroke-color-brand', 'color(var(--eds-brand) / 1)', 'color(var(--eds-brand) / 1)'],
  ['stroke-color-danger', '#d7462d', '#fa6950'],
  ['stroke-same-white', '#ffffff', '#ffffff'],
  ['text-base-primary', '#020304', '#ffffff'],
  ['text-base-secondary', '#02030499', '#ffffff99'],
  ['text-base-tertiary', '#02030466', '#ffffff66'],
  ['text-base-quaternary', '#02030433', '#ffffff33'],
  ['text-brand', 'color(var(--eds-brand) / 1)', 'color(var(--eds-brand) / 1)'],
  ['text-face-primary', '#ffffff', '#020304'],
  ['text-face-secondary', '#ffffff99', '#02030499'],
  ['text-face-tertiary', '#ffffff66', '#02030466'],
  ['text-face-quaternary', '#ffffff33', '#02030433'],
  ['text-same-black', '#020304', '#020304'],
  ['text-same-white', '#ffffff', '#ffffff'],
  ['text-same-white-weaken', '#ffffff66', '#ffffff66'],
  ['material-hide', '#02030400', '#ffffff00'],
  ['material-base-primary', '#020304', '#ffffff'],
  ['material-base-secondary', '#02030499', '#ffffff99'],
  ['material-base-tertiary', '#02030466', '#ffffff66'],
  ['material-base-quaternary', '#02030433', '#ffffff33'],
  ['material-card-shallow', '#02030408', '#ffffff0d'],
  ['material-card-moderate', '#0203040d', '#ffffff12'],
  ['material-card-deep', '#02030412', '#ffffff17'],
  ['material-brand', 'color(var(--eds-brand) / 1)', 'color(var(--eds-brand) / 1)'],
  ['material-brand-weaken', 'color(var(--eds-brand) / 0.12)', 'color(var(--eds-brand) / 0.12)'],
  ['material-match', '#003a6d', '#004178'],
  ['material-match-weaken', '#003a6d1f', '#0041781f'],
  ['material-decor', '#022d0d', '#ffffff'],
  ['material-decor-weaken', '#022d0d1f', '#ffffff1f'],
  ['material-face-primary', '#ffffff', '#020304'],
  ['material-face-secondary', '#ffffff99', '#02030499'],
  ['material-face-tertiary', '#ffffff66', '#02030466'],
  ['material-face-quaternary', '#ffffff33', '#02030433'],
  ['material-same-black', '#02030480', '#020304b2'],
  ['material-same-black-weaken', '#02030433', '#0203044d'],
  ['material-same-white', '#ffffff', '#ffffff'],
  ['material-same-white-weaken', '#ffffff', '#ffffff1f'],
  ['status-disable-base', '#02030433', 'color(var(--eds-brand) / 0.2)'],
  ['status-disable-base-weaken', '#0203040d', 'color(var(--eds-brand) / 0.07)'],
  ['status-disable-brand', 'color(var(--eds-brand) / 0.4)', 'color(var(--eds-brand) / 0.4)'],
  ['status-disable-brand-weaken', 'color(var(--eds-brand) / 0.2)', 'color(var(--eds-brand) / 0.2)'],
  ['status-disable-same-white', '#ffffff', 'color(var(--eds-brand) / 0.2)'],
  ['status-success', '#1fc35a', '#1fc35a'],
  ['status-success-weaken', '#1fc35a1f', '#1fc35a1f'],
  ['status-danger', '#d7462d', '#fa6950'],
  ['status-danger-weaken', '#d7462d1f', '#fa69501f'],
  ['status-warning', '#eb9114', '#ffaa32'],
  ['status-warning-weaken', '#eb91141f', '#ffaa321f'],
  ['effect-shallow', '#0203041a', '#02030499'],
  ['effect-moderate', '#0203041f', '#02030433'],
  ['effect-deep', '#02030433', '#02030499'],
  ['effect-prompt', '#020304cc', '#ffffff33'],
  ['event-tap', '#0203041a', '#ffffff1a'],
  ['event-tap-brand', 'color(var(--eds-brand) / 0.6)', 'color(var(--eds-brand) / 0.6)'],
  ['event-tap-decor', '#022d0d99', '#ffffff99'],
  ['event-tap-danger', '#d7462d99', '#fa695099'],
  ['event-tap-base', '#02030499', '#ffffff99'],
  ['event-tap-face', '#ffffff99', '#02030499'],
  ['event-focus', '#0203040d', '#ffffff14'],
  ['event-focus-brand', 'color(var(--eds-brand) / 0.1)', 'color(var(--eds-brand) / 0.12)'],
].map(([name, light, dark]) => ({ name, light, dark }));

const scaleBase = {
  $figma: FIGMA_URL,
  $description: 'Scale System base primitives (Mobile Figma). scale(n) = n × scaleBase.',
  scaleBase: 4,
  scale: {
    'scale-0': 0,
    'scale-025': 0.25,
    'scale-05': 0.5,
    'scale-1': 1,
    'scale-1-5': 1.5,
    'scale-2': 2,
    'scale-3': 3,
    'scale-4': 4,
    'scale-5': 5,
    'scale-5-5': 5.5,
    'scale-6': 6,
    'scale-7': 7,
    'scale-8': 8,
    'scale-9': 9,
    'scale-10': 10,
    'scale-11': 11,
    'scale-12': 12,
    'scale-13': 13,
    'scale-14': 14,
    'scale-15': 15,
    'scale-16': 16,
    'scale-17': 17,
    'scale-18': 18,
    'scale-19': 19,
    'scale-20': 20,
    'scale-30': 30,
    'scale-40': 40,
    'scale-50': 50,
    'scale-full': '888px',
  },
};

const scaleSemantic = {
  $figma: FIGMA_URL,
  $description: 'Scale System semantic mappings — Mobile Figma Scale System collection.',
  groups: [
    {
      comment: '间距（Spacing）',
      tokens: [
        { name: 'spacing-0', value: '0px' },
        { name: 'spacing-05', value: '2px' },
        { name: 'spacing-1', value: '4px' },
        { name: 'spacing-1-5', value: '6px' },
        { name: 'spacing-2', value: '8px' },
        { name: 'spacing-3', value: '12px' },
        { name: 'spacing-4', value: '16px' },
        { name: 'spacing-5', value: '20px' },
        { name: 'spacing-6', value: '24px' },
        { name: 'spacing-7', value: '28px' },
        { name: 'spacing-8', value: '32px' },
        { name: 'spacing-9', value: '36px' },
        { name: 'spacing-10', value: '40px' },
        { name: 'spacing-12', value: '48px' },
        { name: 'spacing-14', value: '56px' },
        { name: 'spacing-16', value: '64px' },
        { name: 'spacing-18', value: '72px' },
        { name: 'spacing-20', value: '80px' },
      ],
    },
    {
      comment: '圆角（Radius）',
      tokens: [
        { name: 'radius-0', value: '0px' },
        { name: 'radius-xs', value: '4px' },
        { name: 'radius-sm', value: '8px' },
        { name: 'radius-md', value: '12px' },
        { name: 'radius-lg', value: '16px' },
        { name: 'radius-xl', value: '20px' },
        { name: 'radius-full', value: '888px' },
      ],
    },
    {
      comment: '描边（Stroke）',
      tokens: [
        { name: 'stroke-sm', value: '1px' },
        { name: 'stroke-md', value: '1.5px' },
        { name: 'stroke-lg', value: '2px' },
      ],
    },
    {
      comment: '模糊（Blur）',
      tokens: [
        { name: 'blur-deep', value: '40px' },
        { name: 'blur-moderate', value: '80px' },
        { name: 'blur-shallow', value: '200px' },
      ],
    },
    {
      comment: '层级（Depth）',
      tokens: [
        { name: 'depth-deep', value: '8px' },
        { name: 'depth-moderate', value: '16px' },
        { name: 'depth-shallow', value: '32px' },
      ],
    },
    {
      comment: '图标（Icon）',
      tokens: [
        { name: 'icon-sm', value: '16px' },
        { name: 'icon-md', value: '20px' },
        { name: 'icon-lg', value: '22px' },
        { name: 'icon-xl', value: '24px' },
        { name: 'icon-root', value: '32px' },
      ],
    },
    {
      comment: '控件高度 — Button',
      tokens: [
        { name: 'button-xs', value: '32px' },
        { name: 'button-sm', value: '40px' },
        { name: 'button-md', value: '48px' },
        { name: 'button-lg', value: '56px' },
        { name: 'button-xl', value: '60px' },
      ],
    },
    {
      comment: '控件高度 — Input / Drop-Down',
      tokens: [
        { name: 'input-xs', value: '32px' },
        { name: 'input-sm', value: '40px' },
        { name: 'input-md', value: '48px' },
        { name: 'input-lg', value: '52px' },
        { name: 'input-xl', value: '56px' },
        { name: 'dropdown-xs', value: '32px' },
        { name: 'dropdown-sm', value: '40px' },
        { name: 'dropdown-md', value: '48px' },
        { name: 'dropdown-lg', value: '52px' },
        { name: 'dropdown-xl', value: '56px' },
      ],
    },
    {
      comment: '控件尺寸 — Toggle / Tag / Checkbox / Radio / Switch',
      tokens: [
        { name: 'checkbox-sm', value: '16px' },
        { name: 'checkbox-md', value: '20px' },
        { name: 'checkbox-lg', value: '24px' },
        { name: 'radio-sm', value: '16px' },
        { name: 'radio-md', value: '20px' },
        { name: 'radio-lg', value: '24px' },
        { name: 'switch-sm', value: '16px' },
        { name: 'switch-md', value: '20px' },
        { name: 'switch-lg', value: '24px' },
        { name: 'tag-sm', value: '16px' },
        { name: 'tag-md', value: '20px' },
        { name: 'tag-lg', value: '24px' },
        { name: 'icon-container-xs', value: '36px' },
        { name: 'icon-container-sm', value: '40px' },
        { name: 'icon-container-md', value: '48px' },
        { name: 'icon-container-lg', value: '52px' },
        { name: 'icon-container-xl', value: '56px' },
      ],
    },
    {
      comment: 'Avatar',
      tokens: [
        { name: 'avatar-xs', value: '16px' },
        { name: 'avatar-sm', value: '24px' },
        { name: 'avatar-md', value: '32px' },
        { name: 'avatar-lg', value: '36px' },
        { name: 'avatar-xl', value: '40px' },
      ],
    },
  ],
};

const typographyBase = {
  $figma: FIGMA_URL,
  $description: 'Typography base — Mobile Figma text styles.',
  groups: [
    {
      comment: '字号',
      tokens: {
        'size-display': '34px',
        'size-headline': '26px',
        'size-title': '21px',
        'size-body-large': '19px',
        'size-body-medium': '17px',
        'size-body-small': '15px',
        'size-detail': '14px',
        'size-footnote': '13px',
        'size-bar': '10px',
      },
    },
    {
      comment: '行高',
      tokens: {
        'line-height-display': '44px',
        'line-height-headline': '32px',
        'line-height-title': '28px',
        'line-height-body-large': '26px',
        'line-height-body-medium': '24px',
        'line-height-body-small': '20px',
        'line-height-detail': '18px',
        'line-height-footnote': '16px',
        'line-height-bar': '14px',
      },
    },
    {
      comment: '字重',
      tokens: {
        'weight-regular': '400',
        'weight-medium': '500',
        'weight-semibold': '600',
        'weight-bold': '700',
      },
    },
    {
      comment: '字体家族',
      tokens: {
        'eds-family-sans':
          '"EDS Text", "PingFang SC", SourceHanSansSC, "Apple Color Emoji", "Segoe UI Emoji"',
      },
    },
  ],
};

function writeJson(relativePath, data) {
  const fullPath = join(specDir, relativePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`);
}

writeJson('color/base.json', {
  $figma: FIGMA_URL,
  $description: 'Color System base palette — Mobile Figma Primitives.',
  ...primitives,
});

writeJson('color/semantic.json', {
  $figma: FIGMA_URL,
  $description: 'Color System semantic colors — resolved from Mobile Figma Color System.',
  tokens: semanticTokens,
});

writeJson('scale/base.json', scaleBase);
writeJson('scale/semantic.json', scaleSemantic);
writeJson('typography/base.json', typographyBase);

console.log('✓ Mobile Figma specs written to packages/tokens/spec');
