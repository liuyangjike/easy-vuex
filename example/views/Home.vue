<template>
  <div>
    <h2>Home</h2>
    <div>{{$center.state.name}}</div>
    <button @click='changeState'>change</button>
    <button @click="()=> {this.$router.push('/foo')}">foo</button>
    <router-view></router-view>
  </div>
</template>


<script>
export default {
  data () {
    return {
      name: 'Home'
    }
  },
  methods: {
    changeState () {
      this.$center.commit('changeName', {a: 1})
    }
  }
}
</script>