/** Tab section homes — 底部 EgTabBar 仅在这些路由显示。 */
const TAB_HOME_PATHS = [
  '/(tokens)',
  '/(animations)',
  '/(components)',
  '/(patterns)',
  '/(workflows)',
] as const;

const TAB_GROUP_NAMES = new Set([
  '(tokens)',
  '(animations)',
  '(components)',
  '(patterns)',
  '(workflows)',
]);
const TAB_SLUGS = ['tokens', 'animations', 'components', 'patterns', 'workflows'] as const;

const INNER_ROUTE_ROOTS = new Set([
  'category',
  'color',
  'detail',
  'tier',
  'family',
  'gallery',
  'motion',
  'glass-demo',
  'parity',
]);

function normalizePathname(pathname: string) {
  const trimmed = pathname.replace(/\/$/, '') || '/';
  if (trimmed.endsWith('/index')) {
    return trimmed.slice(0, -'/index'.length) || '/';
  }
  return trimmed;
}

function isTabHomePath(normalized: string) {
  if (TAB_HOME_PATHS.includes(normalized as (typeof TAB_HOME_PATHS)[number])) {
    return true;
  }

  return TAB_SLUGS.some((slug) => normalized === `/${slug}`);
}

function isTabSectionHome(segments: string[]) {
  const [group, second] = segments;
  if (!TAB_GROUP_NAMES.has(group)) {
    return false;
  }

  return segments.length === 1 || (segments.length === 2 && second === 'index');
}

function isNestedPathname(normalized: string) {
  if (isTabHomePath(normalized)) {
    return false;
  }

  for (const home of TAB_HOME_PATHS) {
    if (normalized.startsWith(`${home}/`)) {
      return true;
    }
  }

  for (const slug of TAB_SLUGS) {
    if (normalized.startsWith(`/${slug}/`)) {
      return true;
    }
  }

  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 0) {
    return false;
  }

  if (parts.length === 1) {
    if (TAB_SLUGS.includes(parts[0] as (typeof TAB_SLUGS)[number])) {
      return false;
    }

    if (TAB_GROUP_NAMES.has(parts[0])) {
      return false;
    }

    return INNER_ROUTE_ROOTS.has(parts[0]);
  }

  if (INNER_ROUTE_ROOTS.has(parts[0])) {
    return true;
  }

  return parts.length >= 2;
}

/** 内层 Stack 页隐藏底部 Tab 条（EgTabBar / NativeTabs）。 */
export function shouldHideShowcaseTabBar(pathname: string, segments: string[] = []) {
  if (segments.length > 0 && TAB_GROUP_NAMES.has(segments[0])) {
    return !isTabSectionHome(segments);
  }

  return isNestedPathname(normalizePathname(pathname));
}
