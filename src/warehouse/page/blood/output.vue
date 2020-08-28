<template>
  <div>
    <div v-if="$route.name == 'outputwait' || $route.name == 'outputcomplete' || $route.name === 'outputfail'" class="output-container">
      <el-row>
        <el-col :span="24">
          <el-menu class="outputmenu">
            <el-menu-item @click="$router.push('/blood/output/outputwait')" :class="$route.name === 'outputwait' ? 'is-active' : 'is-inactive'" index="outputwait">
              待取血
            </el-menu-item>
            <el-menu-item @click="$router.push('/blood/output/outputcomplete')" :class="$route.name === 'outputcomplete' ? 'is-active' : 'is-inactive'" index="outputcomplete">
              取血完成
            </el-menu-item>
            <el-menu-item @click="$router.push('/blood/output/outputfail')" :class="$route.name === 'outputfail' ? 'is-active' : 'is-inactive'" index="outputfail">
              取血失败
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
