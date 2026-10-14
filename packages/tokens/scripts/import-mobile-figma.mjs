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

/** Keep in sync with spec/color/semantic.json — refs resolve to CSS color-mix at build time. */
const semanticTokens = [
  ['box-page', 'color(var(--eds-page) / 1)', 'color(var(--eds-page) / 1)'],
  ['box-flotation', 'color(var(--eds-flotation) / 1)', 'color(var(--eds-flotation) / 1)'],
  ['stroke-hide', 'color(var(--eds-base) / 0)', 'color(var(--eds-base) / 0)'],
  ['stroke-divider-module', 'color(var(--eds-base) / 0.1)', 'color(var(--eds-base) / 0.1)'],
  ['stroke-divider-page', 'color(var(--eds-base) / 0.08)', 'color(var(--eds-base) / 0.1)'],
  ['stroke-base-primary', 'color(var(--eds-base) / 1)', 'color(var(--eds-base) / 1)'],
  ['stroke-base-secondary', 'color(var(--eds-base) / 0.6)', 'color(var(--eds-base) / 0.6)'],
  ['stroke-base-tertiary', 'color(var(--eds-base) / 0.4)', 'color(var(--eds-base) / 0.4)'],
  ['stroke-base-quaternary', 'color(var(--eds-base) / 0.2)', 'color(var(--eds-base) / 0.2)'],
  ['stroke-color-brand', 'color(var(--eds-brand) / 1)', 'color(var(--eds-brand) / 1)'],
  ['stroke-color-danger', 'color(var(--eds-danger) / 1)', 'color(var(--eds-danger) / 1)'],
  ['stroke-same-white', 'color(var(--eds-same-white) / 1)', 'color(var(--eds-same-white) / 1)'],
  ['text-base-primary', 'color(var(--eds-base) / 1)', 'color(var(--eds-base) / 1)'],
  ['text-base-secondary', 'color(var(--eds-base) / 0.6)', 'color(var(--eds-base) / 0.6)'],
  ['text-base-tertiary', 'color(var(--eds-base) / 0.4)', 'color(var(--eds-base) / 0.4)'],
  ['text-base-quaternary', 'color(var(--eds-base) / 0.2)', 'color(var(--eds-base) / 0.2)'],
  ['text-brand', 'color(var(--eds-brand) / 1)', 'color(var(--eds-brand) / 1)'],
  ['text-face-primary', 'color(var(--eds-face) / 1)', 'color(var(--eds-face) / 1)'],
  ['text-face-secondary', 'color(var(--eds-face) / 0.6)', 'color(var(--eds-face) / 0.6)'],
  ['text-face-tertiary', 'color(var(--eds-face) / 0.4)', 'color(var(--eds-face) / 0.4)'],
  ['text-face-quaternary', 'color(var(--eds-face) / 0.2)', 'color(var(--eds-face) / 0.2)'],
  ['text-same-black', 'color(var(--eds-same-black) / 1)', 'color(var(--eds-same-black) / 1)'],
  ['text-same-white', 'color(var(--eds-same-white) / 1)', 'color(var(--eds-same-white) / 1)'],
  ['text-same-white-weaken', 'color(var(--eds-same-white) / 0.4)', 'color(var(--eds-same-white) / 0.4)'],
  ['material-hide', 'color(var(--eds-base) / 0)', 'color(var(--eds-base) / 0)'],
  ['material-base-primary', 'color(var(--eds-base) / 1)', 'color(var(--eds-base) / 1)'],
  ['material-base-secondary', 'color(var(--eds-base) / 0.6)', 'color(var(--eds-base) / 0.6)'],
  ['material-base-tertiary', 'color(var(--eds-base) / 0.4)', 'color(var(--eds-base) / 0.4)'],
  ['material-base-quaternary', 'color(var(--eds-base) / 0.2)', 'color(var(--eds-base) / 0.2)'],
  ['material-card-shallow', 'color(var(--eds-base) / 0.03)', 'color(var(--eds-base) / 0.05)'],
  ['material-card-moderate', 'color(var(--eds-base) / 0.05)', 'color(var(--eds-base) / 0.07)'],
  ['material-card-deep', 'color(var(--eds-base) / 0.07)', 'color(var(--eds-base) / 0.09)'],
  ['material-brand', 'color(var(--eds-brand) / 1)', 'color(var(--eds-brand) / 1)'],
  ['material-brand-weaken', 'color(var(--eds-brand) / 0.12)', 'color(var(--eds-brand) / 0.12)'],
  ['material-match', 'color(var(--eds-match) / 1)', 'color(var(--eds-match) / 1)'],
  ['material-match-weaken', 'color(var(--eds-match) / 0.12)', 'color(var(--eds-match) / 0.12)'],
  ['material-decor', 'color(var(--eds-decor) / 1)', 'color(var(--eds-decor) / 1)'],
  ['material-decor-weaken', 'color(var(--eds-decor) / 0.12)', 'color(var(--eds-decor) / 0.12)'],
  ['material-face-primary', 'color(var(--eds-face) / 1)', 'color(var(--eds-face) / 1)'],
  ['material-face-secondary', 'color(var(--eds-face) / 0.6)', 'color(var(--eds-face) / 0.6)'],
  ['material-face-tertiary', 'color(var(--eds-face) / 0.4)', 'color(var(--eds-face) / 0.4)'],
  ['material-face-quaternary', 'color(var(--eds-face) / 0.2)', 'color(var(--eds-face) / 0.2)'],
  ['material-same-black', 'color(var(--eds-same-black) / 0.5)', 'color(var(--eds-same-black) / 0.7)'],
  ['material-same-black-weaken', 'color(var(--eds-same-black) / 0.2)', 'color(var(--eds-same-black) / 0.3)'],
  ['material-same-white', 'color(var(--eds-same-white) / 1)', 'color(var(--eds-same-white) / 1)'],
  ['material-same-white-weaken', 'color(var(--eds-same-white) / 1)', 'color(var(--eds-same-white) / 0.12)'],
  ['status-disable-base', 'color(var(--eds-base) / 0.2)', 'color(var(--eds-brand) / 0.2)'],
  ['status-disable-base-weaken', 'color(var(--eds-base) / 0.05)', 'color(var(--eds-brand) / 0.07)'],
  ['status-disable-brand', 'color(var(--eds-brand) / 0.4)', 'color(var(--eds-brand) / 0.4)'],
  ['status-disable-brand-weaken', 'color(var(--eds-brand) / 0.2)', 'color(var(--eds-brand) / 0.2)'],
  ['status-disable-same-white', 'color(var(--eds-same-white) / 1)', 'color(var(--eds-brand) / 0.2)'],
  ['status-success', 'color(var(--eds-success) / 1)', 'color(var(--eds-success) / 1)'],
  ['status-success-weaken', 'color(var(--eds-success) / 0.12)', 'color(var(--eds-success) / 0.12)'],
  ['status-danger', 'color(var(--eds-danger) / 1)', 'color(var(--eds-danger) / 1)'],
  ['status-danger-weaken', 'color(var(--eds-danger) / 0.12)', 'color(var(--eds-danger) / 0.12)'],
  ['status-warning', 'color(var(--eds-warning) / 1)', 'color(var(--eds-warning) / 1)'],
  ['status-warning-weaken', 'color(var(--eds-warning) / 0.12)', 'color(var(--eds-warning) / 0.12)'],
  ['effect-vulvar-subtle', 'color(var(--eds-same-black) / 0.02)', 'color(var(--eds-same-black) / 0.2)'],
  ['effect-vulvar-shallow', 'color(var(--eds-same-black) / 0.12)', 'color(var(--eds-same-black) / 0.2)'],
  ['effect-vulvar-deep', 'color(var(--eds-same-black) / 0.13)', 'color(var(--eds-same-black) / 0.6)'],
  ['effect-vulvar-line', 'color(var(--eds-same-white) / 0.06)', 'color(var(--eds-same-white) / 0.1)'],
  ['effect-inner-light', 'color(var(--eds-same-white) / 1)', 'color(var(--eds-same-white) / 0.1)'],
  ['effect-prompt', 'color(var(--eds-base) / 0.8)', 'color(var(--eds-base) / 0.2)'],
  ['effect-box', 'color(var(--eds-flotation) / 0.6)', 'color(var(--eds-flotation) / 0.6)'],
  ['effect-overlay-subtle', 'color(var(--eds-overlay) / 0)', 'color(var(--eds-overlay) / 0)'],
  ['effect-overlay-shallow', 'color(var(--eds-overlay) / 0.4)', 'color(var(--eds-overlay) / 0.2)'],
  ['effect-overlay-deep', 'color(var(--eds-overlay) / 0.88)', 'color(var(--eds-overlay) / 0.88)'],
  ['event-tap', 'color(var(--eds-base) / 0.1)', 'color(var(--eds-base) / 0.1)'],
  ['event-tap-brand', 'color(var(--eds-brand) / 0.6)', 'color(var(--eds-brand) / 0.6)'],
  ['event-tap-decor', 'color(var(--eds-decor) / 0.6)', 'color(var(--eds-decor) / 0.6)'],
  ['event-tap-danger', 'color(var(--eds-danger) / 0.6)', 'color(var(--eds-danger) / 0.6)'],
  ['event-tap-base', 'color(var(--eds-base) / 0.6)', 'color(var(--eds-base) / 0.6)'],
  ['event-tap-face', 'color(var(--eds-face) / 0.6)', 'color(var(--eds-face) / 0.6)'],
  ['event-focus', 'color(var(--eds-base) / 0.05)', 'color(var(--eds-base) / 0.08)'],
  ['event-focus-brand', 'color(var(--eds-brand) / 0.1)', 'color(var(--eds-brand) / 0.12)'],
].map(([name, light, dark]) => ({ name, light, dark }));

