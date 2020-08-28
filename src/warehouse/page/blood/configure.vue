<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        path: this.$route.path
      }
    },
    created () {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
</style>
