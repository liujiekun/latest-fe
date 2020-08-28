<template>
  <div class="dialog">
    <ever-bread-crumb name="返回" path="/adt/leaveHospita"></ever-bread-crumb>
    <common-header
      class="layout_wrap_01"
      ref="commonHeader"
      :patientId="value.patientId"
      :visitNumber="value.ipNo"
      :code="'010'"
    ></common-header>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="tabClicked">
        <el-tab-pane label="患者详情" name="first">
          <leave-details></leave-details>
        </el-tab-pane>
        <el-tab-pane label="押金管理" name="second">
          <deposit-manage ref="depositeManage" @refresh="refresh"></deposit-manage>
        </el-tab-pane>
        <el-tab-pane label="费用明细" name="third">
          <chargetab :paramsObj="value" @refresh="refresh"></chargetab>
        </el-tab-pane>
        <el-tab-pane label="住院结算单" name="fourth" class="grey">
          <iframe
            v-if="activeName=='fourth'"
            width="970px"
            height="98%"
            style="background:white;position:relative;left:calc((100vw - 970px)/2);top:1%;bottom:1%"
            :src="previewUrl()"
            frameborder="0"
          ></iframe>
        </el-tab-pane>
        <el-tab-pane
          label="住院收据"
          name="five"
          :class="{grey:!hasBillTemplate,white:hasBillTemplate}"
        >
          <template v-if="!hasBillTemplate">
            <iframe
              v-if="activeName=='five'"
              height="98%"
              width="970px"
              style="background:white;position:relative;left:calc((100vw - 970px)/2);top:1%;bottom:1%;"
              :src="previewHospitalUrl()"
              frameborder="0"
            ></iframe>
          </template>
          <template v-else>
            <div>
              <el-button
                v-if="billPrintObj.requestType === 0 && billPrintObj.requestType !== 4"
                type="primary"
                size="small"
                @click="createPrint(1)"
              >收据打印</el-button>
              <el-button
                v-if="billPrintObj.allowPrintAgain && billPrintObj.requestType !== 0 && billPrintObj.requestType !== 4"
                type="primary"
                size="small"
                @click="createPrint(2)"
              >收据重打</el-button>
              <el-button
                v-if="billPrintObj.allowPrintNew && billPrintObj.requestType !== 0"
                type="primary"
                size="small"
                @click="createPrint(3)"
              >收据补打</el-button>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import leaveDetails from '@/adt/page/leavedetails' // 出院管理患者详情
