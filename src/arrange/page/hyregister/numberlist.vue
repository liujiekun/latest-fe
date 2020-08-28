<template>
  <div id="numberlist">
    <el-form class="query_form_wrap" :model="params" :inline="true">
      <el-form-item>
        <div style="width:288px">
          <ever-patient-select
            size="small"
            v-model="params.patientName"
            :allow-create="true"
            :grey-denies-dialog-show="true"
            @select="selectPatient"
          ></ever-patient-select>
        </div>
      </el-form-item>
      <el-form-item>
        <dept-cascader v-model="selectDept" :organ-id="params.organId" :template-type="1"></dept-cascader>
      </el-form-item>
      <el-form-item>
        <el-select v-model="params.appointmentResourceId" filterable clearable placeholder="看诊医生" size="small">
          <el-option
            v-for="item in arrangeResource"
            :key="item.resourceId"
            :value="item.resourceId"
            :label="item.resourceName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          size="small"
          style="width:170px"
          v-model="params.appointmentDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click.native="getTableData" size="small">查询</el-button>
        <el-button type @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :border="false"
      height="270"
      ref="numberlist"
      highlight-current-row
      @row-click="handleRowChange"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column width="100" align="center" label="状态">
        <template slot-scope="scope">
          <span class="red">{{scope.row.appointmentStateDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="支付">
        <template slot-scope="scope">
          <span>{{scope.row.serviceOrder ? scope.row.serviceOrder.isPaidDesc : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="就诊号">
        <template
          slot-scope="scope"
        >{{scope.row.appointmentNum ? scope.row.appointmentNum.num : '--'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" align="left" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.name}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="性别" align="left" width="100">
        <template slot-scope="scope">
          <sys-value type="GBT.2261.1" :code="scope.row.patient && scope.row.patient.sex?scope.row.patient && scope.row.patient.sex:''"></sys-value>
          <!-- <span>{{scope.row.patient.sex === '1' ? '男' : '女'}}</span> -->
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="120" label="号别">
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件号" align="left" width="172">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.idNo ? scope.row.patient.idNo : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="病历号" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.patientOrg && scope.row.patient.patientOrg.outpatientNumber ? scope.row.patient.patientOrg.outpatientNumber : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="left" label="来源" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.sourceName ? scope.row.patient.sourceName : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="left" label="挂号方式">
        <template slot-scope="scope">
          <span>{{scope.row.registerTypeDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="科室" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="医生" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentResourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="初复诊">
        <template slot-scope="scope">
          <span>{{scope.row.subsequentVisitDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="指定">
        <template slot-scope="scope">
          <span>{{scope.row.isAppointResource ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="120" label="挂号员">
        <template slot-scope="scope">
          <span>{{scope.row.creatorUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="挂号日期" width="120">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.appointmentDate).format('YYYY/MM/DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="150" label="预约时间">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentStarttime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="150" label="签到时间">
        <template slot-scope="scope">
          <span>{{scope.row.arrivalTime ? $moment(scope.row.arrivalTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="150" label="接诊时间">
        <template slot-scope="scope">
          <span>{{scope.row.receptionTime ? $moment(scope.row.receptionTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="150" label="等待时间">
        <template slot-scope="scope">
          <span>{{scope.row.waitTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="150" label="退号时间">
        <template slot-scope="scope">
          <span>{{scope.row.cancelTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" width="120" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.serviceOrder ? scope.row.serviceOrder.totalPrice.toFixed(2) : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="left" label="爱院科室">
        <template slot-scope="scope">
          <span>{{scope.row.referrerDeptName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="left" label="爱院人">
        <template slot-scope="scope">
          <span>{{scope.row.referrerName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="200" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.symptom}}</span>
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
import serviceapi from '@/sob/store/service.panel'
import appointapi from '@/workspace/store/appointapi'
import settlementapi from '@/rcm/store/settlementapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import settingapi from '@/arrange/store/settingapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import { NUMBER_STATUS } from '@/util/common'
import { setTimeout } from 'timers'

export default {
  props: ['initPatient', 'reset'],
  data () {
    return {
      api,
      serviceapi,
      settlementapi,
      appointapi,
      schedulingapi,
      settingapi,
      showDialog: false,
      tableData: [],
      deptList: [],
      selectDept: '',
      settlementId: '',
      orderId: '',
      settlementData: {
        id: '',
        patientAge: 0,
        patientName: '',
        patientid: '',
        settlecode: '',
        doctorName: '',
        visitSn: '',
        payStatus: '',
        details: {
          settlementDetail: []
        }
      },
      currentPage: 1,
      currentRow: '',
      totalCount: 0,
      arrangeResource: [],
      params: {
        // isPlus: 0,
        patientId: '',
        patientName: '',
        appointmentResourceId: '',
        deptId: '',
        appointmentDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        pagesize: 20,
        offset: 0
      },
      stateStyle: NUMBER_STATUS
    }
  },
  watch: {
    'params.patientName' (val, old) {
      if (!val) {
        this.params.patientId = ''
      }
    },
    'initPatient' (val) {
      this.params.patientId = val.id
      this.params.patientName = val.name
      this.getTableData()
    },
    'selectDept' (val) {
      this.params.deptId = val.id
      this.params.appointmentResourceId = ''
      if (val) {
        this.getNowArrangeResource()
      } else {
        this.getArrangeResourceOnly()
      }
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
    this.getArrangeResourceOnly()
    this.$bus.$off('appoint:pay')
    this.$bus.$on('appoint:pay', val => {
      setTimeout(() => {
        this.getTableData()
      }, 3000)
    })
    this.$bus.$on('changetab', val => {
      if (val === 'ghcx' && this.currentRow) {
        this.$emit('selectNumber', Object.assign({}, this.currentRow))
      }
    })
  },
  mounted () {
    this.$refs.numberlist.setCurrentRow()
  },
  methods: {
    printFee () {
      let that = this
      let fee = 0
      for (var v in that.settlementData.payDetails) {
        if (v !== '会员卡支付') {
          fee += that.settlementData.payDetails[v]
        }
      }
      return fee.toFixed(2)
    },
    getTableData () {
      this.api.getNumberList(this.params).then(rs => {
        if (!rs.head.errCode) {
          this.totalCount = rs.totalCount
          this.tableData = rs.data
        }
      })
    },
    selectPatient (val) {
      this.params.patientId = val.id
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
    handleRowChange (val) {
      this.currentRow = val
      this.$emit('selectNumber', Object.assign({}, this.currentRow))
    },
    resetSearch () {
      this.selectDept = ''
      this.params.patientId = ''
      this.params.patientName = ''
      this.params.appointmentDate = this.$moment(new Date()).format('YYYY-MM-DD')
    },
    getNowArrangeResource () {
      this.settingapi.getNowDataResourceList({
        timeTrunkType: 1,
        deptId: this.params.deptId,
        date: this.$moment().format('YYYY-MM-DD')
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.arrangeResource = []
          return false
        }
        this.arrangeResource = rs.data
      })
    },
    getArrangeResourceOnly () {
      this.settingapi.getArrangeResourceOnly({
        timeTrunkType: 1,
        date: this.$moment().format('YYYY-MM-DD')
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.arrangeResource = []
          return false
        }
        this.arrangeResource = rs.data
      })
    }
  },
  components: {
    deptCascader
  }
}
</script>
<style scoped>
#numberlist .el-table {
  margin-top: 0;
}
#numberlist /deep/ .el-table__row {
  cursor: pointer;
}
#numberlist /deep/ .el-table__body tr.current-row > td {
  background: #1c7bef;
  color: #fff;
}
#numberlist .el-form-item{margin-bottom: 10px;}
#numberlist /deep/ .el-form-item__content {line-height: 32px;}
</style>
