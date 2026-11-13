/**
 * Copy to consumer repo root as metro.config.js
 * Linked dev: @eds-evergreen/mobile → eds-mobile live sources (see packages/mobile/linkedMetroEntry.ts)
 */
const fs = require('node:fs');
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve: resolveRequest } = require('metro-resolver');

const projectRoot = __dirname;
/** Sibling eds-mobile — adjust if your layout differs */
const edsMobileRoot = path.resolve(projectRoot, '../eds-mobile');

const linkedMobileEntry = path.join(edsMobileRoot, 'packages/mobile/linkedMetroEntry.ts');
const componentsRoot = path.join(edsMobileRoot, 'packages/components');
const animationsRoot = path.join(edsMobileRoot, 'packages/animations');
const tokensRoot = path.join(edsMobileRoot, 'packages/tokens');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  projectRoot,
  componentsRoot,
  animationsRoot,
  tokensRoot,
  path.join(edsMobileRoot, 'packages/mobile'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.join(edsMobileRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'import', 'require', 'default'];

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
  if (moduleName === '@eds-evergreen/mobile') {
    if (!fs.existsSync(linkedMobileEntry)) {
      throw new Error(
        `[EDS] missing ${linkedMobileEntry} — check edsMobileRoot (../eds-mobile)`,
      );
    }
    return { type: 'sourceFile', filePath: linkedMobileEntry };
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
