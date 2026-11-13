const fs = require('node:fs');
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve: resolveRequest } = require('metro-resolver');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const componentsSrcEntry = path.resolve(workspaceRoot, 'packages/components/src/index.ts');
const componentsGlassEntry = path.resolve(workspaceRoot, 'packages/components/src/atoms/glass/index.ts');
const animationsSrcEntry = path.resolve(workspaceRoot, 'packages/animations/src/index.ts');
const tokensThemeEntry = path.resolve(workspaceRoot, 'packages/tokens/dist/js/theme.js');
const tokensFontsEntry = path.resolve(workspaceRoot, 'packages/tokens/dist/js/fonts-native.js');
const tokensMotionCatalogEntry = path.resolve(
  workspaceRoot,
  'packages/tokens/dist/json/motion/catalog.json',
);
const componentsCatalogEntry = path.resolve(workspaceRoot, 'packages/components/src/catalogEntry.ts');
const previewModuleMap = {
  'liquid-glass': path.resolve(workspaceRoot, 'packages/components/src/preview/LiquidGlassDemo.tsx'),
  motion: path.resolve(workspaceRoot, 'packages/components/src/preview/MotionDemo.tsx'),
  'atom-gallery': path.resolve(workspaceRoot, 'packages/components/src/preview/AtomGallery.tsx'),
  parity: path.resolve(workspaceRoot, 'packages/components/src/preview/ParityHarness.tsx'),
};

/** Monorepo: watch RN 源码 + tokens 运行时产物，不监听整包 dist/css（减少 crawl / 重启）。 */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  projectRoot,
  path.resolve(workspaceRoot, 'packages/components/src'),
  path.resolve(workspaceRoot, 'packages/animations/src'),
  path.resolve(workspaceRoot, 'packages/tokens/dist/js'),
  path.resolve(workspaceRoot, 'packages/tokens/dist/json'),
  path.resolve(workspaceRoot, 'packages/tokens/spec'),
  path.resolve(workspaceRoot, 'apps/showcase/src/data/tokens/generated'),
];
config.resolver.blockList = [
  /packages\/tokens\/dist\/css\/.*/,
  /packages\/components\/dist\/.*/,
  /packages\/animations\/dist\/.*/,
  /\/\.agents\/.*/,
];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'import', 'require', 'default'];

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

function resolveRelativeJsToTs(context, moduleName) {
  if (!moduleName.endsWith('.js') || !moduleName.startsWith('.')) {
    return null;
  }

  const originDir = path.dirname(context.originModulePath);
  const absBase = path.resolve(originDir, moduleName.slice(0, -3));

  for (const ext of ['.ts', '.tsx']) {
    const candidate = `${absBase}${ext}`;
    if (fs.existsSync(candidate)) {
      return { type: 'sourceFile', filePath: candidate };
    }
  }

  return null;
}

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@eds/mobile-components/catalog') {
    return { type: 'sourceFile', filePath: componentsCatalogEntry };
  }

  const previewPrefix = '@eds/mobile-components/preview/';
  if (moduleName.startsWith(previewPrefix)) {
    const key = moduleName.slice(previewPrefix.length);
    const previewPath = previewModuleMap[key];
    if (previewPath) {
      return { type: 'sourceFile', filePath: previewPath };
    }
  }

  if (moduleName === '@eds/mobile-components/glass') {
    return { type: 'sourceFile', filePath: componentsGlassEntry };
  }
  if (moduleName === '@eds/mobile-components') {
    return { type: 'sourceFile', filePath: componentsSrcEntry };
  }
  if (moduleName === '@eds/mobile-animations') {
    return { type: 'sourceFile', filePath: animationsSrcEntry };
  }
  if (moduleName === '@eds/mobile-tokens/theme') {
    return { type: 'sourceFile', filePath: tokensThemeEntry };
  }
  if (moduleName === '@eds/mobile-tokens/fonts-native') {
    return { type: 'sourceFile', filePath: tokensFontsEntry };
  }
  if (moduleName === '@eds/mobile-tokens/motion/catalog') {
    return { type: 'sourceFile', filePath: tokensMotionCatalogEntry };
  }

  const relativeTs = resolveRelativeJsToTs(context, moduleName);
  if (relativeTs) {
    return relativeTs;
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }

  return resolveRequest(context, moduleName, platform);
};

module.exports = config;
