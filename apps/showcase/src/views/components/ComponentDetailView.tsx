import {
  applyMenuTriggerPreviewProps,
  findShowcaseCatalogEntry,
  mergeCatalogPreviewProps,
  resolveRnDocConfig,
  resolveShowcasePreviewComponent,
} from '@/data/components';
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
import type { EgNavBarAction } from '@eds/mobile-components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
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
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcasePageBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { UsageSnippetBlock } from '@/views/shared/UsageSnippetBlock';
import type { ComponentDetailDocPanel } from '@/views/components/ComponentDetailDocActions';
import { MenuSectionsCustomizePanel } from '@/views/components/menu/MenuSectionsCustomizePanel';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';

function createComponentDetailStyles(colors: ShowcaseColorMap, nativeStackNav: boolean) {
  const pageBg = showcasePageBackgroundColor(colors);
  return StyleSheet.create({
  /** iOS 26+ 系统 scroll edge — 勿在 ScrollView 外包带底色 View（`contentStyle` 已设色）。 */
    scrollRoot: {
      flex: 1,
      ...(nativeStackNav ? null : { backgroundColor: pageBg }),
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
    previewContent: showcaseComponentPreviewContentStyle,
    missing: {
      fontSize: 14,
      color: colors['text-base-secondary'] as string,
      textAlign: 'center',
    },
  });
}

export function ComponentDetailView() {
  const insets = useSafeAreaInsets();
  const { slug: slugParam } = useLocalSearchParams<{ slug: string }>();
  const slug = slugParam ?? '';
  const entry = findShowcaseCatalogEntry(slug);
  const exportName = entry?.exportName ?? slug;
  const doc = resolveRnDocConfig(slug, exportName);
  const displayName = doc?.componentTag ?? exportName;
  const { mode, setMode, clearPinned } = useShowcaseDev();

  const onToggleInspectMode = useCallback(() => {
    if (mode === 'inspect') {
      clearPinned();
      setMode('preview');
      return;
    }
    setMode('inspect');
  }, [clearPinned, mode, setMode]);

  const inspectNavAction = useMemo<EgNavBarAction>(
    () => ({
      kind: 'text',
      label: mode === 'inspect' ? 'Preview' : 'Inspect',
      accessibilityLabel: mode === 'inspect' ? '返回预览模式' : 'Inspect 模式',
      onPress: onToggleInspectMode,
    }),
    [mode, onToggleInspectMode],
  );

  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(displayName, { showRight: true, right: inspectNavAction });
  const styles = useThemedStyles((c) => createComponentDetailStyles(c, nativeStackNav));
  const scrollBottomInset =
    COMPONENT_DETAIL_FOOTER_HEIGHT +
    Math.max(insets.bottom, edsSpacing('spacing-3')) +
    edsSpacing('spacing-4');

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
      return `${entry.slug}-${String(customize.rowCount ?? '1')}-${String(customize.graphicEnabled)}-${String(customize.graphicType)}-${String(customize.primaryWeight)}-${String(customize.subBoldSegment)}-${String(customize.widgetEnabled)}-${String(customize.widgetShowTime)}-${String(customize.widgetShowTag)}-${String(customize.widgetShowCustom)}-${String(customize.widgetShowRedDot)}-${String(customize.interactive)}`;
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
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={styles.scrollRoot}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={[
            showcaseNavScrollContentStyle(
              nativeStackNav,
              rnScrollPaddingTop,
              mode === 'inspect' ? styles.scrollInspect : styles.scrollWithFixedFooter,
            ),
            { paddingBottom: scrollBottomInset },
          ]}
        >
          <DocSection title="预览" previewScreenFrame>
            <View style={styles.previewContent}>
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
    </ShowcaseStackScreen>
  );
}
