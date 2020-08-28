<template>
  <div>
    <ever-bread-crumb name="生产厂商管理" path="/warehouse/manufacturers"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/warehouse/manufactureradd'">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column show-overflow-tooltip prop label width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" align="center" label="生产厂商名称">
          <!-- <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/warehouse/manufacturercheck/' + scope.row.id)">{{scope.row.name}}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" align="center" label="社会统一信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/warehouse/manufacturers/' + scope.row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../store/manufacturerapi'
import list from '@/util/list'
var schema = [
  {
    name: 'name',
    type: 'text',
    label: '生产厂商名称'
  },
  {
    name: 'creditCode',
    type: 'text',
    label: '社会统一信用代码'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.disableDate = ''
    obj.enableDate = ''
    return {
      schema,
      querySchema: schema,
      queryObj: obj,
      listParams: {
        intelligenceStatus: 1
      }
    }
  },
  beforeCreate () {
    this.api = api
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
