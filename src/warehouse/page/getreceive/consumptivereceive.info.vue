<template>
  <div>
    <ever-bread-crumb name="领用" path="/goods/consumptivereceives"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div v-for="(item, index) in infoList" :key="index">
          <div class="hr" v-if="index === 1" style="margin-bottom: 20px;"></div>
          <h4>基础信息</h4>
          <ever-form2
            :schema="item.schema"
            v-model="item.obj"
            :key="index"
            class="readform form"
            :nosubmit="true">
            <template slot="status">
              <span :class="{ 'red': item.obj.status === 53 }">
                {{item.obj.status | formateValueToFnt({list: FULL_STATE.use})}}
              </span>
            </template>
            <template slot="stoukCode">
              <a class="blue cur" @click="handleOutRoute(item.obj)">{{item.obj.outStockCode}}</a>
              <span :class="{ 'red': item.obj.outStockStatus === 23 }">{{item.obj.outStockStatus | formateValueToFnt({list: FULL_STATE.outstock})}}</span>
            </template>
            <template slot="abolitionReason">
            <tooltip-info :content="item.obj.abolitionReason"></tooltip-info>
          </template>
          <!-- 备注 -->
          <template slot="description">
            <el-tooltip placement="top-start" v-if="item.obj.description">
              <div slot="content" style="max-width: 300px;">
                {{item.obj.description}}
              </div>
              <div class="ellipsis">
                {{item.obj.description}}
              </div>
            </el-tooltip>
            <span v-else>无</span>
          </template>
          </ever-form2>
          <h4>物资明细</h4>
          <el-table
            :data="item.applyItemList"
            border>
            <el-table-column label="物资名称" align="center" min-width="400">
              <template slot-scope="scope">
                <span class="fl">{{scope.row.materialName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" align="center">
              <template slot-scope="scope">
                {{scope.row.spec || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="申请数量" align="center">
              <template slot-scope="scope">
                {{scope.row.num}}{{scope.row.packagUnitName}}
              </template>
            </el-table-column>
            <el-table-column label="实际出库数量" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.outNum">{{scope.row.outNum}}{{scope.row.packagUnitName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="差异数量" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.outNum && getDifferenceNum(scope.row)">
                  {{getDifferenceNum(scope.row)}}{{scope.row.packagUnitName}}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="handleCancel(index)" v-if="['52', '53'].includes(`${item.obj.status}`)">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 取消弹窗 -->
    <canceldrug-dialog ref="cancelDrug" @change="clickCancel" :title="'确认是否取消'"></canceldrug-dialog>
    <!-- loadinng -->
    <loading-cover :loading="onloadLoading">
      <h2 slot="title">数据加载中</h2>
    </loading-cover>
  </div>
</template>

<script>
import api from './receiveapi'
import canceldrugDialog from '@/warehouse/page/purchease/component/canceldrug.vue' // 取消弹窗
import tooltipInfo from '@/warehouse/page/components/tooltip.schema.vue' // 取消原因
import loadingCover from '@/warehouse/page/components/procurement/loadingcover'
import { floatTool, FULL_STATE } from '@/util/common'

let schema = [
  {
    name: 'code',
    label: '领用单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'status',
    label: '业务状态',
    comp: 'custom',
    span: 6
  },
  {
    name: 'createBy',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createDate',
    label: '申请时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'sectionName',
    label: '领用科室',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'description',
    label: '备注',
    comp: 'custom',
    span: 6
  },
  {
    name: 'storageRoomName',
    label: '发货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'stoukCode',
    label: '出库任务单',
    comp: 'custom',
    span: 6
  }
]

const cancelSchema = {
  name: 'abolitionReason',
  label: '取消原因',
  comp: 'custom',
  span: 6
}

export default {
  data () {
    return {
      schema,
      FULL_STATE,
      floatTool,
      infoList: [],
      isCanceIndex: 0,
      onloadLoading: false,
      objId: this.$route.params.id || ''
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDifferenceNum (row) {
      return floatTool.subtract(row.num, row.outNum)
    },
    handleOutRoute ({ outStockId, outStockStatus, id }) {
      // 在手术工作站不跳转
      if (this.$route.path === '/csa/warehouseuse') return
      this.$router.push(outStockStatus === 20 ? '/goods/consumptiveoutputstorageroom/' + outStockId : '/goods/consumptiveoutputstorageroomedit/' + outStockId + '?look=' + outStockId)
    },
    clickCancel (msg) {
      const { id, code } = this.infoList[this.isCanceIndex]
      let params = {
        id,
        abolitionReason: msg,
        status: 55,
        code
      }
      api.cancle(params).then(res => {
        if (res) {
          this.getDetail()
          return this.everSuccess('取消领用单成功')
        }
      })
    },
    handleCancel (index) {
      this.isCanceIndex = index
      this.$refs.cancelDrug.open()
    },
    async getDetail () {
      this.onloadLoading = true
      let params = {
        ids: [this.objId]
      }
      this.infoList = []
      if (this.$route.query && this.$route.query.id) params.ids.push(this.$route.query.id)
      await api.getById(params).then(res => {
        if (res && res.length) {
          this.infoList = res
          this.infoList.forEach((item, index) => {
            let newSchema = JSON.parse(JSON.stringify(this.schema))
            this.$set(item, 'schema', newSchema)
            this.$set(item, 'obj', item)
            if (item.status === 55) {
              item.schema.push(cancelSchema)
            }
          })
          setTimeout(() => {
            this.onloadLoading = false
          }, 300)
        }
      })
    }
  },
  components: {
    canceldrugDialog,
    tooltipInfo,
    loadingCover
  }
}

</script>
<style lang="less" scoped>
.form /deep/ .el-form-item .el-form-item__label {
  color: #999;
}
</style>
