<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        :inline="true"
        class="form"
        @query="list()">
        <template slot="date">
          <ever-range-picker
            :start.sync="queryObj.applicantStartTime"
            outformat="YYYY-MM-DD HH:mm:ss"
            :defaultTime="['00:00:00', '23:59:59']"
            :end.sync="queryObj.applicantEndTime">
          </ever-range-picker>
        </template>
        <template slot="default">
          <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          <el-button size="small" @click="handlerReset">重置</el-button>
          <el-button 
            type="primary" 
            size="small" 
            style="margin-bottom: 10px;"
            @click="$router.push('/storages/business/allocationadd')" 
            class="fr">新增调拨</el-button> 
        </template>
      </ever-form2>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column width="60" align="center">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="code"
        align="center"
        label="调拨单号">
        <template slot-scope="scope">
          <span
            class="blue"
            @click="$router.push((scope.row.status === 108 ? '/storages/business/allocationadd?id=' : '/storages/business/allocationess/') + scope.row.id)"
          >{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        width="180"
        prop="toStorageRoom"
        label="收货库房"
      ></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="applicantName" label="申请人" width="120"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="申请时间" width="260">
        <template slot-scope="scope">
          {{scope.row.applicantTime || '-'}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="status" label="业务状态" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.status">{{scope.row.status | formateValueToFnt({list: FULL_STATE.allocation})}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="status" label="退返入库" width="80">
        <template slot-scope="scope">
          {{scope.row.inReturnStockStatus ? '有' : '-'}}
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
</template>

<script>
import list from '@/util/list'
import { FULL_STATE } from '@/util/common'
import setName from '@/util/setstatusname'
import api from '../store/allocationapi.js'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import storageroomApi from '@/warehouse/store/storageroomapi'

let querySchema = [
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', filterOverdueRecord: true },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '调拨单号',
    name: 'code'
  },
  {
    label: '收货库房',
    name: 'toStorageRoomId',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    name: 'date',
    label: '申请日期',
    comp: 'custom',
    style: 'width: 360px;',
    class: 'data_picker',
  },
  {
    label: '业务状态',
    name: 'status',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    label: '退返入库',
    name: 'isHaveReturn',
    comp: 'sys-select',
    style: 'width: 100px;',
    props: {
      options: [{ id: '', name: '全部' }, { id: 1, name: '有' }, { id: 0, name: '无' }]
    }
  }
]

export default {
  mixins: [list, setName, getstorage],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.applicantStartTime = ''
    queryObj.applicantEndTime = ''
    return {
      queryObj,
      FULL_STATE,
      querySchema,
      api,
      tableData: []
    }
  },
  methods: {
    handlerReset () {
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.query(this.queryObj)
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    _info () {
      storageroomApi.list().then(res => {
        if (res && res.list.length) {
          this.$ever.getFieldFromSchema(this.querySchema, 'toStorageRoomId').props.options = res.list.filter(item => item.id !== this.storageId)
        }
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'status').props.options = [{ id: '', name: '全部' }, ...FULL_STATE.allocation]
      this.querySchema[0].props.params.storageRoomId = this.storageId
    }
  },
  activated () {
    this.list()
  },
}

</script>
<style lang="less" scoped>
.form {
  /deep/ .data_picker .el-date-editor {
    width: 360px !important;
  }
}
</style>
