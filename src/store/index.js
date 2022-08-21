import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user.js';
import ui from './modules/ui.js';
import shop from './modules/shop.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
      user,
      ui,
      shop
    }
});
