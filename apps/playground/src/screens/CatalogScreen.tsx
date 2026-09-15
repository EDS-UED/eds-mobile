import { figmaComponentCatalog, figmaComponentCount } from '@eds/mobile-components';
import { mobileTheme } from '@eds/mobile-tokens/theme';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

const colors = mobileTheme.colors.light;

export function CatalogScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return figmaComponentCatalog;
    return figmaComponentCatalog.filter(
      (entry) =>
        entry.exportName.toLowerCase().includes(q) ||
        entry.figmaName.toLowerCase().includes(q) ||
        entry.slug.includes(q) ||
        entry.family.includes(q),
    );
  }, [query]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.lead}>
          React Native preview · {figmaComponentCount} Figma components
        </Text>
        <TextInput
          accessibilityLabel="Search components"
          placeholder="Search export, slug, family…"
          placeholderTextColor={colors['text-base-tertiary'] as string}
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() =>
              navigation.navigate('ComponentPreview', {
                slug: item.slug,
                exportName: item.exportName,
                figmaName: item.figmaName,
                tier: item.tier,
                family: item.family,
              })
            }
          >
            <Text style={styles.exportName}>{item.exportName}</Text>
            <Text style={styles.meta}>
              {item.figmaName} · {item.family} · {item.slug}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.page as string,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors['stroke-divider'] as string,
  },
  lead: {
    fontSize: 13,
    color: colors['text-base-secondary'] as string,
  },
  search: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors['material-card-shallow'] as string,
    color: colors['text-base-primary'] as string,
    fontSize: 16,
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors['stroke-divider'] as string,
  },
  rowPressed: {
    backgroundColor: colors['event-tap'] as string,
  },
  exportName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['text-base-primary'] as string,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: colors['text-base-secondary'] as string,
  },
});
