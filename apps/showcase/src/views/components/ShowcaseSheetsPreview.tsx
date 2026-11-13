import {
  EgSheets,
  getThemeColors,
  type EgSheetsDetent,
  type ThemeMode,
} from '@eds/mobile-components';
import { memo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  buildSheetsPropsFromCustomize,
  type SheetsContentKind,
} from '@/data/components/sheetsCustomizeModel';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

const DETENT_LABELS: Record<EgSheetsDetent, string> = {
  small: '小',
  medium: '中',
  adaptive: '自适应',
  large: '大',
};

const LONG_PARAGRAPH =
  'EDS Sheets 滚动区域占位文案。大档位时内容区可纵向滚动；小 / 中档位内容区禁止滚动，按住任意位置拖拽改档位。';
const LONG_PARAGRAPH_COUNT = 28;

type ShowcaseSheetsPreviewProps = Record<string, unknown> & {
  mode?: ThemeMode;
};

/** 内容插槽占位 · 虚线框标示 `children` 区域。 */
const SheetsSlotPlaceholder = memo(function SheetsSlotPlaceholder({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  return (
    <View style={[styles.slot, { borderColor: colors['text-base-quaternary'] as string }]}>
      <Text style={[styles.slotTitle, { color: colors['text-base-secondary'] as string }]}>
        Slot
      </Text>
      <Text style={[styles.slotHint, { color: colors['text-base-tertiary'] as string }]}>
        children · 内容插槽
      </Text>
    </View>
  );
});

/** 长文本 · 测最高档滚动与长按拖拽。 */
const SheetsLongContent = memo(function SheetsLongContent({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  return (
    <>
      {Array.from({ length: LONG_PARAGRAPH_COUNT }, (_, index) => (
        <Text
          key={index}
          style={[styles.paragraph, { color: colors['text-base-secondary'] as string }]}
        >
          {`${LONG_PARAGRAPH}（${index + 1}/${LONG_PARAGRAPH_COUNT}）`}
        </Text>
      ))}
    </>
  );
});

function SheetsContent({ kind, mode }: { kind: SheetsContentKind; mode: ThemeMode }) {
  return kind === 'long' ? <SheetsLongContent mode={mode} /> : <SheetsSlotPlaceholder mode={mode} />;
}

/** 组件详情 / 动效页 — 点按打开 EgSheets（Customize 实时生效）；内容区经 children 插槽传入。 */
export function ShowcaseSheetsPreview(props: ShowcaseSheetsPreviewProps) {
  const { mode = 'light' } = props;
  const sheetProps = buildSheetsPropsFromCustomize(props);
  const [open, setOpen] = useState(false);
  const [detent, setDetent] = useState<EgSheetsDetent>(sheetProps.initialDetent);

  const show = () => {
    setDetent(sheetProps.initialDetent);
    setOpen(true);
  };

  return (
    <View style={styles.host}>
      <ShowcaseCardRow
        title="打开 Sheets"
        hint={`档位 ${sheetProps.detents.map((item) => DETENT_LABELS[item]).join(' / ')} · 内容插槽 · 顶栏拖拽改档`}
        onPress={show}
      />
      <EgSheets
        visible={open}
        onDismiss={() => setOpen(false)}
        detent={detent}
        onDetentChange={setDetent}
        mode={mode}
        title={sheetProps.title}
        showTitle={sheetProps.showTitle}
        showLeft={sheetProps.showLeft}
        onBack={() => setOpen(false)}
        showRight={sheetProps.showRight}
        detents={sheetProps.detents}
        initialDetent={sheetProps.initialDetent}
        dismissible={sheetProps.dismissible}
        scrollEdgeEffect={sheetProps.scrollEdgeEffect}
        showActions={sheetProps.showActions}
      >
        <SheetsContent kind={sheetProps.content} mode={mode} />
      </EgSheets>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: 'stretch',
    gap: showcaseTheme.layout.cardGap,
  },
  slot: {
    ...showcaseTheme.blockRadius,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: showcaseTheme.layout.titleHintGap,
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
    paddingVertical: showcaseTheme.layout.tokenBaseTilePaddingVertical,
  },
  slotTitle: showcaseTheme.font.rowTitle,
  slotHint: showcaseTheme.font.rowHint,
  paragraph: {
    ...showcaseTheme.font.pageLead,
    marginBottom: showcaseTheme.layout.cardGap,
  },
});
