import {getUser} from '../common/js/storage'
import Vue from 'vue'
import Router from 'vue-router'
import recommend from '../components/recommend/recommend.vue'
import singer from '../components/singer/singer.vue'
import singerDetail from '../components/singer-detail/singer-detail.vue'
import disc from '../components/disc/disc.vue'
import rank from '../components/rank/rank.vue'
import topList from '../components/top-list/top-list.vue'
import search from '../components/search/search.vue'
import user from '../components/user-center/user-center.vue'
import login from '../components/login/login.vue'
import userPlaylistDetail from '../components/user-playlist-detail/user-playlist-detail.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children: [
        {
          name: 'disc',
          path: ':id',
          component: disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children: [{
        path: ':id',
        name: 'singerDetail',
        component: singerDetail
      }]
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
      children: [{
        path: ':id',
        name: 'topList',
        component: topList
      }]
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      children: [
        {
          path: ':id',
          name: 'searchSingerDetail',
          component: singerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      children: [
        {
          path: ':id',
          name: 'userPlaylistDetail',
          component: userPlaylistDetail
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'user' && !getUser().id) {
    next({
      name: 'login'
    })
  } else {
    next(true)
  }
})

export default router
