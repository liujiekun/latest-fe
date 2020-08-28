<template>
  <div class="phr—main-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style lang="less" scoped>
  .phr—main-container{
    margin-left: 200px;
    background: #fff;
    width: auto;
  }
</style>
