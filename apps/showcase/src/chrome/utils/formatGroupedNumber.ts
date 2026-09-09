const INTEGER_GROUPED_FORMAT = new Intl.NumberFormat(undefined, {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const FRACTIONAL_GROUPED_FORMAT = new Intl.NumberFormat(undefined, {
  useGrouping: true,
  maximumFractionDigits: 20,
});

/**
 * Formats numeric values with locale-aware thousand separators.
 * Non-numeric strings are returned unchanged.
 */
export function formatGroupedNumber(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';

  const raw = String(value).trim();
  if (!raw) return raw;

  const normalized = raw.replace(/,/g, '');
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) return raw;

  const isIntegerLike = !normalized.includes('.') && Number.isInteger(numeric);
  return isIntegerLike
    ? INTEGER_GROUPED_FORMAT.format(numeric)
    : FRACTIONAL_GROUPED_FORMAT.format(numeric);
}
