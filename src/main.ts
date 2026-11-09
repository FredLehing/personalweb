import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import App from './App.vue'

// Self-hosted fonts: the neon/kanji face and the reading face.
import './assets/fonts/fonts.css'
import '@fontsource-variable/familjen-grotesk/wght.css'

import './assets/style.css'

createApp(App).mount('#app')

inject()
