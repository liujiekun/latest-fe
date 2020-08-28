<template>
  <div class="inspection_upload" @click='logclose'>
     <common-header class="layout_wrap_01" :key="key" :patientId="patientId"  @success="key += 1"></common-header>
    <div class="record_list">
      <template v-for='item in recordList' v-if='recordList.length > 0'>
        <treatTitle :item='item' :showApp='true' :key='item.id'></treatTitle>
        <el-row class='upload_area' :key='item.id'>
          <treatFileUpload :item='item' :key='item.id'></treatFileUpload>
          <div style="marginTop:10px;">
            <el-col class="bottom_input">
              执行人：
              <treatDoctorList ref='treat' :edit='item.edit' v-model='item.operatorId'  placeholder='请选择执行人'></treatDoctorList>
            </el-col>
            <el-col class="bottom_input">
              执行时间：
              <el-date-picker
               :disabled='!item.edit'
                v-model="item.reportDate"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                placeholder="请选择执行时间">
              </el-date-picker>
            </el-col>
            <el-col class="bottom_input">
              执行机构：
              <el-select :disabled='!item.edit' v-model="item.executeOrgId" placeholder="请选择执行机构" filterable clearable>
                <el-option
                  v-for="item in clinicList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col class="bottom_input">
              记录人：
              <treatDoctorList ref='treat' :edit='item.edit' v-model='item.recorderId' :clinic='true' placeholder='请选择记录人'></treatDoctorList>
            </el-col>
            <el-col class="bottom_input">
              记录时间：
              <el-date-picker
                :disabled='!item.edit'
                v-model="item.recordTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                placeholder="请选择记录时间">
              </el-date-picker>

            </el-col>
            <el-col class="bottom_input">
              <span @click='item.edit = !item.edit' style="cursor: pointer;" v-if='!item.edit'>
                <i class="icon iconfont icon-bingli-bianji"   style="fontSize:14px;verticalAlign:initial;"></i>
                编辑
              </span>
              <!-- <el-button type="primary">执行完成</el-button> -->
              <el-button type="primary" v-if='item.edit' @click='completeInspection(item)'>
                <span v-if='item.status == "60"'>保存</span>
                <span v-else>执行完成</span>
              </el-button>
            </el-col>
            <treatLog :item='item' ref='treatLog'></treatLog>
          </div>
        </el-row>
        <el-row v-if='Number(item.isThirdAdvice) === 1' :key='item.id' class="upload_area">
          <span
            v-if='item.status != "60"'
            style="color:red;fontSize:14px"
          >
            <i class="icon iconfont icon-yichang" style="verticalAlign: baseline;fontSize:14px;"></i>
            <span v-if='adviceType == "800"'>RIS</span>
            <span v-if='adviceType == "801"'>LIS</span> 还没有返回结果，请您稍后刷新查看
          </span>
          <div v-else>
            <reportCard800 :reportUrl='item.reportResultThird' v-if='adviceType == "800" && item.reportResultThird'></reportCard800>
            <reportCard801 v-if="adviceType == '801' && item.tableData" :tableData="item.tableData" :pdfReportUrls="item.reportResultThird && JSON.parse(item.reportResultThird.pdfReportUrl)"></reportCard801>
          </div>
        </el-row>
      </template>
      <ever-no-data tipTxt="该患者本次看诊没有需要执行的任务" v-if='recordList.length == 0'></ever-no-data>
    </div>
  </div>
</template>
<script>
import commonHeader from '@/inpatient/components/common.head.js'
import api from '@/infusion/store/infusion.js'
import {isJsonString} from '@/util/common'
import reportCard800 from '@/workspace/components/report.card.800.vue'
import reportCard801 from '@/workspace/components/report.card.801.vue'
import organizationcrossapi from '@/warehouse/page/group/store/organizationcrossapi.js'
import resident from '@/inpatient/store/resident.js'
import treatFileUpload from '@/infusion/page/treat/treat.file.upload.vue'
import treatTitle from '@/infusion/page/treat/treat.title.vue'
import treatDoctorList from '@/infusion/page/treat/treat.doctor.list.vue'
import treatLog from '@/infusion/page/treat/treat.log.vue'

