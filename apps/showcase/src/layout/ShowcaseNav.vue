<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
  buildComponentsSidebarSections,
  findComponentsSidebarFamilyId,
  findComponentsSidebarSectionId,
  type ComponentsSidebarSection,
} from './buildComponentsSidebarSections';
import { localizeComponentsSidebarSections } from './localizeComponentsSidebarSections';
import { getComponentRouteSlug } from '@/data/components/navigation';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import styles from './ShowcaseLayout.module.css';

const route = useRoute();
const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const navItems = computed(() => {
  void locale.value;
  return [
    { label: i18n.name('nav:tokens', 'Tokens'), to: '/tokens' },
    { label: i18n.name('nav:animations', 'Animations'), to: '/animations' },
    { label: i18n.name('nav:components', 'Components'), to: '/components' },
    { label: i18n.name('nav:patterns', 'Patterns'), to: '/patterns' },
    { label: i18n.name('nav:workflows', 'Workflows'), to: '/workflows' },
  ];
});

const componentsSections = computed(() => {
  void locale.value;
  return localizeComponentsSidebarSections(buildComponentsSidebarSections(), i18n);
});

const expandedSections = ref<Set<string>>(new Set());

const isComponentsRoute = computed(() => route.path.startsWith('/components'));

const activeComponentSlug = computed(() =>
  getComponentRouteSlug(route.path, route.params.slug),
);

const activeSectionId = computed(() =>
  findComponentsSidebarSectionId(activeComponentSlug.value),
);

const activeFamilyId = computed(() =>
  findComponentsSidebarFamilyId(activeComponentSlug.value),
);

function isSectionExpanded(sectionId: string) {
  return expandedSections.value.has(sectionId);
}

function setSectionExpanded(sectionId: string, expanded: boolean) {
  const next = new Set(expandedSections.value);
  if (expanded) {
    next.add(sectionId);
  } else {
    next.delete(sectionId);
  }
  expandedSections.value = next;
}

function onSectionClick(section: ComponentsSidebarSection) {
  setSectionExpanded(section.id, !isSectionExpanded(section.id));
}

function onComponentsNavClick(event: MouseEvent) {
  if (!isComponentsRoute.value) return;
  if (
    event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
  ) {
    return;
  }
  event.preventDefault();
  expandedSections.value = new Set();
}

function isFamilyActive(familyId: string) {
  return activeFamilyId.value === familyId;
}

watch(
  [isComponentsRoute, activeSectionId],
  ([onComponents, sectionId]) => {
    if (!onComponents || !sectionId) return;
    if (expandedSections.value.has(sectionId)) return;
    expandedSections.value = new Set([...expandedSections.value, sectionId]);
  },
  { immediate: true },
);
</script>

<template>
  <nav :class="styles.nav">
    <template v-for="item in navItems" :key="item.to">
      <RouterLink
        :to="item.to"
        :class="styles.navLink"
        @click="item.to === '/components' ? onComponentsNavClick($event) : undefined"
      >
        {{ item.label }}
      </RouterLink>

      <div
        v-if="item.to === '/components' && isComponentsRoute"
        :class="styles.navSubTree"
      >
        <div
          v-for="section in componentsSections"
          :key="section.id"
          :class="styles.navSubGroup"
        >
          <button
            type="button"
            :class="[
              styles.navSubToggle,
              activeSectionId === section.id && styles.navSubToggleActive,
            ]"
            :aria-expanded="isSectionExpanded(section.id)"
            @click="onSectionClick(section)"
          >
            <span
              :class="[
                styles.navSubChevron,
                isSectionExpanded(section.id) && styles.navSubChevronExpanded,
              ]"
              aria-hidden="true"
            />
            <span :class="styles.navSubLabel">{{ section.label }}</span>
          </button>

          <div
            v-if="isSectionExpanded(section.id)"
            :class="styles.navSubPanel"
          >
            <template v-if="section.groups?.length">
              <div
                v-for="group in section.groups"
                :key="group.id"
                :class="styles.navSubOrganGroup"
              >
                <span :class="styles.navSubGroupLabel">{{ group.label }}</span>
                <RouterLink
                  v-for="family in group.families"
                  :key="family.id"
                  :to="family.to"
                  :class="[
                    styles.navSubLink,
                    isFamilyActive(family.id) && styles.navSubLinkActive,
                  ]"
                >
                  {{ family.label }}
                </RouterLink>
              </div>
            </template>

            <template v-else>
              <RouterLink
                v-for="family in section.families"
                :key="family.id"
                :to="family.to"
                :class="[
                  styles.navSubLink,
                  isFamilyActive(family.id) && styles.navSubLinkActive,
                ]"
              >
                {{ family.label }}
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </template>
  </nav>
</template>
