export { default as EgIcon } from './Icon.vue';
export {
  iconNames,
  iconFileNames,
  resolveIconFileName,
  getProcessedIcon,
  getIconKind,
  getIconFillTone,
} from './iconRegistry';
export type { IconName } from './iconRegistry';
export type { IconKind, IconFillTone, IconColorMode } from './processSvg';
