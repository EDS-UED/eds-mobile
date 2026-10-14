#!/usr/bin/env node
/**
 * Native stack headers (Stack.Title) often skip Fast Refresh — reload on nav file saves.
 */
import { watch } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { triggerMetroReload } from './trigger-metro-reload.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const showcaseRoot = join(repoRoot, 'apps/showcase');

/** Files where a full reload is safer than Fast Refresh. */
const RELOAD_ON_SAVE =
  /(?:stackScreenOptions|ShowcaseLargeTitle|ShowcaseStackScreen|showcaseTabHomeTitles|HomeView|_layout)\.(tsx?|jsx?)$/;

let debounceTimer;

function scheduleReload(label) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    console.log(`[watch-showcase-nav] ${label} → reload`);
    await triggerMetroReload({ quiet: true });
  }, 320);
}

watch(showcaseRoot, { recursive: true }, (_event, filename) => {
  if (!filename || !RELOAD_ON_SAVE.test(filename)) return;
  scheduleReload(filename);
});

console.log(`[watch-showcase-nav] watching ${showcaseRoot} (_layout / stackScreenOptions / ShowcaseLargeTitle)`);
