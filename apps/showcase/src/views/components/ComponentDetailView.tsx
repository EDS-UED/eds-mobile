import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import {
  applyMenuTriggerPreviewProps,
  findShowcaseCatalogEntry,
  mergeCatalogPreviewProps,
  resolveRnDocConfig,
  resolveShowcasePreviewComponent,
} from '@/data/components';
import { readTabSegmentCount } from '@/data/components/tabCustomizeModel';
import {
  buildRnAiPrompt,
  figmaNameFromCatalogEntry,
  resolveRnAiCustomizeState,
  tierFamilyFromEntry,
} from '@/data/components/buildRnAiPrompt';
import { showcaseInfraPreviewDefaults } from '@/data/components/showcaseInfraPreviewDefaults';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShowcaseDev } from '@/hooks/useShowcaseDev';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { CopyAiPromptFooter, COPY_AI_PROMPT_FOOTER_HEIGHT } from '@/views/shared/CopyAiPromptFooter';
import { DocContentSheet } from '@/views/shared/DocContentSheet';
import { DocSection } from '@/views/shared/DocSection';
import { InspectSheet } from '@/views/shared/InspectSheet';
import { PropsDocTable } from '@/views/shared/PropsDocTable';
import { ShowcaseInspectTarget } from '@/views/shared/ShowcaseInspectTarget';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { UsageSnippetBlock } from '@/views/shared/UsageSnippetBlock';
import {
  ComponentDetailDocActions,
  type ComponentDetailDocPanel,
} from '@/views/components/ComponentDetailDocActions';
import { MenuSectionsCustomizePanel } from '@/views/components/menu/MenuSectionsCustomizePanel';

const STACK_HEADER_BAR = Platform.select({ ios: 44, android: 56, default: 44 }) as number;

function createComponentDetailStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.page as string,
    },
    root: {
      flex: 1,
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
    previewStage: {
      width: '100%',
      alignSelf: 'stretch',
      backgroundColor: colors['material-card-shallow'] as string,
      paddingHorizontal: theme.layout.cardPaddingHorizontal,
      paddingBottom: theme.layout.cardPaddingVertical,
    },
    canvas: {
      ...catalogPreviewCanvasStyle,
      minHeight: 160,
      justifyContent: 'center',
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
  const previewTopInset = insets.top + STACK_HEADER_BAR + theme.layout.cardPaddingVertical;
  const scrollBottomInset =
    COPY_AI_PROMPT_FOOTER_HEIGHT +
    Math.max(insets.bottom, edsSpacing('spacing-3')) +
    edsSpacing('spacing-4');
  const { slug: slugParam } = useLocalSearchParams<{ slug: string }>();
  const slug = slugParam ?? '';
  const entry = findShowcaseCatalogEntry(slug);
  const exportName = entry?.exportName ?? slug;
  const doc = resolveRnDocConfig(slug, exportName);
  const displayName = doc?.componentTag ?? exportName;

  const { mode, setMode, clearPinned } = useShowcaseDev();
  const { colorTheme } = useShowcaseThemeContext();
  const PreviewComponent = resolveShowcasePreviewComponent(exportName);

  const [customize, setCustomize] = useState<Record<string, unknown>>(
    () => doc?.customizeDefaults ?? {},
  );
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
    if (entry.exportName === 'EgTab' || entry.exportName === 'EgSegmentedControl') {
      return `${entry.slug}-${readTabSegmentCount(customize)}-${String(customize.size ?? 'md')}`;
    }
    return entry.slug;
  }, [customize, entry, slug]);

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
      <ScrollView
        style={styles.root}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          mode === 'inspect' ? styles.scrollInspect : styles.scrollWithFixedFooter,
          { paddingBottom: scrollBottomInset },
        ]}
      >
        <View style={[styles.previewStage, { paddingTop: previewTopInset }]}>
          <View style={styles.canvas}>
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
        </View>

        <ComponentDetailDocActions onOpen={setDocPanel} />

        <DocSection title="定制">
          {doc?.customizeLayout === 'menu-sections' ? (
            <MenuSectionsCustomizePanel state={customize} onChange={setCustomize} />
          ) : (
            <CustomizePanel
              controls={doc?.customizeControls ?? []}
              state={customize}
              onChange={setCustomize}
            />
          )}
        </DocSection>
      </ScrollView>

      <CopyAiPromptFooter prompt={aiPrompt} />

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
      <Stack.Title>{displayName}</Stack.Title>
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
