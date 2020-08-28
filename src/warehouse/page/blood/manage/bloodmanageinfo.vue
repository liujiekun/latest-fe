<template>
  <div>
    <ever-bread-crumb :name="routeName == 'readyapply' ? '备血申请' : '交叉配血'" @click="$router.go(-1)" showTitle="true"></ever-bread-crumb>
    <el-row class="mb10">
      <el-col :span="20">
        <blood-patient-info :patientInfo="patientInfo" :routeName="routeName"></blood-patient-info>
      </el-col>
      <el-col :span="4">
        <div class="layout_inner padding20 ml10">
          <el-form class="rightabo">
            <el-form-item label="ABO血型"><span class="f18">{{patientInfo.aboName}}</span></el-form-item>
            <el-form-item label="Rh(D)血型"><span class="f18">{{patientInfo.rhName}}</span></el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="layout_inner" style="padding: 5px 15px">
      <blood-patient-inspect :tableData="reportList"></blood-patient-inspect>
      <div class="ispass" v-if="patientInfo.ifPass">备血不通过结果已发送给申请医生，重新采样检验。</div>
      <div v-if="routeName == 'readyapply' && patientInfo.status == bloodConfig.BLOOD_APPLY_STATUS[0].id && !patientInfo.ifPass">
        <el-button type="primary" @click="hanldabopt">通过</el-button>
        <el-button type="primary" @click="hanldNoAbopt">不通过</el-button>
      </div>
      <div v-else>
        <el-button
          v-if="[bloodConfig.BLOOD_APPLY_STATUS[1].id, bloodConfig.BLOOD_MATCHING_STATUS[1].id, bloodConfig.BLOOD_MATCHING_STATUS[3].id].includes(patientInfo.status)"
          type="primary" @click="popBloodMatching">配血</el-button>
        <el-button v-if="bloodTableData.length" type="text" :disabled="thisCheckList.length ? false : true" @click="handlePrintCode('blood_match_info')">打印报告</el-button>
        <el-button v-if="bloodTableData.length" type="text" :disabled="thisCheckList.length ? false : true" @click="handlePrintCode('blood_patient_info')">打印患者条码</el-button>
      </div>
      <div class="hr"></div>
      <blood-table
        @updateTableData="updateTableData"
        @checkChange="checkChange"
        :bloodTableData="bloodTableData">
      </blood-table>
    </div>
    <!-- 配血 -->
    <blood-matching
      ref="bloodmatching"
      :routeName="routeName"
      :id="this.id"
      :patientInfo="patientInfo"
      :reportList="reportList"
      @updateTableData="updateTableData">
    </blood-matching>
  </div>
</template>

