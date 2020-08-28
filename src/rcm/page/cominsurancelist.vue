<template>
  <div class="layout_inner">
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      ref="form"
      :inline="true"
      :is-query="true"
      @query="list(true)"
    >
      <template slot="daterange">
        <ever-range-picker :start.sync="queryObj.beginDate" :end.sync="queryObj.endDate"></ever-range-picker>
      </template>
      <template slot="default">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button type="primary" size="small" @click="exportFile">导出</el-button>
      </template>
    </ever-form2>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="outpatientNumber" label="门诊档案号" min-width="130">
        <template slot-scope="scope">{{scope.row.outpatientNumber}}</template>
      </el-table-column>
      <el-table-column prop="patientName" label="患者姓名"></el-table-column>
      <el-table-column prop="patientAgeShowText" label="年龄" width="110"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="settledate" label="结算日期"></el-table-column>
      <el-table-column prop="insurOrgName" label="保险公司"></el-table-column>
      <el-table-column prop="orderDeptName" label="科室"></el-table-column>
      <el-table-column prop="totalFee" label="应收金额(原价)" align="right" min-width="130">
        <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="personFee" label="实收金额(折后价)" align="right" min-width="130">
        <template slot-scope="scope">{{scope.row.personFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="getPrintData(scope.row)"
            v-if="clinic!='zz'&&clinic!='demozz'"
          >打印</el-button>
          <el-button
            type="primary"
            @click="printpositive(scope.row)"
            v-if="clinic=='zz' || clinic=='demozz'"
          >打印1</el-button>
          <el-button
            type="primary"
            @click="printall(scope.row)"
            v-if="clinic=='zz'|| clinic=='demozz'"
          >打印2</el-button>
          <el-button type="success" @click="linktosettlementlist(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
    <div v-show="false">
      <cominsuranceprint :printObj="printObj" id="page1" class="breakable"></cominsuranceprint>
    </div>
  </div>
</template>

<script>
import api from '../store/cominsuranceapi'
import list from '../../util/list'
import cominsuranceprint from './cominsuranceprint'
import { frPrint } from '@/util/common'
import jcpjs from 'jcpjs'

let schema = [
  {
    name: 'daterange',
    label: '日期区间',
    comp: 'custom' // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
  },
  {
    name: 'patientId',
    placeholder: '输入患者姓名',
    comp: 'ever-patient-select-query',
    label: '患者姓名'
  },
  {
    name: 'outPatientNumber',
    placeholder: '输入患者门诊档案号',
    label: '门诊档案号'
  }
]
export default {
  mixins: [list],
  data () {
    var queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.beginDate = ''
    queryObj.endDate = ''
    return {
      api,
      queryObj,
      querySchema: schema,
      tableData: [],
      printObj: {},
      clinic: this.$ever.clinic
    }
  },
  components: {
    cominsuranceprint
  },
  methods: {
    printpositive (row) {
      frPrint(
        'thc_rcm.invoice_20181029',
        { id: row.patientid, date: row.settledate },
        { preview: true }
      )
    },
    printall (row) {
      frPrint(
        'thc_rcm.invoice_20181029huizong',
        { id: row.patientid, date: row.settledate },
        { preview: true }
      )
    },
    async getPrintData (row) {
      let params = {
        patientId: row.patientid,
        settleDate: row.settledate,
        dept: row.orderDept,
        insurorgid: row.insurOrgId
      }
      let data = await api.insuranceBillPrint(params)
      let feeData = await api.getAllFees(params)
      this.printObj = Object.assign({}, data, { feeData: feeData.data })
      this.$nextTick(_ => {
        var mydoc = {
          documents: document,
          settingsId: '光熙结算单打印',
          copyrights: '杰创软件拥有版权 www.jatools.com'
        }
        if (window.navigator.userAgent.indexOf('Mac OS') === -1) {
          jcpjs.getJCP().printPreview(mydoc)
        }
      })
    },
    linktosettlementlist (row) {
      this.$router.push({
        path: '/rcm/settlements',
        query: {
          q: JSON.stringify({
            settleDate: [row.settledate, row.settledate],
            patientId: row.patientid,
            dept: row.orderDept,
            insurorgid: row.insurOrgId
          })
        }
      })
    },
    exportFile () {
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      this.api.exportFile(params).then(res => {
        if (!res.data) {
          this.$messageTips(this, 'error', '未找到导出文件路径！')
        } else {
          window.open(this.$ever.fileUrl + this.$ever.filePath + res.data.fileId)
        }
      },
        err => {
          console.log('err', err)
        })
    }
  }
}
</script>
<style scoped>
.layout_box .main-head .el-form,
.main-head {
  margin-bottom: 0;
}
.el-table {
  margin-top: 0;
}
.btns {
  float: right;
}
</style>
