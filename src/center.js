import applyMixin from './mixins'

let Vue // 全局变量, 保存install里的Vue

export function install (_Vue) {
  if (!Vue) {
    _Vue.mixin({
      beforeCreate: applyMixin // 这里不能箭头函数, 因为箭头函数会自动绑定this
    })
  }
  Vue = _Vue
}

export class Center {
  constructor (options= {}) {
    let center = this
    this.mutations = options.mutations
    observeState(center, options.state)
  }
  get state () {  // 代理了this.$center.state的最终访问值
    return this._vm.$data.$$state
  }
  commit (_type, _payload) {
    this.mutations[_type](this.state, _payload)
  }
}

function observeState(center, state) { // 响应式state
  center._vm = new Vue({
    data: {
      $$state: state
    }
  })
}