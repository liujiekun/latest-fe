<template>
  <div class="settle_inner">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="门诊发药汇总" name="thc_warehouse_drug_out_chart"></el-tab-pane>
      <el-tab-pane label="门诊发药明细" name="thc_warehouse_drugs_dispensing_details"></el-tab-pane>
      <el-tab-pane label="门诊退药汇总" name="thc_warehouse_advice_return_drugs_price_count"></el-tab-pane>
      <el-tab-pane label="门诊退药明细" name="thc_warehouse_drugs_dispensing_return"></el-tab-pane>
    </el-tabs>
    <div class="layout_inner">
      <iframe
        v-if="loading"
        :src="biReportUrlUser"
        frameborder="0"
        style="width: 100%;positon: relative; top: 200px;height: calc(100vh - 200px)"
      ></iframe>
    </div>
  </div>
</template>

<script>
import api from '@/bi/store/reportsetapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
export default {
  mixins: [getstorage],
  data () {
    return {
      api,
      loading: false,
      activeName: 'thc_warehouse_drug_out_chart',
      biReportUrlUser: ''
    }
  },
  created () {
    // this.list()
  },
  methods: {
    handleClick () {

    },
    // list () {
    //   this.api.list({ hisReportCode: this.activeName }).then(result => {
    //     if (result.head.errCode === 0) {
    //       let objUrl = result.data[0]
    //       this.loading = true
    //       let clinicid = this.$store.state.currentUser.organizationId
    //       let storageRoomId = this.storageId
    //       this.biReportUrlUser = objUrl.biReportUrl + `&clinicid=${clinicid}&storageRoomId=${storageRoomId}&outType=25&inType=28`
    //     }
    //   })
    // }
  },
  watch: {
    'activeName' (v) {
      this.loading = false
      // this.list()
    }
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