import depositManage from '@/rcm/page/hospitalization/depositmanage' // 押金管理
import chargetab from '@/rcm/page/hospitalization/chargetab' // 费用明细
import reportViewIframe from '@/bi/page/report.view.iframe' // 出院管理-住院结算单和住院收据
import commonHeader from '@/inpatient/components/common.head.js'
import { getPatientInfo, getPrintStatus } from '@/rcm/store/hospital/hospital'
import commonReceiptPrint from '@/rcm/page/outpatientSettlement/common.receipt.printing'
export default {
  mixins: [commonReceiptPrint],
  data () {
    return {
      activeName: 'first',
      value: {},
      key: 0,
      visitNumber: '',
      // 0是医保，1商保，2是自费
      checkList: [
        { name: '全自费', value: 2 },
        { name: '本地医保', value: 0 }
      ],
      hasBillTemplate: false, // 是否收据有发票模板
      billPrintObj: {},
      billCode: 'rcm_hospital_bill', // 住院票据code
      selfReceiptPrintParams: {}
    }
  },
  created () {
    this.value = this.$route.query
    this.list()
  },
  methods: {
    async list () {
      this.cardloading = true
      let params = {
        ipNo: this.$route.query.ipNo, // 病案号
        patientId: this.$route.query.patientId, // 患者id
        recalled: 0, // 非召回
        containsOutHospitalSettle: true // 押金列表中包含出院计算
      }
      try {
        let data = await getPatientInfo(params)
        if (data && Object.getOwnPropertyNames(data.data).length > 0) {
          if (!data.data.settlementId) { // 如果还没结算，刷新的时候，就不要覆盖保险类型
            delete this.value.settlementId
          }
          data.data.billSumFeeNoSettle = data.billSumFeeNoSettle
          this.value.insuranceType = Number(this.value.insuranceType) || 2 // 给默认值
          this.value = Object.assign({}, this.value, data.data)
          let chargedetail = {
            patientId: this.value.patientId,
            ipNo: this.value.ipNo,
            settlementId: this.value.settlementId,
            ipStatus: this.value.ipStatus, // 在院状态
            ipSettleStatus: this.value.ipSettleStatus // 住院结算状态
          }
          this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, ...chargedetail }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    getPrintStatus () {
      getPrintStatus({ settlementId: this.value.settlementId }).then(res => {
        this.billPrintObj = res.data // 模板打印的相关参数
      })
    },
    closeDialog () {
      this.$emit('close')
    },
    // 费用清单模板
    previewUrl () {
      let params = encodeURIComponent(JSON.stringify({ ipNo: this.value.ipNo, loginid: localStorage.USERID }))
      let str = `${location.origin}/web/printer/?code=hospitalFeeList&params=${params}&preview=true`
      // let str = `http://testa.everjiankang.com.cn/web/printer/?code=hospitalFeeList&params=${params}&preview=true`
      return str
    },
    // 普通收据模板
    previewHospitalUrl () {
      if (!this.value.settlementId) {
        this.$messageTips(this, 'error', '该患者还未出院结算，无法打印收据')
        return false
      }
      let params = encodeURIComponent(JSON.stringify({ id: this.value.settlementId }))
      let str = `${location.origin}/web/printer/?code=rcm_hospital_billinner&params=${params}&preview=true`
      // let str = `http://testa.everjiankang.com.cn/web/printer/?code=rcm_hospital_billinner&params=${params}&preview=true`
      return str
    },
    createPrint (btnType = 1) {
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: _ => { this.hasBillTemplate = true }, // 发票打印成功之后刷新回调
        billPrintCall: _ => { this.hasBillTemplate = false }, // 没有关联模版走老票据打印的回调
        code: 'rcm_hospital_bill', // 模版code
        everPrintParams: null,
        settlementId: this.value.settlementId, // settlementid
        printType: 3, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info) // 调的mixin里面的公共票据打印接口
    },
    refresh (val) {
      // 刷新value
      this.list()
    },
    async selfReceiptPrint () {
      let codeValInfo = {}
      let codeInfo = await this.receiptPrintApi.getCodeInfo({ code: this.billCode }) // 获取code对应模版当前启用的版本号
      if (codeInfo && codeInfo.viewTemplates.length > 0) {
        codeValInfo = (codeInfo.viewTemplates).find(item => { return item.code === this.billCode })
      }
      this.selfReceiptPrintParams = {
        settlementId: this.value.settlementId,
        code: this.billCode,
        requestType: 1,
        onlyShow: true,
        ver: codeValInfo.ver,
        type: 3
      }
      this.selfGetCorrelation()
    },
    selfGetCorrelation () { // 查询是否关联此code模版,没关联调老收据打印，关联则提示本次要打票据号
      this.receiptPrintApi.printByTemplate(this.selfReceiptPrintParams).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data.length === 1 && rs.data[0]['requestType'] === -1) { // 未关联走老收据打印
            // 未关联模板
            this.hasBillTemplate = false
          } else { // 已经关联
            this.hasBillTemplate = true
          }
        }
      }, rj => {
        this.hasBillTemplate = true
      })
    },
    tabClicked (tab) {
      if (tab.name === 'second') {
        this.$refs.depositeManage.getDeposit()
      }
      if (tab.name === 'five') {
        if (this.value.settlementId) {
          this.getPrintStatus()
          this.selfReceiptPrint()
        }
      }
    }
  },
  watch: {
    'value.settlementId': {
      handler: function (val, oldval) {
        if (val && val !== oldval && this.activeName === 'five') {
          this.getPrintStatus()
          this.selfReceiptPrint()
        }
      }
    }
  },
  components: {
    leaveDetails,
    depositManage,
    chargetab,
    reportViewIframe,
    commonHeader
  },
}
</script>
<style scoped>
.dialog .tabs {
  background: #fff;
  padding: 10px;
  height: 100%;
  overflow: hidden;
}
.dialog .tabs .el-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dialog .tabs .el-tabs /deep/ .el-tabs__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.dialog .tabs .el-tabs /deep/ .el-tabs__content .el-tab-pane {
  flex: 1;
  overflow-y: auto;
}
.box {
  float: left;
  margin-right: 20px;
  height: 28px;
}
.grey {
  background-color: #ccc;
}
.white {
  background-color: white;
}
</style>
