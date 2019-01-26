export default function applyMixin() {
  vuecInit.call(this)
}

function vuecInit () {
  const options = this.$options
  // vue的实例化是从外往内, 所以父组件的$center一定是root上的$center
  this.$center = options.parent?options.parent.$center: options.center
}