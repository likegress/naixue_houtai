import axios from 'axios';

export default {
  state: {
    categoryList: [],
    categoryTagList: [],
  },
  getters: {
    categoryList: state => state.categoryList,
    categoryTagList: state => state.categoryTagList,
  },
  mutations: {
    setCategoryList(state, list) {
      state.categoryList = list;
    },
    setCategoryTagList(state, list) {
      state.categoryTagList = list;
    }
  },
  actions: {
    getCategoryList({ commit }) {
      axios.get('/category/list').then(({ data }) => {
        commit('setCategoryList', data.list);
      });
    },
    getCategoryTagList({ commit }) {
      axios.get('/category/tag/list').then(({ data }) => {
        commit('setCategoryTagList', data);
      });
    }
  }
};
