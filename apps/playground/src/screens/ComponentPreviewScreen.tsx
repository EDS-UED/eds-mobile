import { mobileTheme } from '@eds/mobile-tokens/theme';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { resolvePreviewComponent } from '../lib/resolvePreviewComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'ComponentPreview'>;

const colors = mobileTheme.colors.light;

export function ComponentPreviewScreen({ route }: Props) {
  const { exportName, figmaName, slug, tier, family } = route.params;
  const PreviewComponent = resolvePreviewComponent(exportName);

  return (
    <View style={styles.root}>
      <View style={styles.meta}>
        <Text style={styles.metaLine}>
          {figmaName} · {tier}/{family}
        </Text>
        <Text style={styles.metaSub}>{slug}</Text>
      </View>

      <View style={styles.canvas}>
        {PreviewComponent ? (
          <PreviewComponent testID={slug} />
        ) : (
          <Text style={styles.missing}>No export registered for {exportName}</Text>
        )}
      </View>

      <Text style={styles.hint}>
        Same @eds/mobile-components module as consumer RN apps. Scaffold components render
        placeholder Views until upgraded with StyleSheet + mobileTheme.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.page as string,
  },
  meta: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors['stroke-divider'] as string,
  },
  metaLine: {
    fontSize: 14,
    color: colors['text-base-primary'] as string,
  },
  metaSub: {
    marginTop: 4,
    fontSize: 12,
    color: colors['text-base-secondary'] as string,
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missing: {
    fontSize: 14,
    color: colors['text-base-secondary'] as string,
    textAlign: 'center',
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 12,
    lineHeight: 18,
    color: colors['text-base-tertiary'] as string,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors['stroke-divider'] as string,
  },
});
