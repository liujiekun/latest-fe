<template>
  <div>
    <ever-bread-crumb name="资质管理" path="/warehouse/intelligences"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <el-button type="primary" @click="$router.push('/warehouse/intelligenceadd/')">新建</el-button>
        </div>
      </div>

      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column show-overflow-tooltip prop="code" label="资质编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop label="资质类型">
          <template slot-scope="scope">
            <sys-value type="THC_WH_QUALIFICATION_TYPE" :code="scope.row.intelligenceType"></sys-value>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="商家名称">
          <template slot-scope="scope">
            <span v-if="scope.row.manufacturerObject">{{scope.row.manufacturerObject.name}}</span>
            <span v-if="scope.row.supplierObject">{{scope.row.supplierObject.name}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip
          prop=""
          label="物资名称">
          <template slot-scope="scope">
            <span v-if="scope.row.localSettingObject">
              <span v-if="scope.row.localSettingObject.drugObject">{{scope.row.localSettingObject.drugObject.name}}</span>
              <span v-if="scope.row.localSettingObject.equipmentObject">{{scope.row.localSettingObject.equipmentObject.name}}</span>
              <span v-if="scope.row.localSettingObject.consumptiveMaterialObject">{{scope.row.localSettingObject.consumptiveMaterialObject.name}}</span>
            </span>
          </template>
        </el-table-column>-->
        <el-table-column show-overflow-tooltip prop label="状态">
          <template slot-scope="scope">
            <sys-value type="THC_WH_QUALIFICATION_STATUS" :code="scope.row.intelligenceState"></sys-value>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="资质范围">
          <template slot-scope="scope">
            <sys-value type="THC_WH_QUALIFICATION_SCOPE" :code="scope.row.intelligenceRange"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="enableDate"
          label="生效日期"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="disableDate"
          label="失效日期"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/warehouse/intelligence/' + scope.row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import api from '../store/intelligenceapi'
import list from '@/util/list'
import { TIMEINTERVAL } from '@/util/common'

var querySchema = [
  {
    name: 'intelligenceType',
    label: '类型',
    type: 'systype',
    code: 'THC_WH_QUALIFICATION_TYPE'
  },
  {
    name: 'intelligenceRange',
    label: '范围',
    type: 'systype',
    code: 'THC_WH_QUALIFICATION_SCOPE'
  },
  {
    name: 'intelligenceState',
    label: '状态',
    type: 'systype',
    code: 'THC_WH_QUALIFICATION_STATUS'
  },
  {
    name: 'code',
    label: '资质编码'
  },
  {
    name: 'interval',
    type: 'select',
    label: '过期时间',
    options: TIMEINTERVAL
  }
]

export default {
  mixins: [list],
  methods: {},
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      tableData: [],
      querySchema: querySchema,
      queryObj: obj
    }
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
