import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import { nl } from "date-fns/locale"
import { format } from "date-fns"
// require('moment/locale/nl');


Vue.config.productionTip = false
Vue.use(VueRouter)


Vue.filter('date', function (value) {
  if (value) {
    return format(value, "HH:mm:ss", { locale: nl })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
