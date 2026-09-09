/**
 * Showcase shell — Desktop Vue atoms/molecules copied for Icons / Crypto / Avatar galleries.
 * RN components live in @eds/mobile-components.
 */
import { defineComponent, h } from 'vue';

export { default as EgButton } from '../chrome/button/Button.vue';
export { default as EgSegmented } from '../chrome/tab/Segmented.vue';
export { default as EgSearch } from '../chrome/search/Search.vue';

import { EgIcon, iconNames, getProcessedIcon } from '../vendor/desktop-atoms/icons';
export { EgIcon, iconNames, getProcessedIcon };
export type { IconName } from '../vendor/desktop-atoms/icons';

export {
  EgCrypto,
  cryptoNames,
  cryptoFileNames,
  resolveCryptoFileName,
  resolveCryptoAssetKind,
  formatCryptoDisplayName,
  toCryptoBusinessName,
  getProcessedCrypto,
} from '../vendor/desktop-atoms/crypto';
export type { CryptoName, ProcessedCrypto, CryptoAssetKind } from '../vendor/desktop-atoms/crypto';

export { default as EgAvatar } from '../vendor/desktop-atoms/avatar/Avatar.vue';
export {
  AVATAR_NATIVE_PALETTE,
  AVATAR_NATIVE_PALETTE_SIZE,
  AVATAR_ROBOT_ASSET_NAME,
  avatarPaletteBackgroundVars,
  formatAvatarPaletteName,
} from '../vendor/desktop-atoms/avatar';

export { default as EgTag } from '../vendor/desktop-molecules/tag/Tag.vue';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'evergreen-theme';

export function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: ThemeMode, target: HTMLElement = document.documentElement) {
  target.setAttribute('data-theme', theme);
}

export function rescanCornerSmoothing(_root?: Element | null) {
  // Mobile showcase — no squircle scanner
}

function stub(name: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () => h('div', { class: 'eds-stub', ...attrs }, slots.default?.());
    },
  });
}

export const EgDecide = stub('EgDecide');
export const EgFlotation = stub('EgFlotation');
export const EgFlotationTrigger = stub('EgFlotationTrigger');
export const EgInput = defineComponent({
  name: 'EgInput',
  props: { modelValue: { type: String, default: '' }, placeholder: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        class: 'eds-input',
        value: props.modelValue,
        placeholder: props.placeholder,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
      });
  },
});
