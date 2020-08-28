<template>
  <div class="treat_upload" @click='logclose'>
    <div class="record_list">
      <template v-for='(item,index) in recordList' v-if='recordList.length > 0'>
        <treatTitle :item='item' :showApp='true' :key='item.id'></treatTitle>
        <div v-for='(li,indexli) in item.outpatientExecutes' class='treatline' :key='li.id'>
          <el-row class='upload_area' :key='item.id' v-if='Number(item.isThirdAdvice) !== 1'>
            <template v-if='$route.query.adviceType == "802"'>
              <span class="topleftbg" :class="li.status == 30 ? 'topleftbgoff' :''"></span>
              <span class="topleftnum">{{indexli + 1}}</span>
            </template>
            <treatFileUpload :executeId='li.id' :adviceid='item.id' :fileLists='li.fileLists' :status='li.status' :key='li.id' >
              <treatLog :executeId='li.id' :adviceid='item.id' ref='treatLog'></treatLog>
            </treatFileUpload>
            <el-col class="bottom_input">
              执行人：
              <treatDoctorList ref='treat' :edit='li.edit' v-model='li.operatorId'  placeholder='请选择执行人'></treatDoctorList>
            </el-col>
            <el-col class="bottom_input">
              执行时间：
              <el-date-picker
                :disabled='!li.edit'
                v-model="li.reportTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                placeholder="请选择执行时间">
              </el-date-picker>
            </el-col>
            <el-col class="bottom_input">
              执行机构：
              <el-select v-model="li.executeOrgId" placeholder="请选择执行机构"  filterable clearable :disabled='!li.edit'>
                <el-option
                  v-for="items in clinicList"
                  :key="items.id"
                  :label="items.name"
                  :value="items.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col class="bottom_input">
              记录人：
              <treatDoctorList ref='treat' :edit='li.edit' v-model='li.recorderId' :clinic='true' placeholder='请选择记录人'></treatDoctorList>
            </el-col>
            <el-col class="bottom_input">
              记录时间：
              <el-date-picker
                :disabled='!li.edit'
                v-model="li.recordTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                placeholder="请选择记录时间">
              </el-date-picker>
            </el-col>
            <el-col :span='24' class="result">
              结果：
              <el-input
              :disabled='!li.edit'
                type="textarea"
                autosize
                placeholder="请输入内容"
                :maxlength='400'
                v-model="li.remark">
              </el-input>
            </el-col>
            <el-col class="bottom_input edit">
              <!-- <span @click='li.edit = !li.edit' style="cursor: pointer;" v-if='!li.edit'>
                <i class="icon iconfont icon-bingli-bianji"   style="fontSize:14px;verticalAlign:initial;"></i>
                编辑
              </span> -->
              <!-- <el-button type="primary">执行完成</el-button> -->
              <!-- <el-button type="primary" v-if='li.edit' @click='completeInspection(item,li)'>
                <span v-if='li.status == "30"'>保存</span>
                <span v-else>执行完成</span>
              </el-button> -->
            </el-col>
            <div class="bottom_btn">
            <el-col>
              <el-button type="primary" @click='completeInspection(item,li,0)' v-if='li.status == "10"' class="exec">执行 </el-button>
              <el-button plain @click='completeInspection(item,li,1)' v-if='li.status != "10"'>取消执行</el-button>
              <el-button plain :disabled='li.status == 10' v-if='li.status != 30' @click='updateAdviceStatus(item,li,30)'>发布报告</el-button>
              <el-button plain v-if='li.status == 30' @click='updateAdviceStatus(item,li,20)'>取消发布</el-button>
              <el-button plain :disabled='li.status != 30'>编辑报告</el-button>
            </el-col>
          </div>

          </el-row>
          <el-row v-else :key='item.id' class="upload_area">
            <span v-if='item.status != 60' style="color:red;fontSize:14px"> <i class="icon iconfont icon-yichang" style="verticalAlign: baseline;fontSize:14px;"></i>
              <span v-if='adviceType == "800"'>RIS</span>
              <span v-if='adviceType == "801"'>LIS</span> 还没有返回结果，请您稍后刷新查看
            </span>
            <div v-else>
              <reportCard800 :reportUrl='item.reportResult' v-if='adviceType == "800"'></reportCard800>
              <reportCard801 v-if="adviceType == '801'" :tableData="item.tableData" :pdfReportUrls="item.reportResult && JSON.parse(item.reportResult.pdfReportUrl)"></reportCard801>
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
    async updateAdviceStatus (item, li, status) {
      let res = await this.api.updateAdviceStatus({
        adviceId: item.id,
        executeId: li.id,
        status
      }).catch(_ => {
        this.init()
      })
      if (res && res.head && res.head.errCode === 0) {
        var str = status === 20 ? '取消' : ''
        this.$notify({
          title: '成功',
          message: str + '发布报告成功',
          type: 'success'
        })
        this.init()
      }
    },
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
        element.outpatientExecutes.forEach(ele => {
          if (ele.status === 10 && set) {
            ele.operatorId = this.$store.state.currentUser.userId
            ele.recorderId = this.$store.state.currentUser.userId
          }
        })
      })
    },
    executeOrgIdDefault () {
      if (this.recordList.length > 0) {
        this.recordList.forEach(element => {
          element.outpatientExecutes.forEach(ele => {
            if (ele.status === 10) {
              ele.executeOrgId = this.$store.state.currentUser.organizationId + ''
            }
          })
        })
      }
    },
    init () {
      this.getRecordList()
    },
    async completeInspection (item, li, identification) {
      if (li.disabled) return
      li.disabled = true
      //  1 60
      let time = ''
      let recordTime = ''
      if (li.reportTime) time = this.$moment(li.reportTime).format('YYYY-MM-DD HH:mm:ss')
      if (li.recordTime) recordTime = this.$moment(li.recordTime).format('YYYY-MM-DD HH:mm:ss')
      let obj = {
        adviceId: item.id,
        executeId: li.id,
        identification,
        recordTime: recordTime,
        recorderId: li.recorderId,
        recorderName: this.option(li.recorderId, this.options),
        executeOrgId: li.executeOrgId,
        executeOrgName: this.option(li.executeOrgId, this.clinicList),
        operatorId: li.operatorId,
        operator: this.option(li.operatorId, this.options),
        reportTime: time,
        remark: li.remark || '',
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
      if (!this.visitNumber) return
      let res = await this.api.getRecipeByAdviceType({
        visitNumber: this.visitNumber,
        serviceType: '802'
      })
      res.data.forEach(ele => {
        // recipeExcutes
        // ele.isClient = !!ele.isClient
        ele.outpatientExecutes = ele.outpatientExecutes || []
        ele.outpatientExecutes.forEach(element => {
          let executeResult = element.executeResult || {}
          element.reportTime = executeResult.reportTime
          element.recordTime = executeResult.recordTime
          element.operatorId = executeResult.operatorId
          element.recorderId = executeResult.recorderId
          element.executeOrgId = executeResult.executeOrgId

          element.fileLists = isJsonString(executeResult.pdfReportUrl) ? JSON.parse(executeResult.pdfReportUrl) : []

          element.options = []
          element.clinicOptions = []
          element.edit = element.status === 10
          element.disabled = false

          if (element.edit) {
            element.reportTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            element.recordTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          }
          element.tableData = element.executeReport && element.executeReport.resultItem || []

          if (element.adviceContent) {
            element.adviceContent = isJsonString(element.adviceContent) ? JSON.parse(element.adviceContent) : {}
          }
        })
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

  .record_list{
    position: relative;
    flex:1;
    overflow-y: auto;




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
