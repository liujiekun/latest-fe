<template>
  <el-dialog title="临床路径" :visible.sync="visibleFlag"  append-to-body id='selfaddpath' width="1000px">
    <el-row :gutter="20">
        <el-col :span='10'>
            <h3 class="title textcenter">路径列表</h3>
            <h4 class="h4">主诊断符合</h4>
             <el-row style="lineHeight:40px">
                <el-col :offset='3' :span='19' v-for='path in mainDiagnosis' :key='path.id'>
                    <el-radio v-model="pathwayId" :label="path.id">{{path.pathwayName}}</el-radio>
                </el-col>
            </el-row>
            <h4 class="h4">其他</h4>
            <el-row style="lineHeight:40px">
                <el-col :offset='3' :span='19' v-for='path in otherDiagnosis' :key='path.id'>
                    <el-radio v-model="pathwayId" :label="path.id">{{path.pathwayName}}</el-radio>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span='14'>
            <h3 class="title textcenter">路径信息</h3>
            <template v-if='pathwayId'>
                <h4 class="h4 textcenter">{{showObj.pathwayName}}</h4>
                <el-row class="row" :gutter="20">
                  <el-col :span='5' class="textright">科室：</el-col>
                  <el-col :span='19'>
                      <template v-for='(item,index) in showObj.providerList'>
                          {{item.providerName}}
                          <span v-if="index < showObj.providerList.length - 1">，</span>
                      </template>
                  </el-col>
                  <el-col :span='5' class="textright">关联诊断：</el-col>
                  <el-col :span='19'>
                      <template v-for='(item,index) in showObj.diagnosisList'>
                          {{item.diagnosisName}}
                        <span v-if="index < showObj.diagnosisList.length - 1">，</span>
                      </template>
                  </el-col>
                  <el-col :span='5' class="textright">标准住院日：</el-col>
                  <el-col :span='6'>
                      <span v-if="showObj.hospitalDayTo || showObj.hospitalDayFrom">
                          <span v-for="(item,index) in typeOptions">
                              <span v-if="showObj.hospitalDayType === item.id && showObj.hospitalDayType !== 1">{{item.name}} {{showObj.hospitalDayTo}} 天</span>
                              <span v-if="showObj.hospitalDayType === item.id && showObj.hospitalDayType === 1">{{showObj.hospitalDayFrom}} - {{showObj.hospitalDayTo}} 天</span>
                          </span>
                      </span>
                      <span v-else>
                      --
                      </span>
                  </el-col>
                  <el-col :span='5' class="textright">费用：</el-col>
                  <el-col :span='6'>
                    <span>
                      {{showObj.standardFeeFrom || '0'}}
                      <span v-if="showObj.standardFeeFrom || showObj.standardFeeTo">-</span>
                      {{showObj.standardFeeTo}} 元
                    </span>
                  </el-col>
                  <el-col :span='5' class="textright">性别：</el-col>
                  <el-col :span='6'>
                    <sys-value type="GBT.2261.1" :code="showObj.sex + ''" v-if="showObj.sex"></sys-value>
                    <span v-else>不限</span>
                  </el-col>
                  <el-col :span='5' class="textright">年龄：</el-col>
                  <el-col :span='6'>
                    {{showObj.ageFrom || '0'}}
                    <span v-if="showObj.ageFrom || showObj.ageTo">-</span>
                    {{showObj.ageTo}}岁
                  </el-col>
                </el-row>
                <el-row class='row'>
                    <el-col>诊疗阶段：</el-col>
                    <el-col :offset="1" v-for='item in showObj.stageObjList' :key='item.id'>{{item.stageName}}</el-col>
                </el-row>
                <el-row class='row'>
                    <el-col :span='5'>排除条件：</el-col>
                    <el-col :offset="1" :span='5'>{{showObj.exclusions}}</el-col>
                </el-row>
                <el-row class='row'>
                    <el-col :span='5'>诊断依据：</el-col>
                    <el-col :offset="1" :span='5'>{{showObj.diagnosis}}</el-col>
                </el-row>
                <el-row class='row'>
                    <el-col :span='5'>治疗方案依据：</el-col>
                    <el-col :offset="1" :span='5'>{{showObj.basisOfTreatmentPlan}}</el-col>
                </el-row>
            </template>
            <ever-no-data v-else></ever-no-data>
        </el-col>
    </el-row>
    <div slot='footer'>
      <el-button @click='close'>取消入径</el-button>
      <el-button type="primary" :disabled="!pathwayId || sending" @click='enterPathway'>确认入径</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/inpatient/store/resident.js'
export default {
  data () {
    return {
      api,
      visibleFlag: false,
      sending: false,
      pathwayId: '',
      obj: {},
      zhenduan: [],
      mainDiagnosis: [],
      otherDiagnosis: [],
      showObj: {},
      typeOptions: [
        {id: 0, name: '小于等于'},
        {id: 1, name: '范围之间'},
        {id: 2, name: '等于'}
      ]
    }
  },
  created () {

  },
  methods: {
    async open (obj) {
      this.obj = obj
      this.pathwayId = ''
      this.zhenduan = JSON.parse(this.obj.medicalRecord.outpatientHead.ZHEN_DUAN)
      if (!this.zhenduan || this.zhenduan.length === 0) return
      this.diseaseName = this.zhenduan[0].diseaseName
      this.visibleFlag = true
      let res = await this.api.getPathwayByPatient({
        hospitalizedNumber: this.obj.hospitalizedNumber,
        patientSex: this.obj.patient.sex,
        diagnosisId: this.zhenduan[0].diseaseCode,
        patientAge: this.obj.patient.age,
        providerId: this.obj.providerId
      })
      this.mainDiagnosis = res.data.mainDiagnosis
      this.otherDiagnosis = res.data.otherDiagnosis
    },
    close () {
      this.visibleFlag = false
      this.sending = false
    },
    async enterPathway () { // 入径
      this.sending = true
      let res = await this.api.enterPathway({
        hospitalizedNumber: this.obj.hospitalizedNumber,
        diagnosisId: this.zhenduan[0].diseaseCode,
        pathwayId: this.pathwayId
      }).catch(_ => {
        this.sending = false
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          title: '提交成功',
          type: 'success',
          message: res.head && res.head.errMsg
        })
        this.close()
        this.$bus.$emit('patient_mgt_shua')
      }
    }
  },
  watch: {
    'pathwayId': {
      handler (val) {
        let obj = {}
        this.mainDiagnosis.forEach(item => {
          if (item.id === val) obj = item
        })
        this.otherDiagnosis.forEach(item => {
          if (item.id === val) obj = item
        })
        this.showObj = obj
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss">
#selfaddpath{
    .textcenter{
        text-align: center;
    }
    .el-dialog__body{
        max-height:500px;
        overflow-y:auto;
        width: auto;
        // width: calc(100% - 10px);
    }
    .el-row{
        margin:0!important;
    }
    .title{
         border-bottom: 1px solid #ccc;
         line-height: 40px;
    }
    .el-col-10{
        min-height:500px;
        border-right: 1px solid #ccc;
    }
    .row{
        line-height: 40px;
        .textright{
            text-align: right;
        }
    }
}
</style>