const scaleBase = {
  $figma: FIGMA_URL,
  $description: 'Scale System base primitives (Mobile Figma). scale(n) = n × scaleBase.',
  scaleBase: 4,
  scale: {
    'scale-0': 0,
    'scale-0125': 0.125,
    'scale-025': 0.25,
    'scale-05': 0.5,
    'scale-1': 1,
    'scale-1-5': 1.5,
    'scale-2': 2,
    'scale-2-5': 2.5,
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
        { name: 'spacing-0', value: 'var(--scale-0)' },
        { name: 'spacing-05', value: 'var(--scale-05)' },
        { name: 'spacing-1', value: 'var(--scale-1)' },
        { name: 'spacing-1-5', value: 'var(--scale-1-5)' },
        { name: 'spacing-2', value: 'var(--scale-2)' },
        { name: 'spacing-2-5', value: 'var(--scale-2-5)', comment: '10px' },
        { name: 'spacing-3', value: 'var(--scale-3)' },
        { name: 'spacing-4', value: 'var(--scale-4)' },
        { name: 'spacing-5', value: 'var(--scale-5)' },
        { name: 'spacing-6', value: 'var(--scale-6)' },
        { name: 'spacing-7', value: 'var(--scale-7)' },
        { name: 'spacing-8', value: 'var(--scale-8)' },
        { name: 'spacing-9', value: 'var(--scale-9)' },
        { name: 'spacing-10', value: 'var(--scale-10)' },
        { name: 'spacing-12', value: 'var(--scale-12)' },
        { name: 'spacing-14', value: 'var(--scale-14)' },
        { name: 'spacing-16', value: 'var(--scale-16)' },
        { name: 'spacing-18', value: 'var(--scale-18)' },
        { name: 'spacing-20', value: 'var(--scale-20)' },
      ],
    },
    {
      comment: '圆角（Radius）',
      tokens: [
        { name: 'radius-0', value: 'var(--scale-0)' },
        { name: 'radius-xs', value: 'var(--scale-2)', comment: '8px' },
        { name: 'radius-sm', value: 'var(--scale-3)', comment: '12px' },
        { name: 'radius-md', value: 'var(--scale-4)', comment: '16px' },
        { name: 'radius-lg', value: 'var(--scale-6)', comment: '24px' },
        { name: 'radius-xl', value: 'var(--scale-8)', comment: '32px' },
        { name: 'radius-full', value: 'var(--scale-full)', comment: '888px' },
      ],
    },
    {
      comment: '描边（Stroke）',
      tokens: [
        { name: 'stroke-xs', value: '0.2px', comment: '0.2px' },
        { name: 'stroke-sm', value: 'var(--scale-025)', comment: '1px' },
        { name: 'stroke-md', value: 'var(--scale-0375)', comment: '1.5px' },
        { name: 'stroke-lg', value: 'var(--scale-05)', comment: '2px' },
      ],
    },
    {
      comment: '模糊（Blur）',
      tokens: [
        { name: 'blur-xs', value: 'var(--scale-0)', comment: '0px' },
        { name: 'blur-sm', value: 'var(--scale-2)', comment: '8px' },
        { name: 'blur-md', value: 'var(--scale-4)', comment: '16px' },
        { name: 'blur-lg', value: 'var(--scale-20)', comment: '80px' },
      ],
    },
    {
      comment: '深度（Depth）',
      tokens: [
        { name: 'depth-xs', value: 'var(--scale-0125)', comment: '0.5px' },
        { name: 'depth-sm', value: 'var(--scale-05)', comment: '2px' },
        { name: 'depth-md', value: 'var(--scale-1)', comment: '4px' },
        { name: 'depth-lg', value: 'var(--scale-4)', comment: '16px' },
      ],
    },
    {
      comment: '胶囊（Capsule）',
      tokens: [
        { name: 'capsule-xs', value: 'var(--scale-9)', comment: '36px' },
        { name: 'capsule-sm', value: 'var(--scale-10)', comment: '40px' },
        { name: 'capsule-md', value: 'var(--scale-12)', comment: '48px' },
        { name: 'capsule-lg', value: 'var(--scale-13)', comment: '52px' },
        { name: 'capsule-xl', value: 'var(--scale-14)', comment: '56px' },
      ],
    },
    {
      comment: '图标（Symbol）',
      tokens: [
        { name: 'symbol-xs', value: 'var(--scale-4)', comment: '16px' },
        { name: 'symbol-sm', value: 'var(--scale-5)', comment: '20px' },
        { name: 'symbol-md', value: 'var(--scale-5-5)', comment: '22px' },
        { name: 'symbol-lg', value: 'var(--scale-6)', comment: '24px' },
      ],
    },
    {
      comment: '头像（Avatar）',
      tokens: [
        { name: 'avatar-xs', value: 'var(--scale-4)', comment: '16px' },
        { name: 'avatar-sm', value: 'var(--scale-6)', comment: '24px' },
        { name: 'avatar-md', value: 'var(--scale-8)', comment: '32px' },
        { name: 'avatar-lg', value: 'var(--scale-9)', comment: '36px' },
        { name: 'avatar-xl', value: 'var(--scale-10)', comment: '40px' },
      ],
    },
    {
      comment: '按钮（Button）',
      tokens: [
        { name: 'button-xs', value: 'var(--scale-8)', comment: '32px' },
        { name: 'button-sm', value: 'var(--scale-10)', comment: '40px' },
        { name: 'button-md', value: 'var(--scale-12)', comment: '48px' },
        { name: 'button-lg', value: 'var(--scale-14)', comment: '56px' },
        { name: 'button-xl', value: 'var(--scale-15)', comment: '60px' },
      ],
    },
    {
      comment: '输入（Input / Drop-Down）',
      tokens: [
        { name: 'input-xs', value: 'var(--scale-8)', comment: '32px' },
        { name: 'input-sm', value: 'var(--scale-10)', comment: '40px' },
        { name: 'input-md', value: 'var(--scale-12)', comment: '48px' },
        { name: 'input-lg', value: 'var(--scale-13)', comment: '52px' },
        { name: 'input-xl', value: 'var(--scale-14)', comment: '56px' },
        { name: 'dropdown-xs', value: 'var(--scale-8)', comment: '32px' },
        { name: 'dropdown-sm', value: 'var(--scale-10)', comment: '40px' },
        { name: 'dropdown-md', value: 'var(--scale-12)', comment: '48px' },
        { name: 'dropdown-lg', value: 'var(--scale-13)', comment: '52px' },
        { name: 'dropdown-xl', value: 'var(--scale-14)', comment: '56px' },
      ],
    },
    {
      comment: '切换（Toggle / Tag / Checkbox / Radio / Switch）',
      tokens: [
        { name: 'tag-sm', value: 'var(--scale-4)', comment: '16px' },
        { name: 'tag-md', value: 'var(--scale-5)', comment: '20px' },
        { name: 'tag-lg', value: 'var(--scale-6)', comment: '24px' },
        { name: 'checkbox-sm', value: 'var(--scale-4)', comment: '16px' },
        { name: 'checkbox-md', value: 'var(--scale-5)', comment: '20px' },
        { name: 'checkbox-lg', value: 'var(--scale-6)', comment: '24px' },
        { name: 'radio-sm', value: 'var(--scale-4)', comment: '16px' },
        { name: 'radio-md', value: 'var(--scale-5)', comment: '20px' },
        { name: 'radio-lg', value: 'var(--scale-6)', comment: '24px' },
        { name: 'switch-sm', value: 'var(--scale-4)', comment: '16px' },
        { name: 'switch-md', value: 'var(--scale-5)', comment: '20px' },
        { name: 'switch-lg', value: 'var(--scale-6)', comment: '24px' },
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
