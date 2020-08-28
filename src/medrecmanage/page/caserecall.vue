<template>
  <div id="carecall">
    <div class="layout_inner">
      <!-- 查询 -->
      <el-row>
        <el-col :span="24">
          <query-case @query="query"></query-case>
        </el-col>
      </el-row>
      <!-- 病历管理列表 -->
      <el-row>
        <el-col :span="24">
          <h2 class="list title">召回待审核列表</h2>
        </el-col>
        <el-col :span="24">
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column label="患者编号">
              <template slot-scope="scope">
                <span>{{scope.row.patientSn}}</span>
              </template>
            </el-table-column>
            <el-table-column label="住院病案号" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.medicalSn}}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.sex==1?'男':'女'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="年龄" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.age}}岁</span>
              </template>
            </el-table-column>
            <el-table-column label="入院时间">
              <template slot-scope="scope">
                <span>{{scope.row.admissionTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="出院时间">
              <template slot-scope="scope">
                <span>{{scope.row.dischargeTime}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="患者科室">
              <template slot-scope="scope">
                <span>{{scope.row.dptName}}</span>
              </template>
            </el-table-column>-->
            <el-table-column label="归档日期">
              <template slot-scope="scope">
                <span>{{scope.row.firstLockTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请科室">
              <template slot-scope="scope">
                <span>{{scope.row.creatorDptName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请医生">
              <template slot-scope="scope">
                <span>{{scope.row.creatorName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请日期">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="recall(scope.row)">召回审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
      <!-- 召回弹框 -->
      <dialog-recall :open="dialogVisible" :rowData="rowData" @close="close" @submit="submit"></dialog-recall>
    </div>
  </div>
</template>
<script>
import api from '@/medrecmanage/store/casemanageapi.js'
import queryCase from '@/medrecmanage/components/querycase'
import dialogRecall from '@/inpatient/page/casedialog/dialogrecall'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    return {
      api,
      tableData: [],
      dialogVisible: false,
      radio: '1',
      reason: '',
      rowData: {},
      queryObj: {}
    }
  },
  created () {
    this.searchApi()
  },
  methods: {
    searchApi () {
      this.queryObj = Object.assign({}, this.queryObj, { auditStatus: 0 })
      this.list()
    },
    close (val) {
      this.dialogVisible = val
    },
    query (val) {
      this.queryObj = val
      this.searchApi()
    },
    recall (row) {
      this.dialogVisible = true
      this.rowData = row
    },
    submit (val) {
      let params = Object.assign({}, val, { id: this.rowData.id })
      api.recordReqAuditRecall(params).then(res => {
        this.dialogVisible = false
        this.searchApi()
        console.log('申请结果', res)
      })
    }
  },
  components: {
    queryCase,
    dialogRecall
  }
}
</script>
<style lang="scss" scoped>
.title {
  border-left: 3px solid #1c7bef;
  padding-left: 15px;
  text-align: left;
  margin: 0;
  margin-bottom: 15px;
  font-size: 14px;
}
.el-table {
  margin-top: 0;
}
.start {
  color: red;
}
.layout_inner {
  min-height: 880px;
}
</style>
