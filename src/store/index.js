import { createStore } from 'vuex'

export default createStore({
  state: {
    pageIndex: 0
  },
  mutations: {
    setPageIndex (state, index) {
      state.pageIndex = index
    }
  },
  actions: {
    setPageIndex ({ state, commit }, index) {
      commit('setPageIndex', index)
    }
  },
  modules: {
  }
})
