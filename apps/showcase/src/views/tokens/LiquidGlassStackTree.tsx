import { StyleSheet, Text, View } from 'react-native';

import type { LiquidGlassArchitecture, LiquidGlassStackNode } from '@/data/tokens/liquidGlassArchitecture';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsListRowTitleStyle, edsSpacing } from '@/views/shared/resolveEdsTheme';
import { showcaseShallowBlockSurface, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type LiquidGlassStackTreeProps = Pick<
  LiquidGlassArchitecture,
  'conceptTitle' | 'trunk' | 'stacks' | 'platformSplit'
>;

const primaryTitleStyle = edsListRowTitleStyle();

function TreeConnector() {
  const colors = useShowcaseColors();
  return (
    <View style={styles.connectorWrap}>
      <Text style={[styles.downArrow, { color: colors['text-base-tertiary'] as string }]}>↓</Text>
    </View>
  );
}

function LabeledStackCard({ node }: { node: LiquidGlassStackNode }) {
  const colors = useShowcaseColors();
  const primaryColor = colors['text-base-primary'] as string;
  const secondaryColor = colors['text-base-secondary'] as string;

  return (
    <View style={styles.cardBlock}>
      <Text style={[styles.sectionLabel, { color: secondaryColor }]}>{node.label}</Text>
      <View
        style={[
          styles.nodeCard,
          showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
        ]}
      >
        <Text style={[primaryTitleStyle, { color: primaryColor }]}>{node.primary}</Text>
        <Text style={[styles.secondary, { color: secondaryColor }]}>{node.secondary}</Text>
      </View>
    </View>
  );
}

function PlatformBranch({ node }: { node: LiquidGlassStackNode }) {
  const colors = useShowcaseColors();
  const primaryColor = colors['text-base-primary'] as string;
  const secondaryColor = colors['text-base-secondary'] as string;

  return (
    <View style={styles.branchColumn}>
      <TreeConnector />
      <Text style={[styles.branchLabel, { color: secondaryColor }]}>{node.label}</Text>
      <View
        style={[
          styles.branchCard,
          showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
        ]}
      >
        <Text style={[primaryTitleStyle, { color: primaryColor }]}>{node.primary}</Text>
        <Text style={[styles.secondary, { color: secondaryColor }]}>{node.secondary}</Text>
      </View>
    </View>
  );
}

/** 居中树桩 — Liquid Glass → 业务用法 → Token → 平台分叉（iOS 26+ 原生 · 其他系统毛玻璃）。 */
export function LiquidGlassStackTree({ conceptTitle, trunk, stacks, platformSplit }: LiquidGlassStackTreeProps) {
  const colors = useShowcaseColors();

  return (
    <View style={styles.tree}>
      <Text style={[primaryTitleStyle, styles.conceptTitle, { color: colors['text-base-primary'] as string }]}>
        {conceptTitle}
      </Text>

      <TreeConnector />

      {trunk.map((node) => (
        <View key={node.id ?? node.primary} style={styles.trunkBlock}>
          <LabeledStackCard node={node} />
          <TreeConnector />
        </View>
      ))}

      {stacks.map((node) => (
        <View key={node.id ?? node.primary}>
          <LabeledStackCard node={node} />
          <TreeConnector />
        </View>
      ))}

      <Text style={[styles.platformSectionLabel, { color: colors['text-base-secondary'] as string }]}>
        {platformSplit.label}
      </Text>
      <View style={[styles.branchFork, { borderColor: colors['stroke-base-quaternary'] as string }]}>
        <View style={[styles.branchRail, { backgroundColor: colors['stroke-base-quaternary'] as string }]} />
        <Text style={[styles.forkArrow, { color: colors['text-base-tertiary'] as string }]}>↓</Text>
      </View>

      <View style={styles.branchRow}>
        {platformSplit.branches.map((branch) => (
          <PlatformBranch key={branch.id ?? branch.label} node={branch} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tree: {
    alignItems: 'center',
    paddingHorizontal: theme.layout.pageInset,
  },
  conceptTitle: {
    textAlign: 'center',
  },
  connectorWrap: {
    alignItems: 'center',
    paddingVertical: edsSpacing('spacing-1'),
  },
  downArrow: {
    ...primaryTitleStyle,
    lineHeight: 22,
    textAlign: 'center',
  },
  trunkBlock: {
    width: '100%',
  },
  cardBlock: {
    width: '100%',
    gap: edsSpacing('spacing-2'),
    alignItems: 'center',
  },
  sectionLabel: {
    ...theme.font.sectionLabel,
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '100%',
  },
  nodeCard: {
    width: '100%',
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    gap: theme.layout.titleHintGap,
  },
  secondary: {
    ...theme.font.rowHint,
  },
  platformSectionLabel: {
    ...theme.font.sectionLabel,
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '100%',
    marginTop: edsSpacing('spacing-1'),
  },
  branchFork: {
    width: '88%',
    height: edsSpacing('spacing-3'),
    borderTopWidth: 2,
    marginTop: edsSpacing('spacing-2'),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchRail: {
    position: 'absolute',
    left: '50%',
    top: -edsSpacing('spacing-5'),
    width: 2,
    height: edsSpacing('spacing-5'),
    marginLeft: -1,
  },
  forkArrow: {
    ...primaryTitleStyle,
    position: 'absolute',
    top: -11,
    lineHeight: 22,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    gap: edsSpacing('spacing-2'),
  },
  branchColumn: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  branchLabel: {
    ...theme.font.sectionLabel,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: edsSpacing('spacing-2'),
  },
  branchCard: {
    width: '100%',
    paddingHorizontal: edsSpacing('spacing-3'),
    paddingVertical: theme.layout.cardPaddingVertical,
    gap: theme.layout.titleHintGap,
  },
});
