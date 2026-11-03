import { createApp } from 'vue'
import App from './App.vue'

// Self-hosted fonts: the neon/kanji face and the reading face.
import '@fontsource/zen-kaku-gothic-new/500.css'
import '@fontsource/zen-kaku-gothic-new/700.css'
import '@fontsource/zen-kaku-gothic-new/900.css'
import '@fontsource-variable/familjen-grotesk/wght.css'

import './assets/style.css'

createApp(App).mount('#app')
