<template>
  <div class="inventory-container">
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <el-row>
            <el-col :span="24">
              <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
            </el-col>
          </el-row>
        </div>
        <el-table v-loading.body="loading" :data="tableData" border>
          <el-table-column prop="bloodSourceCode" label="血源编码"></el-table-column>
          <el-table-column prop="varietiesCode" label="品种编码"></el-table-column>
          <el-table-column prop="bloodTypeCode" label="血型编码"></el-table-column>
          <el-table-column prop="validityCode" label="效期编码"></el-table-column>
          <el-table-column prop="bloodTypesName" label="血液品种"></el-table-column>
          <el-table-column width="90" label="血型">
            <template slot-scope="scope">{{scope.row.aboName + scope.row.rhName}}</template>
          </el-table-column>
          <el-table-column width="100" prop="bloodVolume" label="血量">
            <template slot-scope="scope">{{scope.row.bloodVolume + scope.row.unitName}}</template>
          </el-table-column>
          <el-table-column width="150" label="采血日期">
            <template slot-scope="scope">
              <span
                v-if="scope.row.drawBloodDate"
              >{{scope.row.drawBloodDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="失效日期">
            <template slot-scope="scope">
              <span
                v-if="scope.row.bloodExpirationStatus === 0"
              >{{scope.row.bloodExpirationDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
              <span
                v-if="scope.row.bloodExpirationStatus === 1"
                class="near-effect"
              >{{scope.row.bloodExpirationDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
              <span
                v-if="scope.row.bloodExpirationStatus === 2"
                class="lose-effect"
              >{{scope.row.bloodExpirationDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column :width="editing ? '180' : '120'" label="采购价(元)">
            <template slot-scope="scope">
              <span v-if="scope.row.edit">
                <el-input
                  :class="flagThisPriceEdit ? '' : 'price_error'"
                  style="width: 100px; margin-bottom: 5px"
                  type="number"
                  min="0"
                  v-model="thisPriceEdit"
                ></el-input>
                <el-input
                  :class="flagEditDescription ? '' : 'price_error'"
                  placeholder="调整采购价原因"
                  v-model="editDescription"
                ></el-input>
              </span>
              <span v-else>{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" prop="bloodDonor" label="献血者姓名"></el-table-column>
          <el-table-column width="170" prop="bloodDonorId" label="献血者身份证号"></el-table-column>
          <el-table-column :width="editing ? '180' : '90'" fixed="right" label="操作">
            <template slot-scope="scope">
              <div v-if="scope.row.edit">
                <el-button type="primary" size="small" @click="thisSaveFn(scope.row)">保存</el-button>
                <el-button size="small" @click="cancelEdit(scope.row)">取消</el-button>
              </div>
              <div v-else>
                <!-- <el-button size="small" @click="thisLogs(scope.row)">调价记录</el-button> -->
                <el-button type="primary" size="small" @click="thisEditFn(scope.row)">调价</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pagesize="pagesize"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-row>
      </div>
    </div>
    <!-- 调价记录 -->
    <edit-price-logs
      :visible.sync="visibleDialog"
      :infoObject="thisLogsDataInfo"
      :recordData="logsData"
    ></edit-price-logs>
  </div>
</template>
<script>
import api from '../store/inventoryapi'
// import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import list from '@/util/list'
// import {debounce} from '@/util/common'
import bloodConfig from '../util/bloodconfig'
import editPriceLogs from '../components/editpricelogs'
import getstorage from '@/warehouse/page/storages/util/getstorage'

let querySchema = [
  {
    name: 'applicationTypes',
    label: '血液品种',
    placeholder: '请选择血液品种',
    options: [],
    clearable: true,
    type: 'select'
  },
  {
    name: 'bloodSourceCode',
    label: '血源编码'
  },
  {
    name: 'applicationABO',
    label: 'ABO血型',
    type: 'select',
    clearable: true,
    options: []
  },
  {
    name: 'applicationRH',
    label: 'Rh(D)',
    type: 'select',
    clearable: true,
    options: []
  },
  {
    name: 'bloodExpirationStatus',
    label: '状态',
    type: 'select',
    clearable: true,
    options: [
      {
        id: 3,
        name: '全部',
        value: ''
      },
      {
        id: 0,
        name: '正常',
        value: 0
      },
      {
        id: 1,
        name: '临期',
        value: 1
      }
    ]
  },
  {
    startName: 'bloodExpirationDateStartTime',
    endName: 'bloodExpirationDateEndTime',
    name: 'attr_5',
    type: 'daterange',
    dateType: 'daterange',
    label: '失效日期',
    format: 'YYYY-MM-DD',
    editable: false
  },
  {
    startName: 'drawBloodDateStartTime',
    endName: 'drawBloodDateEndTime',
    name: 'attr_6',
    type: 'daterange',
    dateType: 'daterange',
    label: '采血日期',
    format: 'YYYY-MM-DD',
    editable: false
  }
]

export default {
  mixins: [list, getstorage],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      querySchema,
      queryObj,
      editing: false,
      tempThisPriceEdit: '',
      flagThisPriceEdit: true,
      thisPriceEdit: '',
      flagEditDescription: true,
      editDescription: '',
      editCount: 0,
      logsData: {},
      thisLogsDataInfo: {},
      visibleDialog: false
    }
  },
  components: {
    editPriceLogs
  },
  methods: {
    thisLogs (data) {
      this.api.getBloodBankLogList({ id: data.id }).then(res => {
        if (res) this.logsData = res
        this.thisLogsDataInfo = data
        this.visibleDialog = true
      })
    },
    thisSaveFn (data) {
      if (this.tempThisPriceEdit === this.thisPriceEdit) {
        this.flagThisPriceEdit = false
        this.$notify.error({
          message: '当前采购价格未调整，请确认修改后再试。'
        })
      } else if (this.validatePrice(this.thisPriceEdit)) {
        this.flagThisPriceEdit = false
        this.$notify.error({
          message: '录入内容格式有误，请录入正数，支持保留2位小数。'
        })
      } else if (this.editDescription.length > 500) {
        this.flagEditDescription = false
        this.$notify.error({
          message: '录入原因信息过长，请简化至500字以内，便于后续记录查询。'
        })
      } else {
        let params = {
          id: data.id,
          editDescription: this.editDescription,
          price: this.thisPriceEdit
        }
        this.api.editBloodBank(params).then(res => {
          if (res) {
            this.$notify({
              type: 'success',
              message: '保存成功',
              duration: 2000
            })
            data.price = this.thisPriceEdit
            this.thisPriceEdit = ''
            this.editDescription = ''
            this.cancelEdit(data)
          }
        })
      }
    },
    cancelEdit (data) {
      let index = this.tableData.findIndex(item => {
        return item.id === data.id
      })
      this.thisPriceEdit = ''
      this.tempThisPriceEdit = ''
      this.$set(this.tableData[index], 'edit', false)
      this.flagThisPriceEdit = true
      this.flagEditDescription = true
      this.editing = false
    },
    thisEditFn (data) {
      this.tableData.forEach(item => {
        this.$set(item, 'edit', false)
      })
      let index = this.tableData.findIndex(item => {
        return item.id === data.id
      })
      this.thisPriceEdit = this.tableData[index].price
      this.tempThisPriceEdit = this.tableData[index].price // 临时保存的价格 用来校验是否修改了价格
      this.$set(this.tableData[index], 'edit', true)
      this.editing = true
    },
    validatePrice (price) { // 校验价格格式
      return Number(price) < 0 || isNaN(Number(price)) || (price && String(price).includes('.') && String(price).split('.')[1].length > 2)
    }
  },
  created () {
    this.queryObj.bloodExpirationStatus = 3
    this.queryObj.storageRoomId = this.storageId
    bloodConfig.BLOOD_TYPE().then(result => {
      this.querySchema.forEach(item => {
        if (item.name === 'applicationTypes') {
          item.options = result
        }
      })
    })
    bloodConfig.BLOOD_ABO().then(result => {
      this.querySchema.forEach(item => {
        if (item.name === 'applicationABO') {
          item.options = result
        }
      })
    })
    bloodConfig.BLOOD_RH().then(result => {
      this.querySchema.forEach(item => {
        if (item.name === 'applicationRH') {
          item.options = result
        }
      })
    })
  },
  watch: {
    'tableData' (v) {
      if (this.editCount === 1) {
        v.forEach(item => {
          item.edit = false
        })
        this.editCount = 2
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.layout_inner {
  padding: 16px 15px;
  border-radius: 0 0 4px 4px;
}
.main-head {
  margin-bottom: 6px;
}
.el-table {
  margin: 0 0 20px;
  .el-table__row {
    .lose-effect {
      color: #ff001e;
    }
    .near-effect {
      color: #ff9943;
    }
  }
}
.inventory-container /deep/ .form.ever_query_from {
  border-bottom: none !important;
  margin: 0 !important;
}
.price_error /deep/ .el-input__inner {
  border-color: #f56c6c;
}
</style>
