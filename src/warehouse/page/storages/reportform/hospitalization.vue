<template>
  <div class="settle_inner flex_column_full_hidden">
    <purchasing-wh :api="api" :apiName="obj.apiName" :exportType="obj.exportType"></purchasing-wh>
  </div>
</template>

<script>
import api from './purchasing/purchasingapi.js'
import purchasingWh from './purchasing/purchasingwh'
const apiName = {
  '17': {
    apiName: 'dispensemedicinedetail',
    exportType: '8',
  },
  '18': {
    apiName: 'returnmedicinecount',
    exportType: '9'
  },
  '19': {
    apiName: 'returnmedicinedetail',
    exportType: '10'
  }
}
export default {
  data () {
    return {
      obj: {
        apiName: 'dispensemedicinecount',
        exportType: '7'
      },
      api
    }
  },
  components: {
    purchasingWh
  },
  methods: {
    getRoute (status) {
      if (!status) {
        this.obj.apiName = 'dispensemedicinecount'
        this.obj.exportType = '7'
      } else {
        this.obj.apiName = apiName[status].apiName
        this.obj.exportType = apiName[status].exportType
      }
    }
  },
  created () {
    this.getRoute(this.$route.params.status)
  },
  watch: {
    '$route.params.status' (val) {
      this.getRoute(val)
    },
    deep: true,
    immediate: true
  }
}
</script>

<style lang="scss" scoped>
.settle_inner /deep/ .el-tabs__header {
  background-color: #fff;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000;
  line-height: 52px;
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
  padding: 0 20px;
  margin: 0;
}
.settle_inner /deep/ .el-tabs__header .el-tabs__nav {
  height: 50px;
}
</style>
