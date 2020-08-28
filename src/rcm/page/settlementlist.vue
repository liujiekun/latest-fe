<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-12-04 11:05:30
 -->
<template>
  <div class="settle">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 :schema="querySchema" :span="6" v-model="queryObj" @query="query">
          <template slot="createBy">
            <everStaffSelect
              v-model="queryObj.createBy"
              :clearable="true"
              :type="'select'"
              :fields="'id'"
            ></everStaffSelect>
          </template>
          <template slot="exportbtn">
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" size="small" @click="exportFile">导出</el-button>
          </template>
          <div></div>
        </ever-form2>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column width="180" label="结算单号">
          <template slot-scope="scope">
            <a
              href="javascript:void(0)"
              @click="settlementDetail(scope.row)"
            >{{scope.row.settlecode}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="totalFee" label="费用总额" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="付费状态" prop="chargeStatus">
          <template slot-scope="scope">{{scope.row.chargeStatus | chargeStatus}}</template>
        </el-table-column>
        <el-table-column label="退费状态" prop="refundStatus">
          <template slot-scope="scope">{{scope.row.refundStatus | refundStatus}}</template>
        </el-table-column>
        <el-table-column label="结算方式" prop="settleMethod"></el-table-column>
        <el-table-column label="结算单类型" prop="returnFlag" width="100">
          <template slot-scope="scope">{{scope.row.returnFlag?'退费':'收费'}}</template>
        </el-table-column>
        <el-table-column width="200" prop="outpatientNumber" label="门诊档案号">
          <template
            slot-scope="scope"
          >{{scope.row.outpatientNumber?scope.row.outpatientNumber:scope.row.patientid}}</template>
        </el-table-column>
        <el-table-column width="90" show-overflow-tooltip prop="patientName" label="患者姓名"></el-table-column>
        <el-table-column prop="insuranceOrgCnName" label="保险机构" width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="medInsurFee" label="医保支付" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.medInsurFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="comInsuranceDirectFee" label="商保支付" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.comInsuranceDirectFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="comInsuranceDirectFee" label="大客户支付" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.majorAccountFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="totalDiscount" label="优惠金额" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.totalDiscount | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="totalPayedFee" label="自付金额" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.totalPayedFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="totalDiff" label="尾差金额" min-width="130" align="right">
          <template slot-scope="scope">{{scope.row.totalDiff | formatToFinacial(6)}}</template>
        </el-table-column>
        <el-table-column label="抹零金额" prop="wipeOff">
          <template slot-scope="scope">{{scope.row.wipeOff | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="createUser" label="收费员" show-overflow-tooltip></el-table-column>
        <el-table-column width="160" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-if="checkPrint(scope.row)"
              @click="createPrint(scope.row, 1)"
            >打印详情</el-button>
            <el-button
              type="primary"
              v-if="checkRefundPrint(scope.row)"
              @click="refundPrint(scope.row)"
            >单据打印</el-button>
            <el-button
              type="primary"
              v-if="checkPrintAgain(scope.row)"
              @click="createPrint(scope.row, 2)"
            >收据重打</el-button>
            <el-button
              type="primary"
              v-if="checkPrintPatch(scope.row)"
              @click="createPrint(scope.row, 3)"
            >收据补打</el-button>
            <el-button
              type="primary"
              v-if="showMedicalPrint(scope.row)"
              @click="medicalPrintAgain(scope.row)"
            >医保收据重打</el-button>
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
        <settlementtemprint :printinfo="printinfo" id="page1" :key="printinfo.id"></settlementtemprint>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/settlementapi'
import list from '../../util/list'
// import billselect from './settle-billselect'
import insuranceorgapi from '@/insurance/store/insuranceorgapi'
import { everprint, frPrint } from '@/util/common'
import settlementtemprint from '@/rcm/page/settlement-tem-print'
import invoice from '@/rcm/page/invoicemanage/invoice'
import commonReceiptPrinting from '@/rcm/page/outpatientSettlement/common.receipt.printing'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

let schema = [
  {
    label: '患者姓名',
    name: 'patientId',
    comp: 'ever-patient-select'
  },
  {
    name: 'outpatientNumber',
    label: '门诊档案号'
  },
  {
    name: 'settlecode',
    label: '结算单号'
  },
  {
    label: '收费员',
    name: 'createBy',
    comp: 'custom'
  },
  {
    name: 'chargeStatus',
    label: '付费状态',
    comp: 'ever-select',
    props: {
      options: [
        {
          name: '待付费',
          id: '0'
        },
        {
          name: '已付费',
          id: '1'
        }
      ]
    }
  },
  {
    name: 'refundStatus',
    label: '退费状态',
    comp: 'ever-select',
    props: {
      options: [
        {
          name: '待退费',
          id: '0'
        },
        {
          name: '已退费',
          id: '1'
        }
      ]
    }
  },
  {
    label: '结算方式',
    name: 'settleMethod',
    comp: 'ever-select',
    props: {
      options: [{
        id: '0',
        name: '自费'
      },
      {
        id: '1',
        name: '医保'
      },
      {
        id: '2',
        name: '商保'
      }]
    }
  },
  {
    label: '收费类型',
    name: 'feeType',
    comp: 'ever-select',
    props: {
      options: [{
        id: '0',
        name: '门诊'
      },
      {
        id: '1',
        name: '挂号'
      }]
    }
  },
  {
    label: '结算单类型',
    name: 'returnFlag',
    comp: 'ever-select',
    props: {
      options: [{
        id: '0',
        name: '收费'
      },
      {
        id: '1',
        name: '退费'
      }]
    }
  },
  {
    name: 'insurorgid',
    label: '保险公司',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'settleDate',
    label: '创建时间',
    comp: 'date-picker',
    props: {
      type: 'daterange',
      outformat: 'yyyy-MM-dd'
    }
  },
  {
    label: '',
    labelWidth: '15px',
    name: 'exportbtn',
    comp: 'custom'
  }
]
export default {
  mixins: [list, invoice, commonReceiptPrinting],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.settleDate = ''
    obj.treatDate = []
    return {
      querySchema: schema,
      queryObj: obj,
      dialogVisible: false,
      iframeSrcArr: [],
      printinfo: {
        patientName: '',
        outpatientNumber: '',
        clinicName: '',
        createUserCode: '',
        createTime: '',
        totalFee: '',
        comInsuranceDirectFee: '',
        payDetails: {},
        membergradecutfee: 0,
        benefitFee: 0,
        memberactcutfee: 0,
        promotionFee: 0,
        comInsurancePlanFee: 0,
        comInsuranceBenefitFee: 0,
        medInsurPubPayFee: 0,
        medInsurOwnPayFee: 0,
        mergedSettleDetail: [],
      },
      staffList: [],
      printInfo: { code: '' },
      noStoreQuery: true,
      id: '',
      isHcjk: false,
      hljybCode
    }
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    // billselect,
    settlementtemprint
  },
  methods: {
    checkRefundPrint (row) {
      return row.returnFlag && row.refundStatus && this.$hasPermission('MZ_RCM_TUI_FEI_JIE_SUAN_DAN1')
    },
    checkPrint (row) {
      return (row.settleStatus === 4 || row.settleStatus === 6) && row.requestType === 0 && row.requestType !== 4 && row.returnFlag === false
    },
    // 是否可以显示收据重打按钮
    checkPrintAgain (row) {
      return !this.isHcjk && (row.settleStatus === 4 || row.settleStatus === 6) && row.allowPrintAgain && row.requestType !== 0 && row.requestType !== 4 && row.returnFlag === false
    },
    // 是否可以显示收据补打按钮
    checkPrintPatch (row) {
      return !this.isHcjk && (row.settleStatus === 4 || row.settleStatus === 6) && row.allowPrintNew && row.requestType !== 0 && row.returnFlag === false
    },
    settlementDetail (row) {
      location.href = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${row.patientid}&visitNumber=${row.rootorderid}&showDetail=0&settlementid=${row.id}&dptId=${row.orderDept}&showlist=true`
    },
    billPrintCall (row) {
      everprint('rcm-outpatient-bill', { id: this.id, patientId: row.patientid }, { preview: true })
    },
    query () {
      this.handleCurrentChange(1)
    },
    // 支付后打印目前存在问题
    createPrint (row, btnType) {
      if (this.isHcjk) {
        this.printInfo.code = 'thc_rcm_FEIYONGQINGDAN_LNN_20181114'
        this.hcjkPrint(row.id)
        return
      }
      this.id = row.id
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.query, // 打印成功的回调
        billPrintCall: this.billPrintCall.bind(this, row), // 没有关联模版走老票据打印的回调
        code: 'rcm_dishui', // 模版code
        everPrintParams: null,
        settlementId: row.id, // settlementid
        printType: 2, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      console.log('info', info)
      this.receiptPrint(info)
    },
    // 退费单据打印
    // 退费单据打印
    refundPrint (row) {
      everprint('MZ_RCM_TUI_FEI_JIE_SUAN_DAN', { id: row.id }, { preview: true })
    },
    async hcjkPrint (id) {
      let json = await api.getCountOfHaiChuangInvoiceItem({
        settlementId: id
      })
      let arr = []
      let offsize = Math.ceil(Number(json.data) / 10)
      for (let i = 0; i < offsize; i++) {
        arr.push(i * 10)
      }
      this.printInfo.id = id
      this.iframeSrcArr = arr
      this.hcjkPrintFun()
    },
    hcjkPrintFun () {
      let toPrint = this.iframeSrcArr.shift()
      if (String(toPrint) !== 'undefined') {
        frPrint(
          this.printInfo.code,
          { id: this.printInfo.id, startIndex: toPrint },
          { preview: true }
        )
      }
    },
    exportFile () {
      var params = Object.assign({}, this.queryObj)
      if (params.settleDate && params.settleDate[0]) {
        params.settleStartDate = params.settleDate[0]
        params.settleEndDate = params.settleDate[1]
      }
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
    },
    medicalPrintAgain (row) {
      let params = {
        settlementId: row.id,
        insuranceOrgId: row.insurOrgId,
        macId: this.macId
      }
      this.api.hljMedicalPrintAgain(params).then(res => {
        this.$messageTips(this, 'success', '收据补打成功')
      }, err => {
        console.log('err', err)
      })
    },
    // 是否展示黑龙江医保重打按钮
    showMedicalPrint (row) {
      return row.insurOrgId === this.hljybCode && row.settlementType !== 2 && row.payStatus === 2 && this.$hasPermission('hlj_medical_print_again')
    }
  },
  filters: {
    chargeStatus (val) {
      return val !== undefined ? (val === 1 ? '已付费' : '待付费') : ''
    },
    refundStatus (val) {
      return val !== undefined ? (val === 1 ? '已退费' : '待退费') : ''
    }
  },
  mounted () {
    // 判断某一个打印机打印完成，启动下一个打印任务
    let _this = this
    this.isHcjk = this.$ever.getClinicConfig().clinicType === 'hcjk'
    window.addEventListener(
      'message',
      function (e) {
        if (e.data === 'printdone' && _this.isHcjk) {
          if (_this.iframeSrcArr && _this.iframeSrcArr.length) {
            _this.hcjkPrintFun()
          }
        }
      },
      false
    )
  },
  created () {
    insuranceorgapi.list({}).then(result => {
      for (var insur of result.data) {
        insur.name = insur.insuranceOrgCnName
      }
      this.$ever.getFieldFromSchema(this.querySchema, 'insurorgid').props.options =
        result.data
    })
  }
}
</script>

