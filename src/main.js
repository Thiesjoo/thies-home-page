import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueRouter)


import moment from 'moment'

Vue.filter('date', function (value) {
  if (value) {
    const mom = moment(value);
    mom.locale("nl");
    return mom.format('LTS');
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
