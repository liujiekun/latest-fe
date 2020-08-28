<template>
  <div>
    <div v-if="$route.name == 'matchingwait' || $route.name == 'matchingcomplete' || $route.name == 'matchingfail'" class="output-container">
      <el-row>
        <el-col :span="24">
          <el-menu class="outputmenu">
            <el-menu-item @click="$router.push('/blood/matching/matchingwait')" :class="$route.name === 'matchingwait' ? 'is-active' : 'is-inactive'" index="matchingwait">
              待配血
            </el-menu-item>
            <el-menu-item @click="$router.push('/blood/matching/matchingcomplete')" :class="$route.name === 'matchingcomplete' ? 'is-active' : 'is-inactive'" index="matchingcomplete">
              配血完成
            </el-menu-item>
            <el-menu-item @click="$router.push('/blood/matching/matchingfail')" :class="$route.name === 'matchingfail' ? 'is-active' : 'is-inactive'" index="matchingfail">
              配血失败
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
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
.output-container {
  .outputmenu {
    background-color: #fff;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #000;
    background-color: #F4F4F4;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #ddd;
    padding: 0 15px;
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      color: #666;
      display: inline-block;
    }
    .el-menu-item:focus, .el-menu-item:hover {
      background-color: #F4F4F4;
    }
    .el-menu-item.is-active {
      color: #000;
      border-bottom: 3px solid #1c7bef;
    }
  }
}
</style>
