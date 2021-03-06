import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick';

Vue.use(iView);
fastclick.attach(document.body);
Vue.config.productionTip = false;
Vue.use(VueLazyload, {
  loading: require('./common/images/default.jpg')
})

Vue.prototype.$axios= axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
