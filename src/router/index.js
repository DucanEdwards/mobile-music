import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../views/recommend'
import Rank from '../views/rank'
import Singer from '../views/singer'
import Search from '../views/search'
import SingerDetail from '../views/singerDetail'
import Disc from '../views/disc'
import RankDetail from '../views/rankDetail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'recommend',
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    children: [
      {
        path:':id',
        name:'disc',
        component:Disc,
      }
    ]
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer,
    children:[
      {
        path: '/singer/singerDetail',
        name: 'singerDetail',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank,
    children: [
      {
        path:':id',
        name:'rankDetail',
        component:RankDetail,
      }
    ]
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
