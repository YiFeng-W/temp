import { VueQueryPlugin } from '@tanstack/vue-query'
import { createSSRApp } from 'vue'
import uviewPlus from 'uview-plus'

import App from './App.vue'
import store from './store'
import { shareMixin } from '~/utils/share'

import 'uno.css'
import '~/styles/flex.css'

export function createApp() {
  const app = createSSRApp(App)

  app.use(uviewPlus)
  app.use(store)
  app.mixin(shareMixin)
  app.use(VueQueryPlugin)

  return {
    app,
  }
}
