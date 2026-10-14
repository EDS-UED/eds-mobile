import { StyleSheet, TextInput, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseShallowBlockSurface, showcaseTheme as theme } from './showcaseTheme';

type ShowcaseSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
};

export function ShowcaseSearchBar({
  value,
  onChangeText,
  placeholder = '搜索…',
  accessibilityLabel = 'Search',
}: ShowcaseSearchBarProps) {
  const colors = useShowcaseColors();

  return (
    <View style={styles.wrap}>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        placeholderTextColor={colors['text-base-tertiary'] as string}
        style={[
          styles.input,
          {
            backgroundColor: colors['material-card-shallow'] as string,
            color: colors['text-base-primary'] as string,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.layout.pageInset,
    paddingBottom: 12,
  },
  input: {
    height: 40,
    ...theme.blockRadius,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
