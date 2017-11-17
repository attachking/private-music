// 启用插件 babel-plugin-transform-runtime 后，Babel 就会使用 babel-runtime 下的工具函数
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import components from './components'
import './common/styles/index.less'
import VueLazyLoad from 'vue-lazyload'
import fastclick from 'fastclick'
import store from './store'
import directive from './common/js/directive'

fastclick.attach(document.body)

Vue.use(components)
Vue.use(directive)
Vue.use(VueLazyLoad, {
  loading: require('./assets/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