<script>
import reparationapi from '../store/bloodpreparationapi'
import matchingapi from '../store/bloodmatchingapi'
import bloodConfig from '../util/bloodconfig'
import bloodPatientInfo from '../components/bloodpatient.info'
import bloodPatientInspect from '../components/bloodpatient.inspect'
import bloodMatching from '../components/blood.matching'
import bloodTable from '../components/bloodtable'
import bloodprint from '../util/bloodprint.js'
import bloodCommonFn from '../util/bloodcommonfn'
export default {
  mixins: [bloodprint, bloodCommonFn],
  data () {
    return {
      api: {},
      bloodConfig,
      id: this.$route.params.id,
      routeName: this.$route.name,
      patientInfo: {},
      reportList: [],
      bloodTableData: [],
      thisCheckList: []
    }
  },
  created () {
    this._route(this.routeName)
  },
  methods: {
    checkChange (v) {
      this.thisCheckList = v
    },
    handlePrintCode (code) {
      if (!this.thisCheckList.length) {
        return this.$messageTips(this, 'warning', '请先勾选列表中的血袋')
      }
      if (code === 'blood_match_info') {             //  打印配血报告
        let printList = this.bloodTablefindArr(this.thisCheckList, true)
        let oldData = this.bloodTablefindArr(this.bloodTableData, true)
        printList.forEach(item => {
          let printArr = []
          oldData.forEach(it => {
            it.forEach(ss => {
              if (item[0].matchingBatchId === ss.matchingBatchId) {
                printArr.push(ss.id)
              }
            })
          })
          if (this.reportList.length > 1) {
            this.printAll.push({
              id: printArr.join('\',\''),
              type: code,
              code: item[0].matchingBatchId,
              aboName: this.reportList[1].aboName || '',
              rhName: this.reportList[1].rhName || '',
              bgz: this.reportList[1].bgz || ''
            })
          } else {
            this.printAll.push({
              id: printArr.join('\',\''),
              type: code,
              code: item[0].matchingBatchId
            })
          }
        })
        this.bloodPrintFn()
      } else if (code === 'blood_patient_info') {    //  打印患者条码
        this.api.getBloodPaitentCodeByPreparation({id: this.id, itemList: this.thisCheckList}).then(res => {
          if (res && res.length) {
            res.forEach(item => {
              this.printAll.push({
                id: this.patientInfo.hospitalizedNumber,
                type: code,
                code: item.code
              })
            })
            this.bloodPrintFn()
          }
        })
      }
    },
    updateTableData () {
      this.getInfo()
    },
    _route (v) {
      if (v === 'readyapply') {
        this.api = reparationapi
        this.getInfo()
      } else {
        this.api = matchingapi
        this.getInfo()
      }
    },
    getInfo () {
      this.api.getById({id: this.id}).then(res => {
        if (res) {
          this.patientInfo = res
          this.reportList = res.reportList
          this.bloodTableData = res.itemList ? res.itemList : []
        }
      })
    },
    popBloodMatching () {
      if (this.routeName === 'readyapply' && this.reportList.length > 1 && (this.reportList[0].rhName !== this.reportList[1].rhName || this.reportList[0].aboName !== this.reportList[1].aboName)) {
        this.$confirm('初检与复检血型不一致，是否继续配血？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$refs.bloodmatching.open()
        })
      } else {
        this.$refs.bloodmatching.open()
      }
    },
    hanldabopt () {
      if (this.reportList.length > 1 && (this.reportList[0].rhName !== this.reportList[1].rhName || this.reportList[0].aboName !== this.reportList[1].aboName)) {
        this.$confirm('初检与复检血型不一致，是否备血通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.updatePreparation(this.bloodConfig.BLOOD_APPLY_STATUS[1].id, false)
        })
      } else {
        this.updatePreparation(this.bloodConfig.BLOOD_APPLY_STATUS[1].id, false)
      }
    },
    hanldNoAbopt () {
      this.$confirm('备血不通过结果将发送给申请医生，重新采样检验。', '确定备血不通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.updatePreparation(this.bloodConfig.BLOOD_APPLY_STATUS[0].id, true)
      })
    },
    updatePreparation (status, blood) {
      let params = {
        id: this.id,
        status: status,
        ifPass: blood ? 1 : 0
      }
      this.api.updatePreparation(params).then(res => {
        if (res.flag) {
          this.getInfo()
        }
      })
    }
  },
  watch: {
    '$route.name' (v) {
      this._route(v)
    }
  },
  components: {
    bloodPatientInfo,
    bloodPatientInspect,
    bloodTable,
    bloodMatching
  }
}
</script>

<style scoped lang="scss">
.ispass{
  font-size: 14px;
  color: #EE4433;
  line-height: 40px;
}
.rightabo{
  text-align: center;
  height: 92px;
  padding-top: 15px;
  .el-form-item{
    margin: 0;
    border: 1px solid #ccc;
  }
  /deep/ .el-form-item:last-child{
    border-top: 0;
  }
  /deep/ label {
    width: 50%;
    justify-content: center;
    font-weight: bold;
    background: #EEEEEE;
    border-right: 1px solid #ccc;
  }
}
</style>