export default {
  components: {
    commonHeader,
    reportCard800,
    reportCard801,
    treatFileUpload,
    treatTitle,
    treatDoctorList,
    treatLog
  },
  data () {
    return {
      api,
      organizationcrossapi,
      resident,
      isJsonString,
      recordList: [],
      key: 0,
      patientId: '',
      visitNumber: '',
      dptId: '',
      options: [],
      value: '',
      logs: [],
      clinicList: [],
    }
  },
  mounted () {
    this.patientId = this.$route.query.patientId
    this.visitNumber = this.$route.query.visitNumber
    this.adviceType = this.$route.query.adviceType
    this.organizationcrossapi.getAllClinicList({}).then(res => {
      if (res.list) {
        this.clinicList = res.list || []
        this.clinicList.forEach(ele => {
          ele.id = String(ele.id)
        })
      }
    })
    this.init()
  },
  filters: {
    option (val, options) {
      let str = '--'
      options.forEach(ele => {
        if (ele.id === val) {
          str = ele.name
        }
      })
      return str
    }
  },
  computed: {
    executeOrgId: function () {
      if (this.$store.state.currentUser.organizationId) {
        this.executeOrgIdDefault()
      }
      return this.$store.state.currentUser
    }
  },
  methods: {
    logclose () {
      this.$refs.treatLog.forEach(ele => {
        ele.value = false
      })
    },
    option (val, options) {
      let str = ''
      options.forEach(ele => {
        if (ele.id === val) {
          str = ele.name
        }
      })
      return str
    },
    async getDoctorList () {
      let data = this.options
      if (!data.length) {
        let res = await this.resident.getStaffRecordVoListForBlocService({
          // clinicId: this.$store.state.currentUser.organizationId
        })
        this.options = res.data || []
        data = this.options
        this.$refs.treat = this.$refs.treat || []
        this.$refs.treat.forEach(ele => {
          ele.init(this.options)
        })
      }
      let set = false
      data.forEach(ele => {
        if (ele.id === this.$store.state.currentUser.userId) {
          set = true
        }
      })
      this.recordList.forEach(element => {
        if (element.status !== 60 && set) {
          element.operatorId = this.$store.state.currentUser.userId
          element.recorderId = this.$store.state.currentUser.userId
        }
      })
    },
    executeOrgIdDefault () {
      if (this.recordList.length > 0) {
        this.recordList.forEach(element => {
          if (element.status !== 60) {
            element.executeOrgId = this.$store.state.currentUser.organizationId + ''
          }
        })
      }
    },
    init () {
      this.getRecordList()
    },
    async completeInspection (item) {
      //  1 60
      if (item.disabled) return
      item.disabled = true
      let time = ''
      let recordTime = ''
      if (item.reportDate) time = this.$moment(item.reportDate).format('YYYY-MM-DD HH:mm:ss')
      if (item.recordTime) recordTime = this.$moment(item.recordTime).format('YYYY-MM-DD HH:mm:ss')
      let obj = {
        recordTime: recordTime,
        executeOrgId: item.executeOrgId,
        executeOrgName: this.option(item.executeOrgId, this.clinicList),
        adviceId: item.id,
        operator: item.operatorId,
        operatorName: this.option(item.operatorId, this.options),
        recorderId: item.recorderId,
        recorderName: this.option(item.recorderId, this.options),
        reportDate: time,
        identification: String(item.status) === '60' ? 1 : 0, // 0-完成检查 1-编辑保存
        scenes: 1
      }
      let res = await this.api.completeInspection(obj).catch(_ => {
        this.init()
      })
      if (res && res.head && res.head.errCode === 0) {
        item.edit = !item.edit
        this.$notify({
          title: '成功',
          message: '保存执行记录成功',
          type: 'success'
        })
        this.init()
      }
    },
    async getRecordList () {
      if (!this.visitNumber || !this.adviceType) return
      let res = await this.api.getRecipeByAdviceType({
        visitSn: this.visitNumber,
        adviceType: this.adviceType
      })
      res.data.forEach(element => {
        element.clinicOptions = []
        element.options = []
        element.isClient = !!element.isClient
        element.fileLists = []
        if (element.reportResultArr) {
          element.reportResultArr.forEach(ele => {
            if (ele.resultReportSource === '1') { // 第三方
              element.reportResultThird = ele
              element.tableData = element.reportResultThird.resultItem || []
              if (element.reportResultThird.pdfReportUrl) {
                element.fileLists = isJsonString(element.reportResultThird.pdfReportUrl) ? JSON.parse(element.reportResultThird.pdfReportUrl) : []
              }
            } else if (ele.resultReportSource === '2') {
              element.reportResult = ele
              if (element.reportResult.pdfReportUrl) {
                element.fileLists = isJsonString(element.reportResult.pdfReportUrl) ? JSON.parse(element.reportResult.pdfReportUrl) : []
              }
            }
          })
        }
        element.reportDate = element.reportResult && element.reportResult.reportTime
        element.recordTime = element.reportResult && element.reportResult.recordTime
        element.operatorId = element.reportResult && element.reportResult.operator
        element.recorderId = element.reportResult && element.reportResult.recorderId
        element.executeOrgId = element.reportResult && element.reportResult.executeOrgId
        element.edit = element.status !== 60
        if (element.edit) {
          element.reportDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          element.recordTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        }
        if (element.adviceContent) {
          element.adviceContent = isJsonString(element.adviceContent) ? JSON.parse(element.adviceContent) : {}
        }
      })
      this.recordList = res.data
      console.log(this.recordList)
      this.executeOrgIdDefault()
      this.getDoctorList()
    }
  }
}
</script>
<style lang="scss" scoped>
.inspection_upload {
  display: flex;
  flex-direction: column;
  height: 100%;
  .record_list{
    flex:1;
    overflow-y: auto;
    .bottom_input{
      float: left;
      width: auto;
      color: #999;
      font-size: 14px;
      margin-right: 15px;
      line-height: 40px!important;
    }
    .bottom_input{
      float: left;
      width: auto;
      color: #999;
      font-size: 14px;
      margin-right: 15px;
      line-height: 40px!important;
    }
    .upload_area{
      background: #fff;
      padding:10px 15px 10px;
      min-height: 40px;
      /deep/ .el-col{
        line-height: 30px;
      }
    }
  }
}
</style>
