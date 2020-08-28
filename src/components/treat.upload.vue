<template>
  <div class="treat_upload" @click='logclose'>
     <common-header class="layout_wrap_01" :key="key" :patientId="patientId"  @success="key += 1"></common-header>
    <div class="record_list">
      <template v-for='(item,index) in recordList' v-if='recordList.length > 0'>
        <treatTitle :item='item' :showApp='true' :key='item.id'></treatTitle>
        <div v-for='(li,indexli) in item.recipeExcutes' class='treatline'>
          <el-row class='upload_area' :key='item.id' v-if='Number(item.isThirdAdvice) !== 1'>
            <span class="topleftbg" :class="li.status == 30 ? 'topleftbgoff' :''"></span>
            <span class="topleftnum">{{indexli + 1}}</span>
            <treatFileUpload :item='li' :key='li.id' :adviceid='item.id'></treatFileUpload>
            <el-col class="bottom_input">
              执行人：
              <treatDoctorList ref='treat' :edit='li.edit' v-model='li.operator'  placeholder='请选择执行人'></treatDoctorList>
            </el-col>
            <el-col class="bottom_input">
              执行时间：
              <el-date-picker
                v-if='li.edit'
                v-model="li.reportDate"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                placeholder="请选择执行时间">
              </el-date-picker>
              <span v-else style="color:#333">{{li.reportDate  | formatDateByExp("YYYY-MM-DD HH:mm")}}</span>
            </el-col>
            <el-col class="bottom_input">
              执行机构：
              <el-select v-model="li.executeOrgId" placeholder="请选择执行机构" v-if='li.edit' filterable clearable>
                <el-option
                  v-for="items in clinicList"
                  :key="items.id"
                  :label="items.name"
                  :value="items.id">
                </el-option>
              </el-select>
              <span v-else style="color:#333">{{li.executeOrgId | option(clinicList)}}</span>
            </el-col>
            <el-col class="bottom_input">
              记录人：
              <treatDoctorList ref='treat' :edit='li.edit' v-model='li.recorderId' :clinic='true' placeholder='请选择记录人'></treatDoctorList>
            </el-col>
            <el-col class="bottom_input">
              记录时间：
              <el-date-picker
                v-if='li.edit'
                v-model="li.recordTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                placeholder="请选择记录时间">
              </el-date-picker>
              <span v-else style="color:#333">{{li.recordTime  | formatDateByExp("YYYY-MM-DD HH:mm")}}</span>
            </el-col>
            <el-col :span='24' class="result">
              结果：
              <el-input
                type="textarea"
                autosize
                placeholder="请输入内容"
                 v-if='li.edit'
                :maxlength='400'
                v-model="li.result">
              </el-input>
              <span v-else style="color:#333;word-break: break-all">{{li.result || '--'}}</span>
            </el-col>
            <el-col class="bottom_input edit">
              <span @click='li.edit = !li.edit' style="cursor: pointer;" v-if='!li.edit'>
                <i class="icon iconfont icon-bingli-bianji"   style="fontSize:14px;verticalAlign:initial;"></i>
                编辑
              </span>
              <!-- <el-button type="primary">执行完成</el-button> -->
              <el-button type="primary" v-if='li.edit' @click='completeInspection(item,li)'>
                <span v-if='li.status == "30"'>保存</span>
                <span v-else>执行完成</span>
              </el-button>
            </el-col>
            <treatLog :item='li' :adviceid='item.id' ref='treatLog'></treatLog>
          </el-row>
          <el-row v-else :key='item.id' class="upload_area">
            <span v-if='item.status != 60' style="color:red;fontSize:14px"> <i class="icon iconfont icon-yichang" style="verticalAlign: baseline;fontSize:14px;"></i>
              <span v-if='adviceType == "800"'>RIS</span>
              <span v-if='adviceType == "801"'>LIS</span> 还没有返回结果，请您稍后刷新查看
            </span>
            <div v-else>
              <report-card800 :reportUrl='item.reportResult' v-if='adviceType == "800"'></report-card800>
              <report-card801 v-if="adviceType == '801'" :tableData="item.tableData" :pdfReportUrls="item.reportResult && JSON.parse(item.reportResult.pdfReportUrl)"></report-card801>
            </div>
          </el-row>
        </div>
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
        if (this.$refs.treat) {
          this.$refs.treat.forEach(ele => {
            ele.init(this.options)
          })
        }
      }
      let set = false
      data.forEach(ele => {
        if (ele.id === this.$store.state.currentUser.userId) {
          set = true
        }
      })
      this.recordList.forEach(element => {
        element.recipeExcutes.forEach(ele => {
          if (ele.status !== 30 && set) {
            ele.operator = this.$store.state.currentUser.userId
            ele.recorderId = this.$store.state.currentUser.userId
          }
        })
      })
    },
    executeOrgIdDefault () {
      if (this.recordList.length > 0) {
        this.recordList.forEach(element => {
          element.recipeExcutes.forEach(ele => {
            if (ele.status !== 30) {
              ele.executeOrgId = this.$store.state.currentUser.organizationId + ''
            }
          })
        })
      }
    },
    init () {
      this.getRecordList()
    },
    async completeInspection (item, li) {
      if (li.disabled) return
      li.disabled = true
      //  1 60
      let time = ''
      let recordTime = ''
      if (li.reportDate) time = this.$moment(li.reportDate).format('YYYY-MM-DD HH:mm:ss')
      if (li.recordTime) recordTime = this.$moment(li.recordTime).format('YYYY-MM-DD HH:mm:ss')
      let obj = {
        recordTime: recordTime,
        recorderId: li.recorderId,
        recorderName: this.option(li.recorderId, this.options),
        executeOrgId: li.executeOrgId,
        executeOrgName: this.option(li.executeOrgId, this.clinicList),
        adviceId: item.id,
        operator: li.operator,
        operatorName: this.option(li.operator, this.options),
        reportDate: time,
        result: li.result || '',
        adviceExecuteId: li.id,
        identification: String(li.status) === '30' ? 1 : 0, // 0-完成检查 1-编辑保存
        scenes: 2
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
      res.data.forEach(ele => {
        // recipeExcutes
        ele.isClient = !!ele.isClient
        let count = 0
        ele.recipeExcutes = ele.recipeExcutes || []
        ele.recipeExcutes.forEach(element => {
          element.clinicOptions = []
          element.options = []
          element.fileLists = []
          element.reportDate = element.executeReport && element.executeReport.reportTime
          element.recordTime = element.executeReport && element.executeReport.recordTime
          element.operator = element.executeReport && element.executeReport.operator
          element.recorderId = element.executeReport && element.executeReport.recorderId
          element.executeOrgId = element.executeReport && element.executeReport.executeOrgId
          element.result = element.executeReport && element.executeReport.result
          element.edit = element.status !== 30
          element.disabled = false
          if (!element.edit)count++
          if (element.edit) {
            element.reportDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            element.recordTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          }
          element.executeReport = element.executeReport || {}
          element.tableData = element.executeReport && element.executeReport.resultItem || []
          if (element.executeReport.pdfReportUrl) {
            element.fileLists = isJsonString(element.executeReport.pdfReportUrl) ? JSON.parse(element.executeReport.pdfReportUrl) : []
          }
          if (element.adviceContent) {
            element.adviceContent = isJsonString(element.adviceContent) ? JSON.parse(element.adviceContent) : {}
          }
        })
        ele.complateCount = count
      })
      this.recordList = res.data
      this.executeOrgIdDefault()
      this.getDoctorList()
    }
  }
}
</script>
<style lang="scss" scoped>
.treat_upload {
  background: #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  .treatline{
    border-bottom:1px solid #ddd;
  }
  .record_list{
    position: relative;
    flex:1;
    overflow-y: auto;
    .topleftbg{
      position: absolute;
      top:0;
      left:0;
      width: 0;
      height: 0;
      border-width: 15px;
      border-style: solid;
      border-color:#1C7BEF transparent transparent #1C7BEF;
    }
    .topleftbgoff{
       border-color:#ccc transparent transparent #ccc;
    }
    .topleftnum{
      position: absolute;
      top:0;
      left:0;
      color: #fff;
      font-size: 12px;
      width: 16px;
      text-align: center;
      height: 30px;
      line-height: 24px;
    }
    .bottom_input{
      float: left;
      width: auto;
      color: #999;
      font-size: 14px;
      margin-right: 15px;
      line-height: 40px!important;
    }
    .edit{
      padding-left: 60px;
      padding-top: 10px;
    }
    .result{
        color: #999;
        font-size: 14px;
        padding-left:14px;
        padding-top:10px;
        .el-textarea{
          width: calc(100% - 50px);
        }
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
