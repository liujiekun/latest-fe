<template>
  <div class="homePage">
      <el-row>
        <el-col style="border-bottom: 1px solid #eee;">
          <monitor-blood></monitor-blood>
        </el-col>
        <el-col :span="12" style="border-right:1px solid #eee">
          <home-matching></home-matching>
        </el-col>
        <el-col :span="12">
          <home-output></home-output>
        </el-col>
      </el-row>
  </div>
</template>
<script>
// import getstorage from '@/warehouse/page/storages/util/getstorage'
// import api from '@/warehouse/page/storages/store/enterapi'
import homeMatching from './home/home-matching.vue'
import homeOutput from './home/home-output.vue'
import monitorBlood from './home/home-monitor.vue'
export default {
  // mixins: [getstorage],
  data () {
    return {
      // api,
      listParams: {storageId: this.storageId}
    }
  },
  created () {
    this.listParams.storageId = this.storageId
  },
  components: {
    monitorBlood,
    homeMatching,
    homeOutput
    // worktodayStorage,
    // validityStorage,
    // stockStorage,
    // taskStorage
  }
}
</script>
