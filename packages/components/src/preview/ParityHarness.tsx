import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { figmaComponentCatalog, type FigmaComponentEntry } from '../catalog/figmaCatalog.js';
import { isImplementedCatalogEntry } from '../catalog/implementedSlugs.js';
import { createCatalogPreviewProps } from './createCatalogPreviewProps.js';
import { resolvePreviewComponent } from './resolvePreviewComponent.js';
import type { ThemeMode } from '../theme/index.js';

/**
 * Layout width every parity run measures against: a 390pt screen minus the 16pt
 * gutters the catalog preview canvas applies. Both surfaces must use this exact
 * number or the comparison is meaningless.
 */
export const PARITY_CONTAINER_WIDTH = 358;

export type ParityMeasurement = {
  slug: string;
  exportName: string;
  width: number;
  height: number;
};

export type ParityReport = {
  containerWidth: number;
  mode: ThemeMode;
  measurements: ParityMeasurement[];
};

export function parityCatalogEntries(): FigmaComponentEntry[] {
  return figmaComponentCatalog
    .filter(isImplementedCatalogEntry)
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Round to 2dp — Yoga and CSS both emit sub-pixel values that are noise at this scale. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Renders every implemented catalog component at a fixed width and reports the
 * measured box of each one.
 *
 * Both react-native-web and native RN implement `onLayout`, so the same harness
 * yields comparable geometry on either renderer — that comparison is what proves
 * the browser preview still matches the device.
 */
export function ParityHarness({
  mode = 'light',
  onReport,
}: {
  mode?: ThemeMode;
  onReport: (report: ParityReport) => void;
}) {
  const entries = parityCatalogEntries();
  const collected = useRef(new Map<string, ParityMeasurement>());
  const [reported, setReported] = useState(false);

  const handleLayout = useCallback(
    (entry: FigmaComponentEntry, event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      collected.current.set(entry.slug, {
        slug: entry.slug,
        exportName: entry.exportName,
        width: round(width),
        height: round(height),
      });

      if (collected.current.size === entries.length && !reported) {
        setReported(true);
        onReport({
          containerWidth: PARITY_CONTAINER_WIDTH,
          mode,
          measurements: entries
            .map((item) => collected.current.get(item.slug))
            .filter((item): item is ParityMeasurement => Boolean(item)),
        });
      }
    },
    [entries, mode, onReport, reported],
  );

  return (
    <View style={styles.root}>
      {entries.map((entry) => {
        const Component = resolvePreviewComponent(entry.exportName);
        if (!Component) return null;
        return (
          <View
            key={entry.slug}
            style={styles.slot}
            onLayout={(event) => handleLayout(entry, event)}
          >
            <Component {...createCatalogPreviewProps(entry, mode)} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: PARITY_CONTAINER_WIDTH,
    alignItems: 'stretch',
  },
  slot: {
    width: PARITY_CONTAINER_WIDTH,
    alignItems: 'stretch',
  },
});
