<template>
  <div class="settle_inner flex_column_full_hidden">
    <purchasing-wh 
      v-if="$route.params.status !== '25'"
      :api="api" 
      :apiName="obj.apiName" 
      :exportType="obj.exportType">
    </purchasing-wh>
    <!-- 领用报表 -->
    <collecting-wh v-else></collecting-wh>
  </div>
</template>

<script>
import api from './purchasing/purchasingapi.js'
import purchasingWh from './purchasing/purchasingwh'
import collectingWh from '@/warehouse/page/storages/reportform/purchasing/collectingwh.vue'
const apiName = {
  '20': {
    apiName: 'stockMaterialByBatch',
    exportType: '12'
  },
  '21': {
    apiName: 'inAndOutStockGather',
    exportType: '13'
  },
  '22': {
    apiName: 'inAndOutStockFlow',
    exportType: '14'
  },
  '23': {
    apiName: 'paidButNotOutStockMaterial',
    exportType: '15'
  },
  '24': {
    apiName: 'inventory',
    exportType: '16'
  }
}
export default {
  data () {
    return {
      api,
      obj: {
        apiName: 'stockMaterial',
        exportType: '11'
      },
    }
  },
  components: {
    purchasingWh,
    collectingWh
  },
  methods: {
    getRoute (status) {
      if (!status) {
        this.obj.apiName = 'stockMaterial'
        this.obj.exportType = '11'
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
      if (val !== '25') {
        this.getRoute(val)
      }
    },
    deep: true,
    immediate: true
  }
}
</script>

<style lang="scss" scoped>
.settle_inner /deep/ .el-tabs__header {background-color: #fff; font-family: PingFangSC-Semibold; font-size: 16px; color: #000; line-height: 52px;  border-bottom: 1px solid #eee; border-radius: 4px 4px 0 0; padding: 0 20px;margin: 0;}
.settle_inner /deep/ .el-tabs__header .el-tabs__nav {height: 50px;}
</style>
