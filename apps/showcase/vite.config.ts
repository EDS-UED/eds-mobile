import vue from '@vitejs/plugin-vue';
import prefixSelector from 'postcss-prefix-selector';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

const repoRoot = resolve(__dirname, '../..');
const tokensSpecDir = resolve(repoRoot, 'packages/tokens/spec');
const tokensDistDir = resolve(repoRoot, 'packages/tokens/dist');
const componentsSrcDir = resolve(repoRoot, 'packages/components/src');
const animationsSrcDir = resolve(repoRoot, 'packages/mobile-animations/src');
const tokensBuildScript = resolve(repoRoot, 'packages/tokens/scripts/build.mjs');

/** spec 变更 → 重建 dist → full-reload；dist/css 外部重建 → full-reload；components 走 alias + HMR。 */
function watchMobileTokens(): Plugin {
  let building = false;
  let queued = false;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let distReloadTimer: ReturnType<typeof setTimeout> | undefined;

  function scheduleFullReload(server: { ws: { send: (payload: unknown) => void } }) {
    clearTimeout(distReloadTimer);
    distReloadTimer = setTimeout(() => {
      server.ws.send({ type: 'full-reload' });
    }, 120);
  }

  function runTokenBuild(server: { ws: { send: (payload: unknown) => void } }) {
    if (building) {
      queued = true;
      return;
    }

    building = true;
    const child = spawn(process.execPath, [tokensBuildScript], {
      cwd: resolve(repoRoot, 'packages/tokens'),
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      building = false;
      if (code === 0) {
        scheduleFullReload(server);
      } else {
        console.error('[watch-mobile-tokens] build failed');
      }
      if (queued) {
        queued = false;
        runTokenBuild(server);
      }
    });
  }

  return {
    name: 'watch-mobile-tokens',
    configureServer(server) {
      server.watcher.add(tokensSpecDir);
      server.watcher.add(tokensDistDir);
      server.watcher.add(componentsSrcDir);
      server.watcher.add(animationsSrcDir);

      server.watcher.on('change', (file) => {
        if (file.startsWith(tokensSpecDir)) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => runTokenBuild(server), 200);
          return;
        }

        if (
          !building &&
          file.startsWith(tokensDistDir) &&
          (file.endsWith('.css') || file.endsWith('.json'))
        ) {
          scheduleFullReload(server);
          return;
        }

        if (file.startsWith(componentsSrcDir) && /\.(vue|css)$/.test(file)) {
          scheduleFullReload(server);
          return;
        }

        if (file.startsWith(animationsSrcDir) && /\.(vue|css)$/.test(file)) {
          scheduleFullReload(server);
        }
      });
    },
  };
}

function scopeMobileTokens() {
  return prefixSelector({
    prefix: '.mobileTokens',
    includeFiles: [/mobile-token-scope\.css$/, /mobile-components-scope\.css$/],
    transform(_prefix, selector, prefixedSelector) {
      if (/^\[data-theme=["']?dark["']?\]\s+/.test(selector)) {
        return selector.replace(
          /^\[data-theme=["']?dark["']?\]/,
          '[data-theme="dark"] .mobileTokens',
        );
      }

      if (/^\[data-theme=["']?light["']?\]\s+/.test(selector)) {
        return selector.replace(
          /^\[data-theme=["']?light["']?\]/,
          '[data-theme="light"] .mobileTokens',
        );
      }

      if (selector === '[data-theme="dark"]' || selector === '[data-theme=dark]') {
        return '[data-theme="dark"] .mobileTokens';
      }

      if (
        selector === ':root' ||
        selector.startsWith(':root,') ||
        selector.includes('[data-theme="light"]') ||
        selector.includes('[data-theme=light]')
      ) {
        return '.mobileTokens';
      }

      if (selector === 'body') {
        return '.mobileTokens';
      }

      if (selector === 'input' || selector === 'textarea' || selector === 'button') {
        return `.mobileTokens ${selector}`;
      }

      if (selector === '.mobileTokens' || selector.startsWith('.mobileTokens ')) {
        return selector;
      }

      return prefixedSelector;
    },
  });
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [vue(), watchMobileTokens()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@eds/mobile-animations': resolve(__dirname, '../../packages/mobile-animations/src/index.ts'),
    },
  },
  css: {
    postcss: {
      plugins: [scopeMobileTokens()],
    },
  },
  optimizeDeps: {
    exclude: ['@eds/mobile-animations'],
  },
  server: {
    host: true,
    port: 5178,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname), resolve(__dirname, '../../..')],
    },
    watch: {
      ignored: [
        '**/node_modules/**',
        '!**/packages/components/**',
        '!**/packages/mobile-animations/**',
        '!**/packages/tokens/dist/**',
        '!**/packages/tokens/spec/**',
      ],
    },
  },
});
