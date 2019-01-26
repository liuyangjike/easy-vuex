## 介绍
采用集中式存储管理应用的所有组件的状态, 就能实现组件间数据共享

## 说明
>启动
1. `npm install`
2. `npm run serve`
> 觉得对你有帮助,请点右上角的`Star`支持一下</br>
> 推荐一下我的另一个项目“用console.log看vue源码” [点这里](https://github.com/liuyangjike/vue-console)

## 实现
逻辑图

![](https://user-gold-cdn.xitu.io/2019/1/26/168896ac58610a39?w=967&h=811&f=png&s=76966)

**从图上有两条线: `Vue.use(vuec)`, 与 `new Vuec.center(options)`**

### 第一条线`Vue.use(vuec)`安装插件
使用`Vue.use(vuec)`时, 会执行`vuec`的`install`方法,会注入参数`Vue`
所以`vuec`是这样的,
```js
// index.js
import {Center, install} from './center'
export default {Center, install}
```
 `Center`对象将实例化成`center`(下面再说),我们看看`install`方法
```js
// center.js
let Vue // 全局变量, 保存install里的Vue
export function install (_Vue) {
  if (!Vue) {
    _Vue.mixin({
      beforeCreate: applyMixin // 这里不能箭头函数, 因为箭头函数会自动绑定this
    })
  }
  Vue = _Vue
}
```
`install`在`Vue`原型的`beforeCreate`混入`applyMixin`函数, 也就是说在生成每个`Vue`组件时,在它的`beforeCreate`钩子上就会执行`applyMixin`方法

### 第二条线 `new Vuec.center(options)`实例化`Center`对象
先看看用户传入的`options`, 下面例子
```js
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
```
上面代码会生成`center`实例, 该实例上应该包括:`state`状态,`commit`方法提交变更
```js
// center.js
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
```

在执行`new Vuec.Center({..})`时,就是执行`Center`的构造函数

1. 首先执行`let center = this`, 定义`center`保存当前实例

2. 接着执行`this.mutations = options.mutations`, 在实例`center`上添加`mutations`属性, 值就是用户输入`mutations`, 
    
    按上面例子, `this.mutations`长成这样
    ```js
    this.mutations = {
        changeName (state) {
          state.name = 'jike'
        }
    }
    ```
    
3.  最后执行`observeState(center, options.state)`, 作用:让`center`实例的`state`属性指向`options.state`并且是响应式的
```js
    function observeState(center, state) { // 响应式state
      center._vm = new Vue({  // 利用Vue的响应系统,将state转化成响应式
        data: {
          $$state: state
        }
      })
    }

```
在`center`实例上添加`_vm`属性, 值是一个`Vue`实例, 在该`Vue`实例的`data`下定义了`$$state`, 它的值是`options.state`用户输入的`state`;
结合上面的这段代码
```js
// center.js
export class Center {
  ...省略
  get state () {  // 代理了this.$center.state的最终访问值
    return this._vm.$data.$$state
  }
  ...省略
}
```
所以我们在组件中访问`center.state`其实就是访问`center._vm.$data.$$state`

OK, `center`就构建好了

### 创建`Vue`组件
用户输入
```js
import Vue from 'vue'
import App from './App'
import router from './router'
import center from './center'

new Vue({
  el: '#app',
  router,
  center, // 构建好的center实例
  template: '<App/>',
  components: {App}
})
```
在`beforeCreate`生命周期时会触发上面混入的`applyMixin`函数
```js
// mixins.js
export default function applyMixin() {
  vuecInit.call(this) // 
}

function vuecInit () {
  const options = this.$options
  // vue的实例化是从外往内, 所以父组件的$center一定是options的center
  this.$center = options.parent?options.parent.$center: options.center
}
```
`applyMixin`里会执行`vuecInit.call(this)`, 这里的`this`指向当前组件的实例,

接着看`vuecInit`, 定义了`options`等于用户输入选项,因为先创建根组件, 所以根组件`this.$center`的值的引用就是我们在`new Vue({..center})`时传入的`center`实例, 下面所有组件都指向它

OK, 你就可以在组件里使用`this.$center`访问了

### commit变更

```js
// center.js
export class Center {
  ... 省略
  commit (_type, _payload) {
    this.mutations[_type](this.state, _payload)
  }
}
```
通常我们变更时: `this.$center.commit('changeName', 'jike')`, 这样的话, `this.mutations[_type]`取到用户输入对应方法, 往该方法里传入`state`以及`payload`,

举上面的例子
```js
// this.mutations[_type] , _type = 'changeName', payload= 'jike'
this.mutations = {
    changeName (state, payload) {
      state.name = payload
    }
}

```

## 说明
上面只是一个简单的状态管理, 还有很多地方没有实现: `actions`异步变更,`getters`函数,`modules`模块分割, 辅助函数`mapState..`等

## 参考
[vuex](https://github.com/vuejs/vuex)

[Vue.js技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)