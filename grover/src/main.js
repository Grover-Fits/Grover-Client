import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'

Vue.config.productionTip = false
export const eventBus = new Vue();

Vue.use(VueMaterial)
new Vue({
  render: h => h(App),
}).$mount('#app')
