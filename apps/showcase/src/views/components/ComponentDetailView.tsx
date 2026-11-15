import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import {
  applyMenuTriggerPreviewProps,
  findShowcaseCatalogEntry,
  mergeCatalogPreviewProps,
  resolveRnDocConfig,
  resolveShowcasePreviewComponent,
} from '@/data/components';
import { readDataListRowCount } from '@/data/components/dataListCustomizeModel';
import {
  buildTabBarTextDefaultSelectedOptions,
  readTabBarTextTabCount,
} from '@/data/components/tabBarTextCustomizeModel';
import { readTabSegmentCount } from '@/data/components/tabCustomizeModel';
import {
  buildRnAiPrompt,
  figmaNameFromCatalogEntry,
  resolveRnAiCustomizeState,
  tierFamilyFromEntry,
} from '@/data/components/buildRnAiPrompt';
import { showcaseInfraPreviewDefaults } from '@/data/components/showcaseInfraPreviewDefaults';
import { egNavBarScrollContentReserve } from '@eds/mobile-components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { useShowcaseDev } from '@/hooks/useShowcaseDev';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import {
  ComponentDetailActionFooter,
  COMPONENT_DETAIL_FOOTER_HEIGHT,
} from '@/views/shared/ComponentDetailActionFooter';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { CustomizeSlotCardStack } from '@/views/shared/CustomizeSlotCardStack';
import { DocContentSheet } from '@/views/shared/DocContentSheet';
import { DocSection } from '@/views/shared/DocSection';
import { InspectSheet } from '@/views/shared/InspectSheet';
import { PropsDocTable } from '@/views/shared/PropsDocTable';
import { ShowcaseInspectTarget } from '@/views/shared/ShowcaseInspectTarget';
import {
  showcaseDetailScreenBackgroundColor,
  showcaseTheme as theme,
} from '@/views/shared/showcaseTheme';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { UsageSnippetBlock } from '@/views/shared/UsageSnippetBlock';
import type { ComponentDetailDocPanel } from '@/views/components/ComponentDetailDocActions';
import { MenuSectionsCustomizePanel } from '@/views/components/menu/MenuSectionsCustomizePanel';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

function createComponentDetailStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: showcaseDetailScreenBackgroundColor(colors),
    },
    root: {
      flex: 1,
      backgroundColor: showcaseDetailScreenBackgroundColor(colors),
    },
    scrollContent: {
      paddingBottom: theme.layout.scrollBottom,
    },
    scrollWithFixedFooter: {
      paddingBottom: 0,
    },
    scrollInspect: {
      paddingBottom: 160,
    },
    canvas: {
      ...catalogPreviewCanvasStyle,
      minHeight: 160,
      justifyContent: 'center',
    },
    canvasFullBleed: {
      padding: 0,
      gap: 0,
      alignSelf: 'stretch',
      width: '100%',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    missing: {
      fontSize: 14,
      color: colors['text-base-secondary'] as string,
      textAlign: 'center',
    },
  });
}

