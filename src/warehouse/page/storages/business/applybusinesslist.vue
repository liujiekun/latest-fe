<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          @query="list()">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          </template>
        </ever-form2>
        <!-- <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form> -->
      </div>
      <!-- <div class="main-option">
        <h4>申领单列表</h4>
      </div>-->
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column show-overflow-tooltip prop="code" align="center" label="申领单号" width="300">
          <template slot-scope="scope">
            <span
              class="blue"
              @click="$router.push('/storages/business/applybusiness/' + scope.row.id)"
            >{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="requistionStorageRoom"
          label="申领库房"
        ></el-table-column>
        <el-table-column show-overflow-tooltip align="left" prop="toStorageRoom" label="发货库房"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createName" label="申请人"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createDate" label="申请时间"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="status" label="申领单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{setName(FULL_STATE.apply, scope.row.status, true)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop label="入库状态">
          <template slot-scope="scope">
            <span
              v-if="scope.row.inStockStatus"
            >{{setName(FULL_STATE.instock, scope.row.inStockStatus, true)}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip width="80" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.inStockStatus === 11"
              size="small"
              type="primary"
              @click="$router.push('/storages/business/applybusinessadd/' + scope.row.id)"
            >复制</el-button>
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
</template>
<script>
import api from '../store/applyapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import { FULL_STATE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'

let querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', filterOverdueRecord: true },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '申领单号',
    name: 'code'
  }
]

export default {
  mixins: [list, sets, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj,
      FULL_STATE
    }
  },
  methods: {
    handlerQuery () {
      this.query(this.queryObj)
    },
    _info (refresh) {
      this.querySchema[0].props.params.materialType = this.materialType
      this.querySchema[0].props.params.storageRoomId = this.storageId
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
      if (refresh) this.queryObj.localMaterialId = ''
    }
  },
  created () {
    this._info()
  },
  watch: {
    'queryObj.code': {
      handler (v) {
        this.query(this.queryObj)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.layout_inner {
  border: none;
  border-radius: 0;
}
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>
