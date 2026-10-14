export type ButtonShowcaseTone = 'brand' | 'decor' | 'danger' | 'option';
export type ButtonShowcaseFigmaType = 'primary' | 'secondary' | 'tertiary';
export type ButtonShowcaseVariant = 'solid' | 'outline' | 'text';
export type ButtonShowcaseWidth = 'hug' | 'fill';

export const BUTTON_SHOWCASE_TONES = [
  { value: 'brand', label: 'Brand' },
  { value: 'decor', label: 'Decor' },
  { value: 'danger', label: 'Danger' },
  { value: 'option', label: 'Option' },
] as const;

export const BUTTON_SHOWCASE_VARIANTS = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'text', label: 'Text' },
] as const;

export const BUTTON_SHOWCASE_WIDTHS = [
  { value: 'hug', label: 'Hug' },
  { value: 'fill', label: 'Fill' },
] as const;

export const BUTTON_SHOWCASE_SIZES = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
  { value: 'xs', label: 'XS' },
] as const;

export const buttonShowcaseDefaults = {
  tone: 'brand' as ButtonShowcaseTone,
  variant: 'solid' as ButtonShowcaseVariant,
  width: 'hug' as ButtonShowcaseWidth,
  size: 'lg',
  label: 'Button',
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
