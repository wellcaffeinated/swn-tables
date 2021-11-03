import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Character from '../views/Character.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/'
    , name: 'Home'
    , component: Home
  }
  , {
    path: '/character'
    , name: 'Character'
    , component: Character
  }
]

const router = new VueRouter({
  routes
})

export default router
