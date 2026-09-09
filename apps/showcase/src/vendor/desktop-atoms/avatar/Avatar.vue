<script setup lang="ts">
import { computed } from 'vue';
import styles from './Avatar.module.css';
import { AVATAR_NATIVE_PALETTE, avatarPaletteBackgroundVars } from './avatarPalette';
import { getAvatarRobotMarkup } from './avatarRobot';
import { pickAvatarColorIndex } from './pickAvatarColorIndex';
import { resolveAvatarAssetName } from './resolveAvatarAssetName';
import { resolveAvatarInitials } from './resolveAvatarInitials';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'initials' | 'robot';

const props = withDefaults(
  defineProps<{
    name?: string;
    initials?: string;
    size?: AvatarSize;
    variant?: AvatarVariant;
    /** 0–19，指定 web3 原色盘索引；未传时按 seed 稳定映射或 random。 */
    colorIndex?: number;
    /** 为 true 时每次渲染从原色盘随机取色（Showcase 演示用）。 */
    randomColor?: boolean;
    /** 原色映射 seed，默认取 name。 */
    colorSeed?: string;
    label?: string;
  }>(),
  {
    size: 'lg',
    variant: 'initials',
    randomColor: false,
  },
);

const resolvedInitials = computed(() => resolveAvatarInitials(props.name, props.initials));

const paletteIndex = computed(() =>
  pickAvatarColorIndex({
    seed: props.colorSeed ?? props.name,
    colorIndex: props.colorIndex,
    random: props.randomColor,
  }),
);

const paletteColor = computed(() => AVATAR_NATIVE_PALETTE[paletteIndex.value]!);

const assetName = computed(() =>
  resolveAvatarAssetName({
    variant: props.variant,
    name: props.name,
    colorSeed: props.colorSeed,
    colorIndex: props.colorIndex,
    randomColor: props.randomColor,
  }),
);

const initialsStyle = computed(() => avatarPaletteBackgroundVars(paletteColor.value));

const hostClass = computed(() => [styles.root, styles[props.size]]);

const ariaLabel = computed(() => {
  if (props.label) {
    return props.label;
  }

  if (props.variant === 'robot') {
    return 'Robot avatar';
  }

  return `Avatar ${resolvedInitials.value}`;
});

const robotMarkup = getAvatarRobotMarkup();
</script>

<template>
  <span
    class="eds-avatar"
    :class="[hostClass, variant === 'robot' ? styles.robotHost : styles.initialsHost]"
    :style="variant === 'initials' ? initialsStyle : undefined"
    role="img"
    :data-avatar="assetName"
    :aria-label="ariaLabel"
  >
    <span v-if="variant === 'robot'" class="eds-avatar-robot" :class="styles.robotSvgHost" v-html="robotMarkup" />
    <span v-else :class="styles.initialsPaint">
      <span :class="styles.initialsLabel">{{ resolvedInitials }}</span>
    </span>
  </span>
</template>
