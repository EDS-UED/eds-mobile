import type { EgTabBarItemData } from '../tab-bar/EgTabBar.types.js';

/**
 * Cregis UED — Apply_TabBar@Cregis（四项，与 `CREGIS_TAB_BAR_NATIVE_TABS` 同序）
 * `routeName` 须与 work-cregis-mobile `RootTabParamList` / Tab.Screen `name` 完全一致。
 */
export const CREGIS_TAB_BAR_ITEMS: EgTabBarItemData[] = [
  {
    key: 'home',
    routeName: 'Home',
    label: '主页',
    symbolName: 'eds-index',
    symbolNameSelected: 'eds-index-fill',
  },
  {
    key: 'wallet',
    routeName: 'Wallet',
    label: '钱包',
    symbolName: 'eds-wallet',
    symbolNameSelected: 'eds-wallet-fill',
  },
  {
    key: 'collaboration',
    routeName: 'Collaboration',
    label: '协作',
    symbolName: 'eds-circulation',
    symbolNameSelected: 'eds-circulation-fill',
  },
  {
    key: 'transaction-records',
    routeName: 'TransactionRecords',
    label: '交易记录',
    symbolName: 'eds-bill',
    symbolNameSelected: 'eds-bill-fill',
  },
];
