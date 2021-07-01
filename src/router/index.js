import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Github from "../views/Github.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'About me!',
    component: Home
  },
  {
    path: '/ranking',
    name: 'GuanTheBot Typo Ranking',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ranking.vue')
  },
  {
    path: '/users',
    name: 'Twitch Viewer list',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue')
  },
  {
    path: '/gh*',
    name: 'Github Redirect',
    component: Github
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
