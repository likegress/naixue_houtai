import { getVal, setVal } from '@/utils/storage';

export default {
  state: {
    isMenuCollapse: getVal('isMenuCollapse', false)
  },
  getters: {
    isMenuCollapse: state => state.isMenuCollapse
  },
  mutations: {
    toggleMenu(state) {
      state.isMenuCollapse = !state.isMenuCollapse;
      setVal('isMenuCollapse', state.isMenuCollapse);
    }
  }
};
