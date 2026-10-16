import { NATIVE_TAB_ICONS } from '../_shared/native-tab-icons/index.js';
import type { EgTabBarNativeTabSpec } from '../tab-bar/EgTabBarNativeLayout.types.js';

/**
 * 与 `CREGIS_TAB_BAR_ITEMS` 同序 · 同 `routeName` / label / EDS 图标（默认 · 聚焦 fill）。
 * iOS 26+ 系统 Tab 条用 template PNG；Android Material 对照 EDS symbol 语义。
 */
export const CREGIS_TAB_BAR_NATIVE_TABS: EgTabBarNativeTabSpec[] = [
  {
    routeName: 'Home',
    label: '主页',
    icon: { src: NATIVE_TAB_ICONS['eds-index'], md: 'home' },
  },
  {
    routeName: 'Wallet',
    label: '钱包',
    icon: { src: NATIVE_TAB_ICONS['eds-wallet'], md: 'account_balance_wallet' },
  },
  {
    routeName: 'Collaboration',
    label: '协作',
    icon: { src: NATIVE_TAB_ICONS['eds-circulation'], md: 'sync' },
  },
  {
    routeName: 'TransactionRecords',
    label: '交易记录',
    icon: { src: NATIVE_TAB_ICONS['eds-bill'], md: 'receipt_long' },
  },
];
