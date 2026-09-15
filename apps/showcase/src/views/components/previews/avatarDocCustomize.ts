import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import { AVATAR_NATIVE_PALETTE_SIZE, formatAvatarPaletteName } from '@/stubs/eds-components';

export const avatarCustomizeDefaults = {
  name: 'Nancy',
  initials: '',
  size: 'lg',
  variant: 'initials',
  colorIndexMode: 'auto',
  colorIndex: 0,
  randomColor: false,
} as const;

export const avatarSizeOptions = [
  { value: 'xs', label: 'xs · 16px' },
  { value: 'sm', label: 'sm · 24px' },
  { value: 'md', label: 'md · 32px' },
  { value: 'lg', label: 'lg · 36px' },
  { value: 'xl', label: 'xl · 40px' },
] as const;

const colorIndexOptions = [
  { value: 'auto', label: '自动（按 name）' },
  ...Array.from({ length: AVATAR_NATIVE_PALETTE_SIZE }, (_, index) => ({
    value: String(index),
    label: formatAvatarPaletteName(index),
  })),
];

export const avatarCustomizeControls: DocCustomizeControl[] = [
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
    label: '名称',
    options: colorIndexOptions,
  },
  { kind: 'boolean', key: 'randomColor', label: '随机 web3-avatar' },
];

export function buildAvatarUsageSnippet(state: Record<string, unknown>): string {
  const payload: Record<string, unknown> = {
    name: state.name,
    size: state.size,
    variant: state.variant,
  };

  if (state.initials) {
    payload.initials = state.initials;
  }

  if (state.randomColor) {
    payload.randomColor = true;
  } else if (state.colorIndexMode !== 'auto') {
    payload.colorIndex = Number(state.colorIndexMode);
  }

  return buildVueSelfClosingSnippet('EgAvatar', payload, {
    defaults: {
      name: avatarCustomizeDefaults.name,
      size: avatarCustomizeDefaults.size,
      variant: avatarCustomizeDefaults.variant,
    },
  });
}

export function resolveAvatarPreviewProps(
  state: Record<string, unknown>,
  sizeOverride?: string,
) {
  const props: Record<string, unknown> = {
    name: String(state.name ?? avatarCustomizeDefaults.name),
    size: sizeOverride ?? state.size ?? avatarCustomizeDefaults.size,
    variant: state.variant ?? avatarCustomizeDefaults.variant,
    randomColor: Boolean(state.randomColor),
  };

  const initials = String(state.initials ?? '').trim();
  if (initials) {
    props.initials = initials;
  }

  if (!props.randomColor && state.colorIndexMode !== 'auto') {
    props.colorIndex = Number(state.colorIndexMode);
  }

  return props;
}
