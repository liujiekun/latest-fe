
<template>
  <div id="source">
    <el-row :gutter="20">
      <div class="layout_inner" style="margin-left: 10px!important;margin-right: 10px!important;">
        <div class="main-head">
          <ever-query-form :schema="schema" v-model="queryObj" @query="query"></ever-query-form>
          <div class="main-option">
            <el-button type="primary" @click="getSource">导入资源</el-button>
            <router-link :to="'/crm/source/-1'">
              <el-button type="primary">新建</el-button>
            </router-link>
          </div>
        </div>
        <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
          <!-- <el-table-column
          prop="id"
          label="资源ID">
        </el-table-column>
        <el-table-column
          prop="relateId"
          label="引用ID">
          </el-table-column>-->
          <el-table-column prop="resourceTypeName" label="资源类型"></el-table-column>
          <el-table-column prop="resourceName" label="资源名称"></el-table-column>
          <el-table-column prop="id" label="部门">
            <template
              slot-scope="scope"
            >{{scope.row.resourceScopes && scope.row.resourceScopes.map(v => v.deptName).join(',')}}</template>
          </el-table-column>
          <el-table-column prop label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid && scope.row.isValid == '1'">有效</span>
              <span v-else>无效</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="$router.push('/crm/source/' + scope.row.id)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
          ></ever-pagination>
        </el-row>
      </div>
    </el-row>
    <dialogSource ref="dialogSource" @list="getList"></dialogSource>
  </div>
</template>
<script>
import api from '@/arrange/store/sourceapi'
import personapi from '@/arrange/store/personapi'
import list from '@/util/list'
import dialogSource from '@/arrange/page/source/dialog-source'

let schema = [
  {
    name: 'resourceType',
    type: 'select',
    placeholder: '请选择',
    label: '资源类型',
    options: [],
    clearable: true,
    filterable: true,
    useValue: true
  },
  {
    name: 'resourceName',
    label: '资源名称',
    clearable: false
  },
  {
    name: 'isValid',
    type: 'select',
    placeholder: '请选择',
    label: '状态',
    options: [
      { id: '1', name: '有效' },
      { id: '0', name: '无效' }
    ],
    clearable: true
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      personapi,
      schema,
      queryObj,
      activeIndex: 'source'
    }
  },
  created () {
    this.getSubResourceType()
  },
  methods: {
    getList () {
      this.list()
    },
    getSubResourceType () {
      this.api.getSubResourceType().then(rs => {
        if (rs && rs.data && rs.data.length > 0) {
          rs.data.map(v => {
            v.value = v.code
          })
          this.$ever.getFieldFromSchema(schema, 'resourceType').options = rs.data
        }
      })
    },
    getSource () {
      if (this.$refs.dialogSource) {
        this.$refs.dialogSource.onDialogOpen()
      }
    },
    handleDelete (index, val) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(v => {
        if (v !== 'confirm') {
          return
        }
        return this.api.deleteById(val.id)
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功。')
          this.list()
        } else {
          this.$messageTips(this, 'warning', '删除失败。')
        }
      })
    }
  },
  components: {
    dialogSource
  }
}
</script>
<style scoped>
.f-r {
  float: right;
}
.dataRange {
  text-align: center;
  line-height: 1.5;
  font-size: 18px;
}
.lineH {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #48576a;
  line-height: 1;
  padding: 11px 12px 11px 0;
  box-sizing: border-box;
}
.notData {
  padding: 50px;
  text-align: center;
  color: #999;
  font-weight: 100;
}
#spe_border .plus_schedule.plus {
  display: none;
  cursor: pointer;
}
#spe_border td:hover .plus_schedule {
  display: block;
}
#spe_border.el-table td,
#spe_border.el-table th.is-leaf {
  border-bottom: 1px solid #eee !important;
}
#spe_border td .el-button {
  padding: 4px 5px;
  display: inline-block;
  font-size: 14px;
  border-radius: 2px;
  margin-bottom: 10px;
  line-height: 20px;
  white-space: normal !important;
}
#spe_border td .el-button.btn-success {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
}
#spe_border .el-button.btn-success:hover {
  background: #1c7bef;
  color: #fff;
}
#spe_border td .el-button.btn-gray {
  background-color: #f3f4f5;
  color: #878d99;
  border: 1px solid #cfd1d6;
}
#spe_border .el-button.btn-gray:hover {
  background: #878d99;
  color: #fff;
}
#source .el-table .cell,
#source .el-table th > div {
  padding-top: 12px;
}
#source .el-table tr td:nth-child(1) .cell {
  padding-top: 0;
}
#source .el-table thead .cell {
  padding-top: 0;
}
#source .plus_schedule.plus {
  width: 20px;
  height: 20px;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  margin-top: -10px;
}
#spe_border tr:hover td {
  background-color: #ffffff;
}
#spe_border td:hover {
  background-color: #f8f8f8 !important;
}
#source .layout_box .layout_inner {
}
</style>
