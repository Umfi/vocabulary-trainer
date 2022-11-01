import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import messages from './lang/translations';

import { Device } from '@capacitor/device';

const getDeviceLanguage = async () => {
  const info = await Device.getLanguageCode();
  return info.value.substring(0, 2) as any;
};

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en', 
  messages,
});

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(i18n);
  
router.isReady().then(async () => {
  i18n.global.locale = await getDeviceLanguage();
  app.mount('#app');
});

function getTranslation() {
  return i18n.global;
}

export { getTranslation }