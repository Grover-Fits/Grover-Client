import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'

Vue.config.productionTip = false
export const eventBus = new Vue();

Vue.use(VueMaterial)
new Vue({
  render: h => h(App),
}).$mount('#app')

// const vm = new Vue({
//   el: '#app',
//   data: {
//     results: []
//   },
//   readFile() {
//     axios.get("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=your_api_key")
//     .then(response => {this.results = response.data.results})
//   }
// });