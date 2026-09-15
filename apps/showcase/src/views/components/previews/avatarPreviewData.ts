import type { DocPropRow } from '@/views/shared/componentDoc/types';

export const avatarImportCode = `import { EgAvatar } from '@eds/mobile-components';`;

export const avatarPropRows: DocPropRow[] = [
  {
    name: 'name',
    type: 'string',
    defaultValue: 'undefined',
    description: '用户名；未传 initials 时取首字作为缩写。',
  },
  {
    name: 'initials',
    type: 'string',
    defaultValue: 'undefined',
    description: '缩写文案，优先于 name 推导。',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'lg'",
    description:
      '尺寸，对应 token --avatar-xs/sm/md/lg/xl（16 / 24 / 32 / 36 / 40px）。initials 首字：xs/sm 视觉 8px，md/lg/xl 视觉 12px，字重 700（硬编码）。',
  },
  {
    name: 'variant',
    type: "'initials' | 'robot'",
    defaultValue: "'initials'",
    description: 'initials：原色盘 + 首字；robot：eds-avatar-0 机器人。',
  },
  {
    name: 'colorIndex',
    type: 'number',
    defaultValue: 'undefined',
    description: '指定 web3 原色盘索引（0–19）；未传时按 colorSeed / name 稳定映射。',
  },
  {
    name: 'randomColor',
    type: 'boolean',
    defaultValue: 'false',
    description: '为 true 时每次渲染从原色盘随机取色（演示用）。',
  },
  {
    name: 'colorSeed',
    type: 'string',
    defaultValue: 'undefined',
    description: '原色映射 seed，默认取 name。',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: 'undefined',
    description: '无障碍 aria-label。',
  },
];
