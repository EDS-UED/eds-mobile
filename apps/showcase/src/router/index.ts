import { createRouter, createWebHistory } from 'vue-router';
import ShowcaseLayout from '@/layout/ShowcaseLayout.vue';
import TokensView from '@/views/tokens/TokensView.vue';
import ComponentsView from '@/views/components/ComponentsView.vue';
import ComponentDetailView from '@/views/components/ComponentDetailView.vue';
import AnimationsView from '@/views/animations/AnimationsView.vue';
import AnimationDetailView from '@/views/animations/AnimationDetailView.vue';
import PatternsView from '@/views/patterns/PatternsView.vue';
import PatternDetailView from '@/views/patterns/PatternDetailView.vue';
import WorkflowsView from '@/views/workflows/WorkflowsView.vue';
import {
  defaultComponentSlug,
  isValidComponentSlug,
} from '@/data/components/navigation';
import { resolveComponentSlugRedirect } from '@/data/components/routeRedirects';
import { defaultAnimationSlug, isValidAnimationSlug } from '@/data/animations';
import { defaultPatternSlug, isValidPatternSlug } from '@/data/patterns';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ShowcaseLayout,
      children: [
        { path: '', redirect: '/tokens' },
        { path: 'tokens', name: 'tokens', component: TokensView },
        {
          path: 'animations',
          component: AnimationsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'animation-detail',
                params: { slug: defaultAnimationSlug },
              },
            },
            {
              path: ':slug',
              name: 'animation-detail',
              component: AnimationDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (typeof slug !== 'string' || !isValidAnimationSlug(slug)) {
                  return {
                    name: 'animation-detail',
                    params: { slug: defaultAnimationSlug },
                  };
                }
              },
            },
          ],
        },
        {
          path: 'components',
          component: ComponentsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'component-detail',
                params: { slug: defaultComponentSlug },
              },
            },
            {
              path: ':slug',
              name: 'component-detail',
              component: ComponentDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (typeof slug !== 'string') {
                  return {
                    name: 'component-detail',
                    params: { slug: defaultComponentSlug },
                  };
                }

                const redirect = resolveComponentSlugRedirect(slug);
                if (redirect && redirect !== slug) {
                  return { path: `/components/${redirect}`, hash: to.hash };
                }

                if (!isValidComponentSlug(slug)) {
                  return {
                    name: 'component-detail',
                    params: { slug: defaultComponentSlug },
                  };
                }
              },
            },
          ],
        },
        {
          path: 'patterns',
          component: PatternsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'pattern-detail',
                params: { slug: defaultPatternSlug },
              },
            },
            {
              path: ':slug',
              name: 'pattern-detail',
              component: PatternDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (slug === 'detail') {
                  return { path: '/components/detail' };
                }
                if (slug === 'list-fields') {
                  return {
                    name: 'pattern-detail',
                    params: { slug: 'list-field-currency' },
                  };
                }
                if (typeof slug !== 'string' || !isValidPatternSlug(slug)) {
                  return {
                    name: 'pattern-detail',
                    params: { slug: defaultPatternSlug },
                  };
                }
              },
            },
          ],
        },
        { path: 'scenes', redirect: '/patterns' },
        { path: 'scenes/:slug', redirect: (to) => `/patterns/${String(to.params.slug)}` },
        { path: 'workflows', name: 'workflows', component: WorkflowsView },
      ],
    },
  ],
});
