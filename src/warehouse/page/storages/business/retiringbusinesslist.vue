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
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="code" width="300" label="退库单号">
          <template slot-scope="scope">
            <span
              class="blue"
              @click="$router.push('/storages/business/retiringbusiness/' + scope.row.id)"
            >{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="requistionStorageRoom"
          label="申请库房"
        ></el-table-column>
        <el-table-column show-overflow-tooltip align="left" prop="toStorageRoom" label="收货库房"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createName" label="申请人"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.createDate || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="退库单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{setName(FULL_STATE.stockback, scope.row.status, true)}}</span>
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
import api from '../store/retiringapi'
import list from '@/util/list'
import setName from '@/util/setstatusname'
import { FULL_STATE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'

var querySchema = [
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
    label: '退库单号',
    name: 'code'
  }
]
export default {
  mixins: [list, setName, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      api,
      FULL_STATE,
      queryObj: obj
    }
  },
  methods: {
    handlerQuery () {
      this.query(this.queryObj)
    },
    _info () {
      this.querySchema[0].props.params.materialType = this.materialType
      this.querySchema[0].props.params.storageRoomId = this.storageId
      this.querySchema[0].showName = this.SHOWNAME
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
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
