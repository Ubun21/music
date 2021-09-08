import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutation'
import * as getters from './getter'
import * as actions from './action'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {
  }
})
