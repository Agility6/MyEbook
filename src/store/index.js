import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getter'
import actions from './actions'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    book
  },
  getters,
  actions
})
