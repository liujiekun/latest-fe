<template>
  <div class="dialog">
    <ever-bread-crumb name="返回" path="/adt/inhosmanage"></ever-bread-crumb>
    <common-header
      ref="commonHeader"
      class="layout_wrap_01"
      :patientId="patientId"
      :visitNumber="value.ipNo"
      :code="'010'"
    ></common-header>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="tabClicked">
        <el-tab-pane label="患者详情" name="/adt/patientdialog/patientdetails">
          <patient-details></patient-details>
        </el-tab-pane>
        <el-tab-pane label="押金管理" id="depositmanage" name="/adt/patientdialog/depositmanage">
          <deposit-manage ref="depositeManage" @refresh="refresh"></deposit-manage>
        </el-tab-pane>
        <el-tab-pane label="费用明细" name="/adt/patientdialog/chargetab">
          <chargetab :paramsObj="value" @refresh="refresh"></chargetab>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import commonHeader from '@/inpatient/components/common.head.js'
import patientDetails from '@/adt/page/patientdetails' // 出院管理患者详情
import depositManage from '@/rcm/page/hospitalization/depositmanage' // 押金管理
import chargetab from '@/rcm/page/hospitalization/chargetab' // 费用明细
import { getPatientInfo } from '@/rcm/store/hospital/hospital'
export default {
  data () {
    return {
      value: {},
      activeName: this.$route.path,
      patientId: this.$route.query.patientId,
      visitNumber: '',
      // 0是医保，1商保，2是自费
      checkList: [
        { name: '全自费', value: 2 },
        { name: '本地医保', value: 0 }
      ]
    }
  },
  components: {
    commonHeader,
    patientDetails,
    depositManage,
    chargetab,
  },
  created () {
    this.value = this.$route.query
    this.list()
  },
  methods: {
    async list () {
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
        console.log('err', err)
      }
    },
    tabClicked (val) {
      this.$router.replace({
        path: val.name,
        query: this.$route.query
      })
      if (val.$attrs.id === 'depositmanage') {
        this.$refs.depositeManage.getDeposit()
      }
    },
    refresh () {
      // 刷新value
      this.list()
    }
  },
  watch: {
    $route: {
      handler: function (val, oldval) {
        this.activeIndex = val.path
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.dialog .tabs {
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dialog .tabs .el-tabs {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
}
.dialog .tabs .el-tabs /deep/ .el-tabs__content {
  display: flex;
  flex-direction: column;
}

.dialog .tabs .el-tabs .el-tabs__content .el-tab-pane {
  overflow: auto;
}
.dialog .tabs .routerview {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}
.box {
  float: left;
  margin-right: 20px;
  height: 28px;
}
</style>
