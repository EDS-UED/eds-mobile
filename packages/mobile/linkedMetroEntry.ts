/**
 * Linked consumer Metro only — resolves `@eds-evergreen/mobile` to live workspace sources.
 * Do not import this path from production app code; use the assembled `dist` package.
 */
export * from '../components/src/index.ts';
export { default as mobileTheme } from '../tokens/dist/js/theme.js';
export * from '../animations/src/index.ts';
