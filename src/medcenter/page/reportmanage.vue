<template>
  <div class="layout_box">
    <div class="layout_inner">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        @query="list(true)"
        :inline="true"
        :is-query="true"
      >
        <template slot="daterange">
          <ever-range-picker
            :start.sync="queryObj.startTime"
            :end.sync="queryObj.endTime"
            :noclear="false"
            :autoWidth="false"
          ></ever-range-picker>
        </template>
        <template slot="tc">
          <el-autocomplete
            v-model="queryObj.tc"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </template>
        <!--         <template slot="patientId">
          <ever-patient-select v-model="queryObj.name" @select="(item) => {handleSelect(item)}"></ever-patient-select>
        </template>-->
      </ever-form2>
      <el-table v-loading.body="loading" highlight-current-row :data="tableData" border>
        <el-table-column show-overflow-tooltip prop="patientName" label="姓名"></el-table-column>
        <el-table-column show-overflow-tooltip label="性别" width="80">
          <template slot-scope="scope" v-if="scope.row.patientSex">
            <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.birthday | formatDateByExp('YYYY-MM-DD') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" label="手机号"></el-table-column>
        <el-table-column label="填单日期" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.singleDate | formatDateByExp('YYYY-MM-DD') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="setMealName" label="套餐名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="orgAssessStatus" label="体检科室评估状态" width="400">
          <template slot-scope="scope">
            <span v-for="(item, i) in scope.row.dptStatusVoList" :key="i">
              <template v-if="item.isPitch === 1">
                <el-checkbox checked disabled></el-checkbox>
              </template>
              <template v-else>
                <el-checkbox disabled></el-checkbox>
              </template>
              {{item.dptName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="报告状态" align="center">
          <template slot-scope="scope">{{ scope.row.report | formatReportStatus }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="报告日期" align="center">
          <template slot-scope="scope">{{ scope.row.reportTime | formatDateByExp }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="发放状态" align="center">
          <template slot-scope="scope">{{ scope.row.issue | formatSendReportStatus }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="发放日期" align="center">
          <template slot-scope="scope">{{ scope.row.issueTime | formatDateByExp }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
        <el-table-column show-overflow-tooltip label="操作" width="180" align="left" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="goExamUrl(scope.row)">总检</el-button>
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.medicalRecordId"
              @click="printReport(scope.row)"
            >打印</el-button>
            <el-button type="primary" size="small" @click="showDesc(scope.row)">备注</el-button>
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
    <el-dialog :visible.sync="dialogFlag" title="备注信息" width="500px">
      <el-form ref="form">
        <el-form-item>
          <el-input class="desc" type="textarea" v-model="remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDesc">取消</el-button>
        <el-button type="primary" @click="submitDesc">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import list from '@/util/list'
import { REPORT_STATUS, REPORT_SEND_STATUS } from '@/medcenter/store/config'
import api from '@/medcenter/store/medappointapi'
import packageapi from '@/crm/store/packageapi.js'
import { frPrint } from '@/util/common'

let querySchema = [
  {
    name: 'daterange',
    comp: 'custom'
  },
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    props: {
      placeholder: '请输入患者姓名',
      width: '140px'
    }
  },
  {
    label: '套餐名称',
    name: 'tc',
    comp: 'custom',
    props: {
      placeholder: '请选择套餐信息'
    }
  },
  {
    name: 'report',
    comp: 'select',
    props: {
      placeholder: '请选择报告状态',
      options: REPORT_STATUS
    }
  },
  {
    name: 'issue',
    comp: 'select',
    props: {
      placeholder: '请选择报告发放状态',
      options: REPORT_SEND_STATUS
    }
  }
]

export default {
  mixins: [list],
  data () {
    let start = this.$moment().startOf('isoWeek')
    let end = this.$moment(start).add(6, 'd').format('YYYY-MM-DD')
    let queryObj = this.$ever.createObjFromSchema(querySchema)

    queryObj.startTime = start.format('YYYY-MM-DD')
    queryObj.endTime = end

    return {
      loading: false,
      querySchema,
      queryObj,
      remark: '',
      dialogFlag: false,
      rules: {},
      focusId: '',
      REPORT_STATUS,
      REPORT_SEND_STATUS,
      code: 'JIAN_KANG_PING_GU_ZONG_BIAO'
    }
  },
  beforeCreate () {
    this.api = api
  },
  created () {

  },
  filters: {
    formatReportStatus (val) {
      let _res = '--'
      if (val || val === 0) {
        REPORT_STATUS.forEach(item => {
          if (Number(item.id) === val) {
            _res = item.name
          }
        })
      }
      return _res
    },
    formatSendReportStatus (val) {
      let _res = '--'
      if (val || val === 0) {
        REPORT_SEND_STATUS.forEach(item => {
          if (Number(item.id) === val) {
            _res = item.name
          }
        })
      }
      return _res
    }
  },
  methods: {
    goExamUrl (data) {
      if (data && data.dptStatusVoList && data.dptStatusVoList[0] && data.dptStatusVoList[0].dptId) {
        var _dptId = data.dptStatusVoList[0].dptId
        // demohnxd 写死科室id
        // let _dptId = '14717233-fe6a-479a-a25a-f03657722130'
        let _query = 'patientId=' + data.patientId + '&patientName=' + data.patientName + '&orderId=' + data.orderId + '&orderItemId=' + data.physicalExamItemList[0].orderItemId + '&visitSn=' + data.examineSn + '&phrAccountId=' + data.patientId + '&taskId=&dptId=' + _dptId + '&providerId=' + _dptId + '&subsequentVisit=4&examType=1'
        let _url = this.$ever.yihuIndex + '/workspace/outpatient?' + _query
        window.open(_url, '_blank')
      }
    },
    querySearchAsync (queryString, cb) {
      clearTimeout(this.time)
      this.time = null
      this.time = window.setTimeout(_ => {
        packageapi.searchAvailable({
          offset: 0,
          pagesize: 200,
          name: queryString
        }).then(res => {
          let data = this.initData(res.data.resultList)
          cb(data)
        })
      }, 300)
    },
    handleSelect (item) {
      this.queryObj.setMealId = item.address
    },
    initData (data) {
      let arr = []
      data.forEach(item => {
        arr.push({ value: item.name, address: item.id })
      })
      return arr
    },
    cancelDesc () {
      this.dialogFlag = false
    },
    printReport (obj) {
      console.log(obj, 222)
      frPrint(this.code, { id: obj.medicalRecordId })
      // 打印之后更新发报告的状态
      this.api.updateIssue({ id: obj.id }).then(rs => {
        if (rs.head.errCode === 0) {
          // this.$messageTips(this, 'success', '退费成功')
          this.list()
        }
      })
    },
    showDesc (obj) {
      this.dialogFlag = true
      this.focusId = obj.id
    },
    submitDesc () {
      api.submitSetMealDesc({
        id: this.focusId,
        remark: this.remark
      }).then(res => {
        this.$messageTips(this, 'success', '提交成功', '提示')
        this.dialogFlag = false
        this.list()
      })
    }
  }
}
</script>
<style scoped>
.desc /deep/ .el-textarea__inner {
  height: 8em;
}
</style>
