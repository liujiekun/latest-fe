<template>
  <div>
    <ever-bread-crumb name="预警管理" path="/warehouse/stockamounts"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/warehouse/stockamountadd'">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column show-overflow-tooltip prop="storageRoomObject.name" label="库房名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="storageRoomObject.code" label="库房编码"></el-table-column>
        <el-table-column show-overflow-tooltip prop label="商品名称">
          <template slot-scope="scope">
            <span v-if="scope.row.drugObject">{{scope.row.drugObject.name}}</span>
            <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.name}}</span>
            <span
              v-if="scope.row.consumptiveMaterialObject"
            >{{scope.row.consumptiveMaterialObject.name}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="商品编码">
          <template slot-scope="scope">
            <span v-if="scope.row.drugObject">{{scope.row.drugObject.code}}</span>
            <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.code}}</span>
            <span
              v-if="scope.row.consumptiveMaterialObject"
            >{{scope.row.consumptiveMaterialObject.code}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="stockNum" label="现货量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="allotNum" label="预定量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reasonable" label="合理库存值"></el-table-column>
        <el-table-column show-overflow-tooltip prop="max" label="最大库存预警值"></el-table-column>
        <el-table-column show-overflow-tooltip prop="min" label="最小库存预警值"></el-table-column>
        <el-table-column show-overflow-tooltip prop="safe" label="安全值"></el-table-column>
        <el-table-column show-overflow-tooltip prop label="百分比(%)">
          <template
            slot-scope="scope"
          >{{(scope.row.stockNum / scope.row.reasonable) ? ((scope.row.stockNum / scope.row.reasonable) * 100).toFixed(2) : 0}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/warehouse/stockamounts/' + scope.row.id)"
            >编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" v-if="tableData.length">
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
import api from '../store/stockamountapi'
import list from '@/util/list'
import storageRoomApi from '../store/storageroomapi'

var querySchema = [
  {
    name: 'storageRoomId',
    label: '库房名称',
    type: 'remotemethod',
    api: storageRoomApi,
    initoptions: []
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'percent',
    label: '百分比',
    type: 'select',
    options: api.percent
  }
]

export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj: obj,
      storageRoomList: [],
      listParams: {}
    }
  },
  methods: {
  },
  created () {
    storageRoomApi.list({ isInvented: 0 }).then(result => {
      this.$ever.getFieldFromSchema(querySchema, 'storageRoomId').initoptions = result.list
      this.storageRoomList = result.list
    })
    this.$watch('queryObj.storageRoomId', (newVal, val) => {
      if (newVal) {
        let index = this.storageRoomList.findIndex(item => {
          return item.id === newVal
        })
        this.listParams.materialType = this.storageRoomList[index].materialType
      } else {
        this.listParams.materialType = ''
      }
      this.queryObj.localMaterialId = ''
    })
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
