<template>
  <div>
    <ever-bread-crumb name="事务管理类型" path="/global/activitytypes"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
      </div>
      <div class="main-option">
        <el-button type="primary" @click="$router.push('/global/activitytypeadd/')">新建</el-button>
      </div>
      <el-table
        :data="tableData"
        border>
        <el-table-column show-overflow-tooltip
                         prop="id"
                         label="id"
                         width="55"
                         align="center">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="clinicObject.name"
                         label="所属机构">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="activityCode"
                         label="类型编码">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="activityName"
                         label="类型名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="inOutStockType"
                         label="出入库类型">
          <template slot-scope="scope">
            {{inStockType.filter(v => {
            return v.id === scope.row.inOutStockType
            })[0] && inStockType.filter(v => {
            return v.id === scope.row.inOutStockType
            })[0].name}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="enableDate"
                         label="生效日期"
                         :formatter="formatDate">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="disableDate"
                         label="失效日期"
                         :formatter="formatDate">
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop=""
                         label="操作"
                         width="150"
                         align="center">
          <template slot-scope="scope">
              <el-button
                size="small"
                @click="$router.push('/global/activitytype/' + scope.row.id)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </div>
  </div>
</template>

<script>
import api from '../store/activitytypeapi'
import list from '@/util/list'
// import sysvalue from '@/warehouse/store/sysvalueapi'

var querySchema = [
  {
    name: 'activityName',
    label: '类型名称',
    placeholder: '输入类型名'
  }
]
let inStockType = [
  {id: 0, name: '入库'},
  {id: 0, name: '出库'}
]
export default {
  mixins: [list],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      inStockType: inStockType
      // opts: []
    }
  },
  created () {
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
