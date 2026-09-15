import { getProcessedIcon, iconNames } from '@/stubs/eds-components';

export function getRegisteredIconCount(): number {
  return iconNames.filter((name) => Boolean(getProcessedIcon(name))).length;
}

export function getIconsPageLead(): string {
  return `共 ${getRegisteredIconCount()} 个图标；name 与 packages/components/src/atoms/icons/*.svg 文件名一致（不含 .svg）。`;
}
