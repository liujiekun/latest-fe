<template>
  <div class="inventory-container">
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <el-row>
            <el-col :span="22">
              <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
            </el-col>
            <el-col :span="2">
              <router-link :to="'entryblood'" class="fr">
                <el-button type="primary">血液入库</el-button>
              </router-link>
            </el-col>
          </el-row>
        </div>
        <el-table v-loading.body="loading" :data="tableData">
          <el-table-column prop label="入库单号">
            <template slot-scope="scope" style="text-align:left">
              <a
                @click="$router.push(`entrybloodsee/${scope.row.id}`)"
              >{{scope.row.code}}</a>
            </template>
          </el-table-column>
          <el-table-column prop label="入库类型">
            <template slot-scope="scope">{{setName(FULL_IN_OUT_TYPE.intype, scope.row.type, true)}}</template>
          </el-table-column>
          <el-table-column prop="inStockNum" align="right" label="入库数量"></el-table-column>
          <el-table-column prop label="入库人">
            <template slot-scope="scope">{{scope.row.staffObject.name}}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="入库日期"></el-table-column>
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
  </div>
</template>
<script>
import api from '../store/entrylistapi'
import list from '@/util/list'
import setName from '@/util/setstatusname'
import { FULL_IN_OUT_TYPE, dateFormat, BLOOD_CLASSIFYID } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'

let querySchema = [
  {
    name: 'startDate',
    type: 'date',
    label: '入库开始时间',
    outformat: 'yyyy-MM-dd HH:mm:ss',
    editable: false,
    isQuery: false
  },
  {
    name: 'endDate',
    type: 'date',
    label: '入库结束时间',
    outformat: 'yyyy-MM-dd HH:mm:ss',
    editable: false
  }
]

export default {
  mixins: [list, setName, getstorage],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.materialType = BLOOD_CLASSIFYID
    return {
      api: api,
      querySchema,
      queryObj,
      FULL_IN_OUT_TYPE
    }
  },
  methods: {
  },
  created () {
    this.queryObj.storageRoomId = this.storageId
  },
  watch: {
    'queryObj.endDate' (val) {
      if (val) {
        this.queryObj.endDate = dateFormat(val, false, 'endDay')
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
}
.inventory-container /deep/ .form.ever_query_from {
  border-bottom: none !important;
  margin: 0 !important;
}
</style>
