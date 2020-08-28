<template>
  <div id="addnumberlist">
    <el-form class="query_form_wrap" :model="params">
      <el-row class="header" type="flex" :gutter="10">
        <el-col align="left" :span="4">
          <el-form-item>
            <dept-cascader
              v-model="selectDept"
              :organ-id="params.organId"
              :template-type="1"
              style="width:100%"
            ></dept-cascader>
          </el-form-item>
        </el-col>
        <el-col align="left" :span="8">
          <el-form-item>
            <el-select
              size="small"
              v-model="params.resourceId"
              placeholder="医生"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in resourceArrangeList"
                :key="i"
                :value="item.resourceId"
                :label="item.resourceName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col align="left" :span="4">
          <el-form-item>
            <el-date-picker
              size="small"
              style="width: 100%"
              v-model="params.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col align="left" :span="4">
          <el-form-item>
            <el-button type="primary" @click="querySearch()" size="small">查询</el-button>
            <el-button type @click="resetSearch" size="small">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col align="right" :span="4"></el-col>
      </el-row>
    </el-form>
    <el-table :border="false" height="270" :data="tableData" style="width: 100%">
      <el-table-column label="类型" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.registerTypeDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="66">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentStateDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="106">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="174">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.idNo ? scope.row.patient.idNo : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="病历号" width="99">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.patientOrg && scope.row.patient.patientOrg.outpatientNumber ? scope.row.patient.patientOrg.outpatientNumber : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室" width="134">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="医生" width="78">
        <template slot-scope="scope">
          <span>{{scope.row.resourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="103">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.date).format('YYYY/MM/DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时段" width="116">
        <template slot-scope="scope">
          <span>{{scope.row.startTimeStr}} - {{scope.row.endTimeStr}}</span>
        </template>
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
          :total="totalCount"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
export default {
  props: ['reset'],
  data () {
    return {
      api,
      schedulingapi,
      tableData: [],
      deptList: [],
      resourceArrangeList: [],
      currentPage: 1,
      selectDept: '',
      totalCount: 0,
      params: {
        isPlus: 1,
        deptId: '',
        resourceId: '',
        date: '',
        pagesize: 20,
        offset: 0
      }
    }
  },
  watch: {
    'params.deptId' (val) {
      if (val) {
        this.getResouceList()
      } else {
        this.params.resourceId = ''
        this.resourceArrangeList = []
      }
    },
    'selectDept' (val) {
      this.params.deptId = val.id
    },
    'params': {
      handler () {
        this.getTableData()
      },
      deep: true
    },
    'reset' () {
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.api.getNumberList(this.params).then(rs => {
        if (!rs.head.errCode) {
          this.totalCount = rs.totalCount
          this.tableData = rs.data
        }
      })
    },
    querySearch () {
      this.getTableData()
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
    },
    getResouceList () {
      this.api.getArrangeResourceList({
        timeTrunkType: 1,
        deptId: this.params.deptId,
        startDate: this.params.date || this.$moment().format('YYYY-MM-DD'),
        endDate: this.params.date || this.$moment().format('YYYY-MM-DD')
      }).then(rs => {
        this.resourceArrangeList = []
        if (rs.head.errCode || !rs.data[0]) {
          return false
        }
        rs.data.map(item => {
          this.resourceArrangeList = this.resourceArrangeList.concat(item.resourceArrangeResultList)
        })
      })
    },
    resetSearch () {
      this.selectDept = ''
      this.resourceId = ''
      this.params.date = ''
    }
  },
  components: {
    deptCascader
  }
}
</script>

<style scoped>
#addnumberlist .el-table {
  margin-top: 0;
}
#addnumberlist .el-form-item{margin-bottom: 10px;}
#addnumberlist /deep/ .el-form-item__content {line-height: 32px;}
</style>
