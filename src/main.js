// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {currency} from './util/currency'
Vue.config.productionTip = false
Vue.filter("currency",currency)
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

import store from './store/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
