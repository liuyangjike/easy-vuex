import Vue from 'vue'
import Vuec from '../src/index'

Vue.use(Vuec)

export default new Vuec.Center({
  state: {
    name: 'liuyang'
  },
  mutations: {
    changeName (state) {
      state.name = 'jike'
    }
  }
})