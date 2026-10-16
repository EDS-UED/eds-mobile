import { EgSymbol, type EgSymbolSize } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

type ShowcaseSymbolPreviewProps = Record<string, unknown>;

export function ShowcaseSymbolPreview(props: ShowcaseSymbolPreviewProps) {
  const { colorTheme } = useShowcaseThemeContext();
  const {
    testID,
    name = 'eds-wallet',
    size = 'lg',
    fillTone,
    strokeColorToken,
    mode: modeProp,
  } = props;

  const mode =
    modeProp === 'light' || modeProp === 'dark' ? modeProp : colorTheme;

  return (
    <View style={styles.stage}>
      <EgSymbol
        testID={(testID as string) ?? 'symbol-body'}
        name={String(name)}
        mode={mode}
        size={size as EgSymbolSize}
        fillTone={fillTone === 'brand' ? 'brand' : fillTone === 'primary' ? 'primary' : undefined}
        strokeColorToken={
          typeof strokeColorToken === 'string' && strokeColorToken
            ? strokeColorToken
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
    width: '100%',
  },
});
