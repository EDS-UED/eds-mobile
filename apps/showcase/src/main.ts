import { createApp } from 'vue';
import { applyTheme, rescanCornerSmoothing } from '@eds/desktop-components';
import App from './App.vue';
import { router } from './router';
import { installGlobalWheelScrollContainment } from './composables/scrollContainment';
import './styles/global.css';
import './styles/mobile-motion-global.css';
import './styles/mobile-token-scope.css';
import './styles/mobile-showcase-compat.css';
import './styles/mobile-components-scope.css';

installGlobalWheelScrollContainment();

applyTheme('light');

const app = createApp(App).use(router);

app.mount('#app');

router.afterEach(() => {
  requestAnimationFrame(() => {
    rescanCornerSmoothing();
  });
});