export function ComponentDetailView() {
  const styles = useThemedStyles(createComponentDetailStyles);
  const insets = useSafeAreaInsets();
  const { slug: slugParam } = useLocalSearchParams<{ slug: string }>();
  const slug = slugParam ?? '';
  const entry = findShowcaseCatalogEntry(slug);
  const exportName = entry?.exportName ?? slug;
  const doc = resolveRnDocConfig(slug, exportName);
  const displayName = doc?.componentTag ?? exportName;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(displayName);
  const previewTopInset =
    (nativeStackNav ? egNavBarScrollContentReserve(insets.top) : rnScrollPaddingTop) +
    theme.layout.cardPaddingVertical;
  const scrollBottomInset =
    COMPONENT_DETAIL_FOOTER_HEIGHT +
    Math.max(insets.bottom, edsSpacing('spacing-3')) +
    edsSpacing('spacing-4');

  const { mode, setMode, clearPinned } = useShowcaseDev();
  const { colorTheme } = useShowcaseThemeContext();
  const PreviewComponent = resolveShowcasePreviewComponent(exportName);

  const [customize, setCustomize] = useState<Record<string, unknown>>(
    () => doc?.customizeDefaults ?? {},
  );
  const applyCustomizeChange = (next: Record<string, unknown>) => {
    setCustomize((prev) => ({ ...prev, ...next }));
  };
  const [measuredLayout, setMeasuredLayout] = useState<string[]>([]);
  const [docPanel, setDocPanel] = useState<ComponentDetailDocPanel | null>(null);

  const previewProps = useMemo(() => {
    const previewMode =
      customize.mode === 'light' || customize.mode === 'dark' ? customize.mode : colorTheme;

    if (!entry) {
      return { testID: slug, mode: previewMode, ...customize };
    }
    const infraDefaults = showcaseInfraPreviewDefaults(slug);
    if (infraDefaults) {
      const merged = { mode: previewMode, testID: slug, ...infraDefaults, ...customize };
      return entry ? applyMenuTriggerPreviewProps(entry, merged) : merged;
    }
    return mergeCatalogPreviewProps(entry, customize, previewMode);
  }, [colorTheme, customize, entry, slug]);

  const previewRemountKey = useMemo(() => {
    if (!entry) {
      return slug;
    }
    if (
      entry.exportName === 'EgTab' ||
      entry.exportName === 'EgTabBlock' ||
      entry.exportName === 'EgSegmentedControl'
    ) {
      return `${entry.slug}-${readTabSegmentCount(customize)}-${String(customize.size ?? 'md')}`;
    }
    if (entry.exportName === 'EgDataList') {
      return `${entry.slug}-${readDataListRowCount(customize)}-${String(customize.graphicEnabled)}-${String(customize.graphicType)}-${String(customize.widgetEnabled)}-${String(customize.interactive)}`;
    }
    if (entry.exportName === 'EgTabBarText') {
      return `${entry.slug}-${readTabBarTextTabCount(customize)}-${String(customize.defaultSelectedIndex ?? '0')}`;
    }
    return entry.slug;
  }, [customize, entry, slug]);

  const customizeControls = useMemo(() => {
    const controls = doc?.customizeControls ?? [];
    if (exportName !== 'EgTabBarText') {
      return controls;
    }
    const count = readTabBarTextTabCount(customize);
    return controls.map((control) => {
      if (control.kind === 'select' && control.key === 'defaultSelectedIndex') {
        return { ...control, options: buildTabBarTextDefaultSelectedOptions(count) };
      }
      return control;
    });
  }, [customize, doc?.customizeControls, exportName]);

  const usageCode = useMemo(() => {
    if (doc?.buildUsageSnippet) {
      return doc.buildUsageSnippet(customize);
    }
    return `<${doc?.componentTag ?? exportName} />`;
  }, [customize, doc, exportName]);

  const aiPrompt = useMemo(() => {
    const snippet = usageCode.trim() || `<${exportName} />`;
    return buildRnAiPrompt({
      exportName,
      slug,
      figmaName: figmaNameFromCatalogEntry(entry),
      ...tierFamilyFromEntry(entry),
      doc: doc ?? undefined,
      customizeState: resolveRnAiCustomizeState(doc ?? undefined, customize),
      usageSnippet: snippet,
    });
  }, [customize, doc, entry, exportName, slug, usageCode]);

  const styleLines = useMemo(() => {
    const lines = Object.entries(customize)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
    if (measuredLayout.length > 0) {
      return [...lines, ...measuredLayout.map((line) => `measured ${line}`)];
    }
    return lines;
  }, [customize, measuredLayout]);

  const docSheetTitle =
    docPanel === 'usage' ? 'USAGE' : docPanel === 'props' ? 'PROPS / API' : '';

  return (
    <View style={styles.screen}>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={styles.root}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never"
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={[
            mode === 'inspect' ? styles.scrollInspect : styles.scrollWithFixedFooter,
            { paddingTop: previewTopInset, paddingBottom: scrollBottomInset },
          ]}
        >
          <DocSection title="预览" previewScreenFrame>
            <View style={[styles.canvas, styles.canvasFullBleed]}>
              <ShowcaseInspectTarget
                inspect={{
                  label: exportName,
                  styleLines,
                  motionLines: ['preset: —', 'scene: —'],
                }}
                onMeasuredLayout={setMeasuredLayout}
              >
                {PreviewComponent && entry ? (
                  <PreviewComponent key={previewRemountKey} {...previewProps} />
                ) : PreviewComponent ? (
                  <PreviewComponent testID={slug} {...customize} />
                ) : (
                  <Text style={styles.missing}>No export registered for {exportName}</Text>
                )}
              </ShowcaseInspectTarget>
            </View>
          </DocSection>

          <DocSection title="定制" egItemGroupFrame>
            {doc?.customizeLayout === 'menu-sections' ? (
              <MenuSectionsCustomizePanel state={customize} onChange={applyCustomizeChange} />
            ) : (
              <CustomizePanel
                controls={customizeControls}
                state={customize}
                onChange={applyCustomizeChange}
              />
            )}
          </DocSection>

          {doc?.customizeSlotCards?.length ? (
            <DocSection title="插槽" slotStack>
              <CustomizeSlotCardStack
                cardControls={doc.customizeSlotCards}
                state={customize}
                onChange={applyCustomizeChange}
              />
            </DocSection>
          ) : null}

          {doc?.customizeSlotControls?.length ? (
            <DocSection title="插槽" egItemGroupFrame>
              <CustomizePanel
                sectionDividers
                controls={doc.customizeSlotControls}
                state={customize}
                onChange={applyCustomizeChange}
              />
            </DocSection>
          ) : null}
        </ScrollView>
      </ShowcaseNavBlurBackdrop>

      <ComponentDetailActionFooter copyPrompt={aiPrompt} onOpen={setDocPanel} />

      <DocContentSheet
        visible={docPanel != null}
        title={docSheetTitle}
        onClose={() => setDocPanel(null)}
      >
        {docPanel === 'usage' ? (
          <UsageSnippetBlock
            importCode={
              doc?.importCode ?? `import { ${exportName} } from '@eds/mobile-components';`
            }
            usageCode={usageCode}
          />
        ) : null}
        {docPanel === 'props' ? <PropsDocTable rows={doc?.propRows ?? []} /> : null}
      </DocContentSheet>

      <InspectSheet />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          onPress={() => {
            if (mode === 'inspect') {
              clearPinned();
              setMode('preview');
              return;
            }
            setMode('inspect');
          }}
        >
          {mode === 'inspect' ? 'Preview' : 'Inspect'}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </View>
  );
}
