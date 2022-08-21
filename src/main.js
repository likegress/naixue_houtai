import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import '@/assets/style/base.sass';
import { Plugin } from 'vue-fragment';
import ImageUpload from '@/components/ImageUpload.vue';

Vue.use(Plugin);
Vue.use(ElementUI, { size: 'medium', zIndex: 100 });
Vue.config.productionTip = false;

Vue.directive('p', {
  inserted(el, { value }) {
    const pass = value.some(i => store.getters.permissions.includes(i));
    if (!pass) el.parentNode.removeChild(el);
  }
});
Vue.mixin({
  methods: {
    p(permissions) {
      return permissions.some(i => store.getters.permissions.includes(i));
    }
  }
});
Vue.component('ImageUpload', ImageUpload);

axios.defaults.baseURL = '/api';
axios.defaults.timeout = 30000;
axios.interceptors.response.use(({ data }) => {
  if (data.errcode > 0) {
    Vue.prototype.$message.error(data.errmsg);
  }
  if (data.errcode === 4008 || data.errcode === 4009) {
    location.href = './#/login';
  }
  return data;
}, err => {
  return Promise.reject(err);
});
Vue.prototype.axios = axios;

if (process.env.NODE_ENV === 'development') {
  require('./mock');
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
