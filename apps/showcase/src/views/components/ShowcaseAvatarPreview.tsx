import { EgAvatar, type EgAvatarSize } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { showcaseTheme } from '@/views/shared/showcaseTheme';

type ShowcaseAvatarPreviewProps = Record<string, unknown>;

function resolveAvatarPreviewProps(state: Record<string, unknown>) {
  const props: Record<string, unknown> = {
    name: String(state.name ?? 'Nancy'),
    size: state.size ?? 'lg',
    variant: state.variant ?? 'initials',
    randomColor: Boolean(state.randomColor),
  };

  const initials = String(state.initials ?? '').trim();
  if (initials) {
    props.initials = initials;
  }

  if (!props.randomColor && state.colorIndexMode !== 'auto' && state.colorIndexMode !== undefined) {
    props.colorIndex = Number(state.colorIndexMode);
  }

  return props;
}

export function ShowcaseAvatarPreview(props: ShowcaseAvatarPreviewProps) {
  const { testID, ...rest } = props;
  const avatarProps = resolveAvatarPreviewProps(rest);

  return (
    <View style={styles.stage}>
      <EgAvatar testID={(testID as string) ?? 'avatar-body'} {...avatarProps} />
    </View>
  );
}

export function ShowcaseAvatarPreset0Preview(props: ShowcaseAvatarPreviewProps) {
  const { testID, size, ...rest } = props;
  return (
    <View style={styles.stage}>
      <EgAvatar
        testID={(testID as string) ?? 'avatar-preset-0'}
        variant="robot"
        size={(size as EgAvatarSize | undefined) ?? 'lg'}
        {...rest}
      />
    </View>
  );
}

export function ShowcaseAvatarPreset1Preview(props: ShowcaseAvatarPreviewProps) {
  const { testID, name, size, initials, ...rest } = props;
  return (
    <View style={styles.stage}>
      <EgAvatar
        testID={(testID as string) ?? 'avatar-preset-1'}
        variant="initials"
        name={String(name ?? 'Nancy')}
        initials={initials ? String(initials) : undefined}
        size={(size as EgAvatarSize | undefined) ?? 'lg'}
        {...rest}
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
