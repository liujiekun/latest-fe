<template>
  <div id="query">
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <p class="title">
            {{`说明：此表是商品出入库明细表，根据不同的时间段查询后，即可生成报表，其中时间为必填项。`}}
          </p>
          <iframe v-if="biReportUrlUser" :src="biReportUrlUser" frameborder="0" style="width: 100%;positon: relative; top: 200px;height: calc(100vh - 220px)"></iframe>
        </div>
      </div>
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
      biReportUrlUser: ''
    }
  },
  created () {
    this.list()
  },
  methods: {
    list () {
      this.api.list({hisReportCode: 'thc_warehouse_material_acount_item_20180612'}).then(result => {
        if (result.head.errCode === 0) {
          let objUrl = result.data[0]
          let clinicid = this.$store.state.currentUser.organizationId
          let storageRoomId = this.storageId
          this.biReportUrlUser = objUrl.biReportUrl + `&clinicid=${clinicid}&storageRoomId=${storageRoomId}`
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-default {border: none; border-radius: 0;}
.el-table /deep/ .el-table__expanded-cell /deep/ .el-table__body-wrapper table.el-table__body .el-table__row, .el-table /deep/ .hover_rows { cursor: pointer;}
.blue:hover { text-decoration: underline;}
.el-table /deep/ .el-table__expanded-cell {padding: 0;}
.el-table /deep/ .el-table__expanded-cell /deep/ .el-table__body-wrapper table.el-table__body .el-table__row, .el-table /deep/ .bg_rows {background-color: #edf7ff;}
.el-table /deep/ .el-table__expanded-cell .el-table {margin: 0; border: none; border-top: 1px solid #eee; margin: 0;}
.el-table /deep/ .el-icon { display: none }

.title {color: #666; font-size: 14px; background-color: #f4f4f4; border-radius: 4px; padding: 20px 20px; margin: 10px 0 0;}
</style>
