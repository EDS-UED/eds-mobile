import {
  EG_DATA_LIST_SCENE_CONTENT_INSET,
  EG_DATA_LIST_SUB_TEXT_MAX_LINES,
  EgAvatar,
  EgTag,
  EgCryptoBtc,
  EgDataList,
  EgDataListPrimaryText,
  EgDataListMessage,
  EgDataListReddot,
  EgDataListRow,
  EgDataListSubText,
  EgSymbol,
  getEgDataListRowLayout,
} from '@eds/mobile-components';
import type { EgSymbolSize } from '@eds/mobile-components';
import mobileTheme from '@eds/mobile-tokens/theme';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import {
  dataListGraphicSpacingToken,
  dataListGraphicAvatarSize,
  readDataListGraphicSize,
  readDataListGraphicType,
  readDataListPrimaryWeight,
  readDataListRowCount,
  readDataListSubBoldSegment,
  readDataListWidgetFlags,
  type DataListWidgetFlags,
} from '@/data/components/dataListCustomizeModel';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

type ShowcaseEgDataListPreviewProps = Record<string, unknown>;

/** 与 Divider 预览一致 — 画布 `alignItems: center` 时子树须显式撑满可用宽。 */
const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

type DataListPressIntensity = 'xs' | 'sm' | 'md' | 'lg';

function DataListGraphicSlot({
  graphicEnabled,
  graphicSize,
  graphicType,
  iconSymbolSize,
  mode,
  colors,
}: {
  graphicEnabled: boolean;
  graphicSize: ReturnType<typeof readDataListGraphicSize>;
  graphicType: ReturnType<typeof readDataListGraphicType>;
  iconSymbolSize: EgSymbolSize;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
}) {
  if (!graphicEnabled) return null;

  const token = dataListGraphicSpacingToken(graphicSize);
  const boxPx = mobileTheme.spacing[token] as number;
  const radiusFull = mobileTheme.spacing['radius-full'] as number;

  if (graphicType === 'avatar') {
    return (
      <EgAvatar
        name="EDS"
        size={dataListGraphicAvatarSize(graphicSize)}
        variant="initials"
        accessibilityLabel="头像"
      />
    );
  }

  if (graphicType === 'crypto') {
    const boxPx = mobileTheme.spacing[dataListGraphicSpacingToken(graphicSize)] as number;
    return <EgCryptoBtc mode={mode} displayPx={boxPx} accessibilityLabel="BTC" />;
  }

  if (graphicType === 'icon') {
    return (
      <View
        style={{
          width: boxPx,
          height: boxPx,
          borderRadius: radiusFull,
          backgroundColor: colors['material-card-deep'] as string,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EgSymbol name="eds-add" mode={mode} size={iconSymbolSize} accessibilityLabel="图标" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: boxPx,
        height: boxPx,
        borderRadius: radiusFull,
        backgroundColor: colors['material-card-deep'] as string,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ShowcaseSansText
        style={[
          edsTokenFont('body-small-strong', '600'),
          { color: colors['text-base-secondary'] as string },
        ]}
      >
        自定
      </ShowcaseSansText>
    </View>
  );
}

function DataListPrimaryRowWidgets({
  flags,
  mode,
  colors,
}: {
  flags: DataListWidgetFlags;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
}) {
  const secondaryStyle = [
    edsTokenFont('body-small', '400'),
    { color: colors['text-base-secondary'] as string },
  ];

  const nodes: React.ReactNode[] = [];
  if (flags.showTime) {
    nodes.push(
      <ShowcaseSansText key="time" style={secondaryStyle}>
        14:20
      </ShowcaseSansText>,
    );
  }
  if (flags.showTag) {
    nodes.push(<EgTag key="tag" size="sm" label="标签" mode={mode} />);
  }
  if (flags.showCustom) {
    nodes.push(
      <ShowcaseSansText key="custom" style={secondaryStyle}>
        详情
      </ShowcaseSansText>,
    );
  }
  if (nodes.length === 0) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: mobileTheme.spacing['spacing-2'] as number }}>
      {nodes}
    </View>
  );
}

