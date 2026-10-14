import { mobileTheme } from '../theme/index.js';

/**
 * The canvas every catalog preview renders into (playground native).
 *
 * Declared without RN style types so surfaces on different react-native versions
 * can spread it without type identity conflicts.
 */
export const catalogPreviewCanvasStyle = {
  padding: mobileTheme.spacing['spacing-4'] as number,
  gap: mobileTheme.spacing['spacing-6'] as number,
  alignItems: 'center',
} as const;

/** Gap between a preview item's caption and the component itself. */
export const catalogPreviewItemStyle = {
  gap: mobileTheme.spacing['spacing-2'] as number,
  alignItems: 'center',
} as const;
