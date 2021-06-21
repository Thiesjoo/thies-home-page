import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ranking',
    name: 'GuanTheBot ranking',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ranking.vue')
  },

  {
    path: '/users',
    name: 'Twitch user list',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router