function DataListDemoRow({
  index,
  state,
  interactive,
  pressIntensity,
  forceTouchEnabled,
  mode,
  colors,
}: {
  index: number;
  state: ShowcaseEgDataListPreviewProps;
  interactive: boolean;
  pressIntensity: DataListPressIntensity;
  forceTouchEnabled: boolean;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
}) {
  const spacing = mobileTheme.spacing;
  const layout = getEgDataListRowLayout();
  const graphicEnabled = state.graphicEnabled !== false;
  const graphicSize = readDataListGraphicSize(state);
  const graphicType = readDataListGraphicType(state);
  const iconSymbolSize = (state.iconSymbolSize as EgSymbolSize | undefined) ?? 'md';
  const primaryWeight = readDataListPrimaryWeight(state);
  const subBoldSegment = readDataListSubBoldSegment(state);
  const descriptionEnabled = state.descriptionEnabled === true;
  const widgetFlags = readDataListWidgetFlags(state);

  const onPress = interactive ? () => undefined : undefined;
  const onLongPress = interactive ? () => undefined : undefined;
  const onForcePress = forceTouchEnabled && interactive ? () => undefined : undefined;

  const descriptionStyle = [
    edsTokenFont('body-small', '400'),
    { color: colors['text-base-secondary'] as string },
  ];

  const primaryLabel = index === 0 ? '1.28 BTC' : `列表项 ${index + 1}`;
  const subSegmentA = '待确认';
  const subSegmentB =
    index === 0
      ? '：对方地址 0x1234…5678 已在链上广播，预计 10 分钟内完成确认，请耐心等待。'
      : ' · 预计 10 分钟';

  return (
    <EgDataListRow
      axis={graphicEnabled ? 'row' : 'column'}
      accessibilityLabel={`数据行 ${index + 1}`}
      onPress={onPress}
      interactive={interactive}
      mode={mode}
      pressIntensity={pressIntensity}
      forceTouchEnabled={forceTouchEnabled}
      onLongPress={onLongPress}
      onForcePress={onForcePress}
    >
      <DataListGraphicSlot
        graphicEnabled={graphicEnabled}
        graphicSize={graphicSize}
        graphicType={graphicType}
        iconSymbolSize={iconSymbolSize}
        mode={mode}
        colors={colors}
      />
      <View style={{ flex: 1, minWidth: 0, gap: layout.titleSubGap }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing['spacing-2'] as number }}>
          <EgDataListPrimaryText
            weight={primaryWeight}
            mode={mode}
            numberOfLines={1}
            style={{ flex: 1, minWidth: 0 }}
          >
            {primaryLabel}
          </EgDataListPrimaryText>
          <DataListPrimaryRowWidgets flags={widgetFlags} mode={mode} colors={colors} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing['spacing-2'] as number }}>
          <EgDataListSubText
            mode={mode}
            segmentA={subSegmentA}
            segmentB={subSegmentB}
            boldSegmentA={subBoldSegment}
            style={{ flex: 1, minWidth: 0 }}
            numberOfLines={EG_DATA_LIST_SUB_TEXT_MAX_LINES}
            ellipsizeMode="tail"
          />
          {widgetFlags.showMessage || widgetFlags.showRedDot ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing['spacing-2'] as number }}>
              {widgetFlags.showMessage ? (
                <EgDataListMessage mode={mode} label="9" accessibilityLabel="未读计数" />
              ) : null}
              {widgetFlags.showRedDot ? <EgDataListReddot mode={mode} accessibilityLabel="未读" /> : null}
            </View>
          ) : null}
        </View>
        {descriptionEnabled ? (
          <ShowcaseSansText style={descriptionStyle}>2026-03-12 14:20</ShowcaseSansText>
        ) : null}
      </View>
    </EgDataListRow>
  );
}

/** EgDataList 详情 · Scene inset + DL-bleed + 插槽行预览。 */
export function ShowcaseEgDataListPreview(props: ShowcaseEgDataListPreviewProps) {
  const colors = useShowcaseColors();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = Math.max(0, windowWidth - STAGE_HORIZONTAL_CHROME);
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const rowCount = readDataListRowCount(props);
  const interactive = props.interactive !== false;
  const pressIntensity = (props.pressIntensity as DataListPressIntensity | undefined) ?? 'xs';
  const forceTouchEnabled = props.forceTouchEnabled === true;
  const testID = props.testID as string | undefined;

  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }, (_, index) => (
        <DataListDemoRow
          key={index}
          index={index}
          state={props}
          interactive={interactive}
          pressIntensity={pressIntensity}
          forceTouchEnabled={forceTouchEnabled}
          mode={mode}
          colors={colors}
        />
      )),
    [colors, forceTouchEnabled, interactive, mode, pressIntensity, props, rowCount],
  );

  return (
    <View style={[styles.rail, { width: railWidth }]} testID={testID}>
      <EgDataList sceneContentInset={EG_DATA_LIST_SCENE_CONTENT_INSET}>{rows}</EgDataList>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    alignSelf: 'stretch',
    overflow: 'visible',
  },
});