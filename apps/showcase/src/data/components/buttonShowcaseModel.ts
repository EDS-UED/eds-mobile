export type ButtonShowcaseTone = 'brand' | 'decor' | 'danger' | 'option';
export type ButtonShowcaseFigmaType = 'primary' | 'secondary' | 'tertiary';
export type ButtonShowcaseVariant = 'solid' | 'outline' | 'text';
export type ButtonShowcaseWidth = 'hug' | 'fill';

export const BUTTON_SHOWCASE_TONES = [
  { value: 'brand', label: '品牌' },
  { value: 'decor', label: '装饰' },
  { value: 'danger', label: '危险' },
  { value: 'option', label: '选项' },
] as const;

export const BUTTON_SHOWCASE_VARIANTS = [
  { value: 'solid', label: '实心' },
  { value: 'outline', label: '描边' },
  { value: 'text', label: '文字' },
] as const;

export const BUTTON_SHOWCASE_WIDTHS = [
  { value: 'hug', label: '自适应' },
  { value: 'fill', label: '充满' },
] as const;

export const BUTTON_SHOWCASE_SIZES = [
  { value: 'lg', label: '大' },
  { value: 'md', label: '中' },
  { value: 'sm', label: '小' },
  { value: 'xs', label: '特小' },
] as const;

export const buttonShowcaseDefaults = {
  tone: 'brand' as ButtonShowcaseTone,
  variant: 'solid' as ButtonShowcaseVariant,
  width: 'hug' as ButtonShowcaseWidth,
  size: 'lg',
  label: '按钮',
  disabled: false,
  loading: false,
};

const EXPORT_BY_TONE: Record<ButtonShowcaseTone, string> = {
  brand: 'EgBrandButton',
  decor: 'EgDecorButton',
  danger: 'EgDangerButton',
  option: 'EgOptionButton',
};

export function buttonShowcaseExportForTone(tone: string): string {
  const key = tone as ButtonShowcaseTone;
  return EXPORT_BY_TONE[key] ?? EXPORT_BY_TONE.brand;
}

/** Desktop `variant` → Mobile Figma Type（primary=solid · secondary=outline · tertiary=text）。 */
export function buttonShowcaseVariantToFigmaType(variant: string): ButtonShowcaseFigmaType {
  if (variant === 'outline') return 'secondary';
  if (variant === 'text') return 'tertiary';
  return 'primary';
}

export function buttonShowcaseWidthStyle(width: string): { alignSelf: 'stretch'; width: '100%' } | undefined {
  return width === 'fill' ? { alignSelf: 'stretch', width: '100%' } : undefined;
}
