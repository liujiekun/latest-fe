<template>
  <div id="diagnosislist">
    <el-form class="query_form_wrap" :model="params">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item>
            <ever-patient-select v-model="patientName" :allow-create="true" :grey-denies-dialog-show="true" @select="selectPatient"></ever-patient-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <dept-cascader v-model="selectDept" :organ-id="params.organId" :template-type="1" style="width:100%"></dept-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-date-picker
              size="small"
              style="width:100%"
              v-model="params.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="querySearch" size="small">查询</el-button>
            <el-button @click="resetSearch" size="small">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :border="false"
      height="270"
      :data="tableData"
      style="width: 100%">
      <el-table-column label="主要诊断" width="440">
        <template slot-scope="scope">
          {{scope.row.data.ZHEN_DUAN && scope.row.data.ZHEN_DUAN[0] && scope.row.data.ZHEN_DUAN[0].diseaseName ? scope.row.data.ZHEN_DUAN[0].diseaseName : '--'}}
        </template>
      </el-table-column>
      <el-table-column label="诊断日期" width="160">
        <template slot-scope="scope">
          {{$moment(scope.row.createTime).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column label="科室" width="160" prop="dptName">
      </el-table-column>
      <el-table-column label="医生" width="120" prop="doctorName">
      </el-table-column>
      <el-table-column label="最近号源">
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" align="right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
export default {
  props: ['initPatient'],
  data () {
    return {
      api,
      schedulingapi,
      patient: '',
      patientName: '',
      deptList: [],
      currentPage: 1,
      totalCount: 0,
      tableData: [],
      selectDept: '',
      params: {
        patientId: '',
        deptId: '',
        date: '',
        pagesize: 20,
        offset: 0
      }
    }
  },
  watch: {
    'patient' (val) {
      if (val) {
        this.params.patientId = val.id
      } else {
        this.params.patientId = ''
        this.totalCount = 0
        this.tableData = []
      }
    },
    'patientName' (val, old) {
      if (!val) {
        this.params.patientId = ''
      }
    },
    'initPatient' (val) {
      if (val) {
        this.patient = val
        this.patientName = val.name
      } else {
        this.patient = ''
        this.patientName = ''
      }
    },
    'selectDept' (val) {
      this.params.deptId = val.id
    },
    'params': {
      handler (val) {
        this.querySearch()
      },
      deep: true
    }
  },
  methods: {
    getTableData () {
      this.api.getDiagnosisList(this.params).then(rs => {
        this.tableData = rs.data
        this.$emit('getDiagnosis', rs.data.length)
      })
    },
    selectPatient (val) {
      this.patient = val
    },
    querySearch () {
      if (this.params.patientId) {
        this.getTableData()
      } else {
        this.totalCount = 0
        this.tableData = []
      }
    },
    resetSearch () {
      this.patient = ''
      this.patientName = ''
      this.selectDept = ''
      this.params.date = ''
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getTableData()
    }
  },
  components: {
    deptCascader
  }
}
</script>

<style scoped>
  #diagnosislist .el-table{margin-top: 0;}
  #diagnosislist .el-form-item{margin-bottom: 10px;}
  #diagnosislist /deep/ .el-form-item__content {line-height: 32px;}
</style>
