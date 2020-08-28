<template>
  <div id="queuelist">
    <el-form class="query_form_wrap" :model="params">
      <el-row class="header" type="flex" :gutter="10">
        <el-col align="left" :span="4">
          <el-form-item>
            <dept-cascader
              size="small"
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
              multiple
              size="small"
              v-model="params.resourceIds"
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
            <el-button type="primary" @click="querySearch()" size="small">查询</el-button>
            <el-button type @click="resetSearch" size="small">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col align="right" :span="4"></el-col>
      </el-row>
    </el-form>
    <el-table :border="false" height="269" :data="tableData" style="width: 100%">
      <el-table-column label="科室" prop="deptName" align="left"></el-table-column>
      <el-table-column label="医生" prop="doctorName" align="left"></el-table-column>
      <el-table-column label="挂号" prop="aptNum" sortable align="center"></el-table-column>
      <el-table-column label="初诊" prop="firstVisit" sortable align="center"></el-table-column>
      <el-table-column label="复诊" prop="subVisit" sortable align="center"></el-table-column>
      <el-table-column label="简易" prop="simpleVisit" sortable align="center"></el-table-column>
      <el-table-column label="到诊" prop="hasArrived" sortable align="center"></el-table-column>
      <el-table-column label="候诊" prop="waitting" sortable align="center"></el-table-column>
      <el-table-column label="回诊" prop="revisiting" sortable align="center"></el-table-column>
      <el-table-column label="最近号源">
        <template slot-scope="scope">
          <label
            class="blue"
            @click="selectSourceVo(scope.row.latestResourceTimeslice)"
          >{{scope.row.latestResourceTimeslice ? scope.row.latestResourceTimeslice.startTimeStr : '--'}}</label>
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
  props: ['value', 'reset'],
  data () {
    return {
      api,
      schedulingapi,
      tableData: [],
      deptList: [],
      resourceArrangeList: [],
      currentPage: 1,
      totalCount: 0,
      selectDept: '',
      selectSource: '',
      params: {
        deptId: '',
        resourceIds: [],
        pagesize: 20,
        offset: 10
      }
    }
  },
  watch: {
    'value' (val) {
      this.selectSource = val
    },
    'selectSource' (val) {
      this.$emit('input', val)
    },
    'params.deptId' (val) {
      if (val) {
        this.getResouceList()
      } else {
        this.params.resourceIds = []
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
    'reset' (val) {
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.params.deptIds = this.params.deptId ? [this.params.deptId] : []
      this.api.getQueueList(this.params).then(rs => {
        this.tableData = rs.data
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
    selectSourceVo (val) {
      if (!val) {
        return false
      }
      this.selectSource = {
        date: this.$moment().format('YYYY-MM-DD'),
        deptId: val.deptId,
        deptName: val.deptName,
        resourceId: val.resourceId,
        resourceName: val.resourceName,
        resourceType: val.resourceType,
        serviceId: val.serviceList[0].serviceId,
        serviceName: val.serviceList[0].serviceName,
        serviceTimesliceDto: val
      }
    },
    resetSearch () {
      this.selectDept = ''
      this.params.deptIds = []
    }
  },
  components: {
    deptCascader
  }
}
</script>
<style scoped>
#queuelist .blue {
  color: #1c7bef;
  cursor: pointer;
}
#queuelist .el-table {
  margin-top: 0;
}
#queuelist .el-form-item{margin-bottom: 10px;}
#queuelist /deep/ .el-form-item__content {line-height: 32px;}
</style>
