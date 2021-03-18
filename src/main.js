import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Filters from '@/plugins/filters'
import store from './store'
import Buefy from 'buefy'

import './styles/main.sass'

Vue.use(Filters)

Vue.use(Buefy, {
  defaultContainerElement: '#app'
  // , defaultIconComponent: 'vue-fontawesome'
  , defaultIconPack: 'fa'
})

Vue.config.productionTip = false

new Vue({
  router
  , store
  , render: h => h(App)
}).$mount('#app')
