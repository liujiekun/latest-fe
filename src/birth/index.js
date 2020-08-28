import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import doctors from '@/birth/router/doctors.js'
import nurse from '@/birth/router/nurse.js'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'
Vue.use(Router)
let router = new Router({
  routes: [...nurse, ...doctors]
})

beforeEach(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App },
  store
})
