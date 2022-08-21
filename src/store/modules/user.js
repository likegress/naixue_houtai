import axios from 'axios';
import router, { authRoutes } from '../../router';
import { filterAuthRoutes } from '../../utils/permission.js';
export default {
  state: {
    user: {
      id: '',
      username: '',
      avatar: '',
      permissions: []
    },
    menus: []
  },
  getters: {
    userId: state => state.user.id,
    user: state => state.user,
    permissions: state => state.user.permissions,
    menus: state => state.menus
  },
  mutations: {
    setUser(state, v) {
      state.user = v;
    },
    setMenus(state, v) {
      state.menus = v;
    }
  },
  actions: {
    getUser({ commit }) {
      return axios.get('/who').then(data => {
        if (!data.errcode) {
          commit('setUser', data.data);
          const { routes, menus } = filterAuthRoutes(authRoutes, data.data.permissions);
          routes.forEach(r => router.addRoute(r));
          commit('setMenus', menus);
          return true;
        } else {
          return false;
        }
      });
    }
  }
}
