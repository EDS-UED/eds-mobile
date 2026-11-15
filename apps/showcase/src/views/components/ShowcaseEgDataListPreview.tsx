import {
  EG_DATA_LIST_SCENE_CONTENT_INSET,
  EG_DATA_LIST_SUB_TEXT_MAX_LINES,
  EgAvatar,
  EgColorTag,
  EgCryptoBtc,
  EgDataList,
  EgDataListRow,
  EgSymbol,
  EgSystemTag,
  getEgDataListRowLayout,
} from '@eds/mobile-components';
import type { EgSymbolSize } from '@eds/mobile-components';
import mobileTheme from '@eds/mobile-tokens/theme';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import {
  dataListGraphicSpacingToken,
  dataListGraphicAvatarSize,
  readDataListGraphicSize,
  readDataListGraphicType,
  readDataListPrimaryWeight,
  readDataListRowCount,
  readDataListWidgetType,
  type DataListPrimaryWeight,
} from '@/data/components/dataListCustomizeModel';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';

type ShowcaseEgDataListPreviewProps = Record<string, unknown>;

type DataListPressIntensity = 'xs' | 'sm' | 'md' | 'lg';

function primaryTypography(weight: DataListPrimaryWeight) {
  const role =
    weight === 'normal' ? 'body-medium' : weight === 'medium' ? 'body-medium-strong' : 'body-medium-heavy';
  const tokenWeight = weight === 'normal' ? '400' : weight === 'medium' ? '500' : '600';
  return edsTokenFont(role, tokenWeight);
}

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

function DataListPrimaryRowWidget({
  widgetEnabled,
  widgetType,
  mode,
  colors,
}: {
  widgetEnabled: boolean;
  widgetType: ReturnType<typeof readDataListWidgetType>;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
}) {
  if (!widgetEnabled || widgetType === 'redDot') return null;

  const secondaryStyle = [
    edsTokenFont('body-small', '400'),
    { color: colors['text-base-secondary'] as string },
  ];

  if (widgetType === 'time') {
    return <ShowcaseSansText style={secondaryStyle}>14:20</ShowcaseSansText>;
  }
  if (widgetType === 'tag') {
    return <EgColorTag size="sm" label="标签" mode={mode} />;
  }
  return (
    <ShowcaseSansText style={secondaryStyle}>详情</ShowcaseSansText>
  );
}

function DataListSubRowWidget({
  widgetEnabled,
  widgetType,
  mode,
}: {
  widgetEnabled: boolean;
  widgetType: ReturnType<typeof readDataListWidgetType>;
  mode: 'light' | 'dark';
}) {
  if (!widgetEnabled || widgetType !== 'redDot') return null;
  return (
    <EgSystemTag
      size="sm"
      status="danger"
      systemType="subtle"
      mode={mode}
      accessibilityLabel="红点"
      label="●"
    />
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
  const subBoldSegment = state.subBoldSegment === true;
  const descriptionEnabled = state.descriptionEnabled === true;
  const widgetEnabled = state.widgetEnabled === true;
  const widgetType = readDataListWidgetType(state);

  const onPress = interactive ? () => undefined : undefined;
  const onLongPress = interactive ? () => undefined : undefined;
  const onForcePress = forceTouchEnabled && interactive ? () => undefined : undefined;

  const primaryStyle = [
    primaryTypography(primaryWeight),
    { color: colors['text-base-primary'] as string, flexShrink: 1 },
  ];
  const subNormalStyle = [
    edsTokenFont('body-small', '400'),
    { color: colors['text-base-secondary'] as string },
  ];
  const subStrongStyle = [
    edsTokenFont('body-small-strong', '500'),
    { color: colors['text-base-secondary'] as string },
  ];
  const descriptionStyle = subNormalStyle;

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
          <ShowcaseSansText style={[primaryStyle, { flex: 1, minWidth: 0 }]} numberOfLines={1}>
            {primaryLabel}
          </ShowcaseSansText>
          <DataListPrimaryRowWidget
            widgetEnabled={widgetEnabled}
            widgetType={widgetType}
            mode={mode}
            colors={colors}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing['spacing-2'] as number }}>
          <ShowcaseSansText
            style={[subNormalStyle, { flex: 1, minWidth: 0 }]}
            numberOfLines={EG_DATA_LIST_SUB_TEXT_MAX_LINES}
            ellipsizeMode="tail"
          >
            {subBoldSegment ? (
              <>
                <ShowcaseSansText style={subStrongStyle}>{subSegmentA}</ShowcaseSansText>
                {subSegmentB}
              </>
            ) : (
              `${subSegmentA}${subSegmentB}`
            )}
          </ShowcaseSansText>
          <DataListSubRowWidget widgetEnabled={widgetEnabled} widgetType={widgetType} mode={mode} />
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
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const rowCount = readDataListRowCount(props);
  const interactive = props.interactive !== false;
  const pressIntensity = (props.pressIntensity as DataListPressIntensity | undefined) ?? 'xs';
  const forceTouchEnabled = props.forceTouchEnabled === true;
  const testID = props.testID as string | undefined;

  const slotState = useMemo(
    () => ({
      graphicEnabled: props.graphicEnabled,
      graphicSize: props.graphicSize,
      graphicType: props.graphicType,
      iconSymbolSize: props.iconSymbolSize,
      primaryWeight: props.primaryWeight,
      subBoldSegment: props.subBoldSegment,
      descriptionEnabled: props.descriptionEnabled,
      widgetEnabled: props.widgetEnabled,
      widgetType: props.widgetType,
    }),
    [
      props.descriptionEnabled,
      props.graphicEnabled,
      props.graphicSize,
      props.graphicType,
      props.iconSymbolSize,
      props.primaryWeight,
      props.subBoldSegment,
      props.widgetEnabled,
      props.widgetType,
    ],
  );

  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }, (_, index) => (
        <DataListDemoRow
          key={index}
          index={index}
          state={slotState}
          interactive={interactive}
          pressIntensity={pressIntensity}
          forceTouchEnabled={forceTouchEnabled}
          mode={mode}
          colors={colors}
        />
      )),
    [colors, forceTouchEnabled, interactive, mode, pressIntensity, rowCount, slotState],
  );

  return (
    <View
      style={[
        styles.scene,
        { paddingHorizontal: EG_DATA_LIST_SCENE_CONTENT_INSET, backgroundColor: colors.page as string },
      ]}
      testID={testID}
    >
      <ShowcaseSansText style={[styles.hint, { color: colors['text-base-tertiary'] as string }]}>
        外层 Scene · spacing-5 · DL-bleed · 行间距 spacing-1 · 图形↔文本 spacing-3 · 副文本最多 2 行（溢出 …）· 文本行距 spacing-05
      </ShowcaseSansText>
      <EgDataList mode={mode}>{rows}</EgDataList>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: mobileTheme.spacing['spacing-4'] as number,
  },
  hint: {
    ...edsTokenFont('footnote', '400'),
    marginBottom: mobileTheme.spacing['spacing-3'] as number,
  },
});