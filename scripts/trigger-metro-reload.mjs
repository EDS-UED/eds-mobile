#!/usr/bin/env node
/**
 * Ask Expo Metro to reload all connected React Native clients.
 * Used after token dist rebuilds (Fast Refresh won't pick up theme.js swaps).
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.RCT_METRO_PORT || process.env.EXPO_DEV_SERVER_PORT || 8080);
const url = `ws://127.0.0.1:${port}/message`;

export async function triggerMetroReload({ quiet = false } = {}) {
  try {
    const ws = new WebSocket(url);

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), 1500);
      ws.addEventListener(
        'open',
        () => {
          clearTimeout(timer);
          resolve(undefined);
        },
        { once: true },
      );
      ws.addEventListener(
        'error',
        (event) => {
          clearTimeout(timer);
          reject(event.error ?? new Error('websocket error'));
        },
        { once: true },
      );
    });

    ws.send(JSON.stringify({ method: 'reload', version: 2 }));
    ws.close();

    if (!quiet) {
      console.log('[metro-reload] ✓ reload sent to connected devices');
    }
    return true;
  } catch {
    if (!quiet) {
      console.log('[metro-reload] skip (Metro not running or no device connected)');
    }
    return false;
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  triggerMetroReload().then((ok) => process.exit(ok ? 0 : 1));
}
