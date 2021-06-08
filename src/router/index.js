import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../views/recommend'
import Rank from '../views/rank'
import Singer from '../views/singer'
import Search from '../views/search'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'recommend',
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  }
]

const router = new VueRouter({
  linkActiveClass:'active',
  routes
})

export default router
