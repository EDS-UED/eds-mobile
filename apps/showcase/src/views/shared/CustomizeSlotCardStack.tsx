import { StyleSheet, View } from 'react-native';

import type { DocCustomizeControl } from '@/data/components';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { CustomizePanel } from '@/views/shared/CustomizePanel';

const styles = StyleSheet.create({
  stack: {
    gap: edsSpacing('spacing-3'),
  },
});

type CustomizeSlotCardStackProps = {
  cardControls: DocCustomizeControl[][];
  state: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

/** 多卡定制 · 每张 `EgItemGroup` · 卡间距 `spacing-3`（12px）。 */
export function CustomizeSlotCardStack({ cardControls, state, onChange }: CustomizeSlotCardStackProps) {
  return (
    <View style={styles.stack}>
      {cardControls.map((controls, index) => (
        <CustomizePanel
          key={`slot-card-${index}`}
          sectionDividers
          controls={controls}
          state={state}
          onChange={onChange}
        />
      ))}
    </View>
  );
}