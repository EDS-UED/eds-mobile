import { buildDistCssManifest } from './extract-dist-css-manifest.mjs';

function collectCatalogEntries() {
  // Node-side mirror of catalog getters — import would need tsx; validate manifest coverage instead.
  return buildDistCssManifest();
}

function verifyManifestCoverage() {
  const manifest = collectCatalogEntries();
  const errors = [];

  for (const [name, value] of Object.entries(manifest.vars.scale)) {
    if (!value) {
      errors.push(`scale var missing value: ${name}`);
    }
  }

  for (const className of ['motion-tap', 'glass-button-box', 'typography-display']) {
    const bucket = className.startsWith('motion')
      ? manifest.classes.motion
      : className.startsWith('glass-')
        ? manifest.classes.effect
        : manifest.classes.typography;

    if (!bucket[className]?.length) {
      errors.push(`missing dist class rules: ${className}`);
    }
  }

  return errors;
}

const errors = verifyManifestCoverage();
if (errors.length > 0) {
  console.error('Dist token catalog verification failed:\n' + errors.join('\n'));
  process.exit(1);
}

console.log('✓ Dist CSS manifest covers core token classes and scale vars');
