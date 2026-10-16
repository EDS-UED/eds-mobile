import edsBill from './eds-bill.png';
import edsBillFill from './eds-bill-fill.png';
import edsCirculation from './eds-circulation.png';
import edsCirculationFill from './eds-circulation-fill.png';
import edsIndex from './eds-index.png';
import edsIndexFill from './eds-index-fill.png';
import edsWallet from './eds-wallet.png';
import edsWalletFill from './eds-wallet-fill.png';

/** `scripts/generate-native-tab-icons.mjs` 产物（EDS SVG → template PNG @1x/@2x/@3x） */
export const NATIVE_TAB_ICONS = {
  'eds-index': { default: edsIndex, selected: edsIndexFill },
  'eds-wallet': { default: edsWallet, selected: edsWalletFill },
  'eds-circulation': { default: edsCirculation, selected: edsCirculationFill },
  'eds-bill': { default: edsBill, selected: edsBillFill },
} as const;
