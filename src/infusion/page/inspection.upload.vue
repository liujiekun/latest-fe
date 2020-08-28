<template>
  <div class="inspection_upload" @click='logclose'>
    <!-- @success="key += 1" -->
     <common-header class="layout_wrap_01" code='012' v-if="patientId && length" :patientId="patientId" :visitNumber='visitNumber || hospitalizedNumber'></common-header>
     <div class="topbarbtn" v-if='length'>
       <el-button type="primary" size="mini" plain @click='turn("jz")'  v-if='$route.query.from != "kanban"' :disabled="IsEncounterByTriageId">接诊</el-button>
       <template v-if='IsEncounterByTriageId'>
          <el-button type="primary" size="mini" plain @click='turn("yj")' >预检</el-button>
          <!-- <el-button type="primary" size="mini" plain @click='turn("fygl")'>费用管理</el-button> -->
          <el-button type="primary" size="mini" plain @click='turn("wzsl")'>物资申领</el-button>
       </template>
       <span v-else style="fontSize:14px">请先接诊，接诊完成后继续操作</span>
     </div>
    <div class="record_list" v-if='recordList.length > 0'>
      <div  v-for='(item,index) in recordList'  :key='item.id'>
        <treatTitle :item='item' :showApp='true' :key='item.id' :IsEncounterByTriageId='IsEncounterByTriageId'></treatTitle>
        <template  v-if='showIndex === index'>
          <div v-for='li in item.outpatientExecutes' class='treatline' :key='li.id' >
            <el-row v-if='showOrHidden(item,li,2)' :key='item.id' class="upload_area">
              <span v-if='li.resultReportSource != "1"' style="color:red;fontSize:14px"> <i class="icon iconfont icon-yichang" style="verticalAlign: baseline;fontSize:14px;"></i>
                <span v-if='serviceType == "800"'>RIS</span>
                <span v-if='serviceType == "801"'>LIS</span> 还没有返回结果，请您稍后刷新查看
              </span>
              <div v-else style="paddingTop:20px;">
                <reportCard800 :report='li.executeResult' v-if='serviceType == "800"'></reportCard800>
                <reportCard801 v-if="serviceType == '801'" :report="li.executeResult"></reportCard801>
                <div class="bottom_btn" style="padding-top:10px">
                  <el-button plain :disabled='li.status != 30 || !IsEncounterByTriageId'  @click="edit(item,li,true)">诊断报告</el-button>
                </div>
              </div>
            </el-row>
            <el-row class='upload_area' :key='item.id' v-if='showOrHidden(item,li,1)'>
              <!-- <template v-if='serviceType == "802"'>
                <span class="topleftbg" :class="li.status == 30 ? 'topleftbgoff' :''"></span>
                <span class="topleftnum">{{indexli + 1}}</span>
              </template> -->
              <treatFileUpload :IsEncounterByTriageId='IsEncounterByTriageId' :executeId='li.id' :adviceid='item.id' :fileLists='li.fileLists' :status='li.status' :key='li.id' ></treatFileUpload>
              <div class="clearfix inputs">
                <el-form :model="li"  :rules="rules" ref="ruleForm" label-width="100px">
                <el-col class="bottom_input">
                  <el-form-item label="执行人：" prop="operatorId">
                      <treatDoctorList ref='treat' :edit='li.edit && IsEncounterByTriageId' v-model='li.operatorId'  placeholder='请选择执行人'></treatDoctorList>
                  </el-form-item>
                </el-col>
                <el-col class="bottom_input time" >
                  <el-form-item label="执行时间：" prop="reportTime">
                    <el-date-picker
                      :disabled='!li.edit || !IsEncounterByTriageId'
                      v-model="li.reportTime"
                      type="datetime"
                      format='yyyy-MM-dd HH:mm'
                      placeholder="请选择执行时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="bottom_input">
                  <el-form-item label="执行机构：" >
                    <el-select v-model="li.executeOrgId" placeholder="请选择执行机构"  filterable clearable :disabled='!li.edit || !IsEncounterByTriageId'>
                      <el-option
                        v-for="items in clinicList"
                        :key="items.id"
                        :label="items.name"
                        :value="items.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="bottom_input">
                  <el-form-item label="记录人：" prop="operatorId">
                    <treatDoctorList ref='treat' :edit='li.edit && IsEncounterByTriageId' v-model='li.recorderId' :clinic='true' placeholder='请选择记录人'></treatDoctorList>
                  </el-form-item>
                </el-col>
                <el-col class="bottom_input time">
                  <el-form-item label="记录时间：" prop="recordTime">
                    <el-date-picker
                      :disabled='!li.edit || !IsEncounterByTriageId'
                      v-model="li.recordTime"
                      type="datetime"
                      format='yyyy-MM-dd HH:mm'
                      placeholder="请选择记录时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span='24' class="result"  v-if='serviceType == "802"'>
                  <el-form-item label="结果：" prop="operatorId">
                    <el-input
                      :disabled='!li.edit || !IsEncounterByTriageId'
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                      :maxlength='400'
                      v-model="li.remark">
                    </el-input>
                  </el-form-item>
                  </el-col>
                </el-form>
              </div>
              <div class="bottom_btn clearfix">
                <el-col>
                  <el-button type="primary" @click='completeInspection(item,li,0)' v-if='li.status == "10"' class="exec" :disabled='!IsEncounterByTriageId || li.status == "55" || item.status == "11"'>执行 </el-button>
                  <el-button type="danger" @click='refuse(item,li,3)' v-if='li.status == "10" && visitType == "3"' class="exec" :disabled='!IsEncounterByTriageId || li.status == "55" || item.status == "11"'>无法执行</el-button>
                  <el-button plain @click='completeInspection(item,li,1)' v-if='li.status != "10"' :disabled='!IsEncounterByTriageId || li.status == "55" || item.status == "11"'>取消执行</el-button>
                  <el-button plain @click='editor(item,li)' :disabled="li.status == 10 || !IsEncounterByTriageId " v-if='[55,11,30].indexOf(li.status) == -1  && serviceType !== "802"'>报告填写 </el-button>
                  <el-button plain @click='reporte(item,li)' v-else-if='serviceType !== "802"'>报告预览</el-button>
                  <el-button plain :disabled='li.status == 10 || !IsEncounterByTriageId || li.status == "55" || item.status == "11"' v-if='li.status != 30' @click='updateAdviceStatus(item,li,30)'>发布报告</el-button>
                  <el-button plain v-if='li.status == 30' @click='updateAdviceStatus(item,li,20)' :disabled='!IsEncounterByTriageId || li.status == "55" || item.status == "11"'>取消发布</el-button>
                  <el-button plain :disabled='li.status == 10 || !IsEncounterByTriageId || li.status == "55"'  @click="edit(item,li)">诊断报告</el-button>
                  <el-button type="default" @click='turn("fygl", item,li)' :disabled='li.status == "55"'>费用管理</el-button>
                </el-col>
              </div>
            </el-row>
            <div class="log">
              <treatLog :item='item' :li='li' ref='treatLog' :IsEncounterByTriageId='IsEncounterByTriageId'></treatLog>
            </div>
          </div>
        </template>
        <div v-else class="load">
          <i class="icon iconfont icon-zhankai2" @click='show(index)'></i>
        </div>
      </div>
    </div>
    <ever-no-data tipTxt="该患者本次看诊没有需要执行的任务" v-if='recordList.length == 0'></ever-no-data>
    <treatEdit ref='treatedit'></treatEdit>
    <rd ref='rd'></rd>
   <dialog-precheck
      ref="tirggeryujian"
      title='修改预检信息'
      :precheckData="precheckData"
      :task="precheckData"
      :nosubmit="false"
      @update='update'
      :showHead='false'
    ></dialog-precheck>
    <feeorders
      :dialogShow.sync='dialogShow'
      :baseInfo='baseInfo'
      :visit-type='+visitType || this.baseInfo.visitType'
      :subOrderSource='11'
      :searchType='2'
      :provider-types="providerTypes"
      :t-fee-limit="tFeeLimit"
			:filter-advice-type="filterAdviceType"
			:fees-type="4"
			workspace="YJ-001"
    ></feeorders>
    <dialogEdiotor ref='dialogEdiotor' @success='init'></dialogEdiotor>
    <reporte ref='reporte'></reporte>
  </div>
</template>
<script>
import reporte from '@/workspace/components/report.e.vue'
import feeorders from '@/inpatient/components/fee.orders/fee.dialog.vue'
import session from '@/util/session'
import commonHeader from '@/inpatient/components/common.head.js'
import api from '@/infusion/store/infusion.js'
import {isJsonString} from '@/util/common'
import reportCard800 from '@/workspace/components/report.card.800.vue'
import reportCard801 from '@/workspace/components/report.card.801.vue'
import workapi from '@/arrange/store/workapi.js'
import treatFileUpload from '@/infusion/page/treat/treat.file.upload.vue'
import treatTitle from '@/infusion/page/treat/treat.title.vue'
import treatDoctorList from '@/infusion/page/treat/treat.doctor.list.vue'
import treatLog from '@/infusion/page/treat/treat.log.vue'
import treatEdit from '@/infusion/page/treat/treat.edit.vue'
import rd from '@/infusion/components/report.card.vue'
import dialogPrecheck from '@/workspace/page/dialog-precheck.vue'
import mainheaderapi from '@/workspace/store/mainheaderapi.js'
import dialogEdiotor from '@/infusion/page/dialog.ediotor.vue'
export default {
  mixins: [session],
  props: ['providerId', 'providerName'],
  components: {
    commonHeader,
    reportCard800,
    reportCard801,
    treatFileUpload,
    treatTitle,
    treatDoctorList,
    treatLog,
    treatEdit,
    rd,
    dialogPrecheck,
    feeorders,
    dialogEdiotor,
    reporte
  },
  data () {
    return {
      api,
      mainheaderapi,
      workapi,
      isJsonString,
      recordList: [],
      key: 0,
      options: [],
      value: '',
      logs: [],
      clinicList: [],
      patientId: this.$route.query.patientId,
      visitNumber: this.$route.query.visitNumber, // 门诊就诊编号
      hospitalizedNumber: this.$route.query.hospitalizedNumber, // 住院编号
      visitType: this.$route.query.visitType,
      serviceType: '', // 800--检查 801--检验 802--治疗
      rules: {
        reportTime: [
            { required: true, message: '请选择执行时间', trigger: 'change' }
        ],
        recordTime: [
            { required: true, message: '请选择记录时间', trigger: 'change' }
        ]
      },
      IsEncounterByTriageId: false,
      precheckData: {
        patientId: this.$route.query.patientId,
        patientName: '',
        visitNumber: this.$route.query.visitNumber,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        providerid: this.providerId || this.$route.query.providerId,
        providerName: this.providerName || this.$route.query.providerName
      },
      baseInfo: {},
      dialogShow: false,
      length: true,
      providerTypes: ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04'], // 默认门急诊+医技
      tFeeLimit: false, // 退费权限
      showIndex: 0,
      refuseType: [], // 禁止补费类型
      filterAdviceType: '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,299,301,302,303,304,341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867'
    }
  },
  mounted () {
    this.workapi.getAllcliniclist({}).then(res => {
      res.data = res.data || {}
      this.clinicList = res.data.resultList || []
      this.clinicList.forEach(ele => {
        ele.id = String(ele.id)
      })
    })
    // 查询是否有退费权限
    this.tFeeLimit = this.$hasPermission('Auth_menu_tech_fee_return')
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
    reporte (item, li) {
      let obj = li.executeResult || {}
      this.$refs.reporte.open(obj.formDataId, obj.formTemplateId)
    },
    editor (item, li) {
      this.$refs.dialogEdiotor.open(item, li)
    },
    update () {
      setTimeout(_ => {
        this.$bus.$emit('commenHeadRefresh')
      }, 1000)
    },
    turn (type, advice) {
      let url = ''
      if (type === 'jz') {
        this.IsEncounterByTriageId = true
        this.$emit('jz')
        return
      }
      if (type === 'fygl') {
        if (advice.orgId !== this.$store.state.currentUser.organizationId) {
          this.$notify({
            title: '警告',
            message: `${advice.orgName}机构开具的执行单，不支持补费`,
            type: 'warning'
          })
          return
        }
        this.baseInfo = {
          visitType: advice.visitType,
          visitNumber: advice.visitNumber,
          hospitalizedNumber: advice.hospitalizedNumber,
          patientId: advice.patientId,
          patientName: advice.patientName,
          doctorId: this.$store.state.currentUser.userId,
          providerId: this.precheckData.providerid,
          providerName: this.precheckData.providerName,
          adviceId: advice.id,
          feesDoctorId: advice.doctorId,
          feesDoctorName: advice.doctorName
        }
        this.visitType = advice.visitType
        if (this.visitType === 3) {
          this.providerTypes = ['01.01', '02.01', '02.02', '02.03', '02.04']
          this.refuseType = ['300', '301', '302', '303', '304', '10008']
          this.filterAdviceType = '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867'
        } else if (this.visitType === 1) {
          this.providerTypes = ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
          this.refuseType = []
          this.filterAdviceType = '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,299,301,302,303,304,341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867'
        }
        this.dialogShow = true
        return
      }
      if (type === 'yj') {
        this.$refs.tirggeryujian.open()
        return
      }
      if (type === 'wzsl') url = this.$ever.warehouseIndex + '/goods/consumptivereceiveadd'
      window.open(url)
    },
    show (index) {
      this.showIndex = index
      this.$nextTick(_ => {
        this.$refs.treat = this.$refs.treat || []
        this.$refs.treat.forEach(item => {
          item.init(this.options)
        })
      })
    },
    showOrHidden (item, li, type) {
      // item.isThirdAdvice = 1
      //   item.outwardDeliveryFlag = 1 // outwardDeliveryFlag 1-外送；0-非外送
      let outwardDeliveryFlag = String(item.outwardDeliveryFlag)
      let status = String(item.status)
      let isThirdAdvice = String(item.isThirdAdvice)
      if (this.serviceType === '802' && type === 1) return true// 治疗
      if (this.serviceType === '802' && type === 2) return false// 治疗

      if (this.serviceType === '800' && type === 1) return isThirdAdvice !== '1' // 检查 只判断是否对接第三方
      if (this.serviceType === '800' && type === 2) return isThirdAdvice === '1' // 检查

      if (this.serviceType === '801') { // 检验
        if (isThirdAdvice !== '1') { // 不对接第三方
          if (type === 1) return true
          if (type === 2) return false
        } else {
          if (outwardDeliveryFlag === '1') { // 对接第三方+外送对接
             // if (ele.resultReportSource === '1') { // 第三方的报告
            if (type === 2) {
              return !(li.resultReportSource === '2' && status === '60')
            }
            if (type === 1) {
              return !(li.resultReportSource === '1' && status === '60')
            }
          } else { // 第三方+不外送
            if (type === 1) return false
            if (type === 2) return true
          }
        }
      }
    },
    edit (item, li, type) {
      let obj = li.executeResult || {}
      if (!type && li.fileLists.length === 0 && !obj.formDataId) {
        this.$notify({
          title: '警告',
          message: '报告未出，请您耐心等待',
          type: 'warning'
        })
      } else {
        this.$refs.treatedit.open(item, li)
      }
      // this.$refs.rd.openDialog({
      //   serviceType: item.serviceType,
      //   serviceId: item.serviceId,
      //   executeId: li.id
      // }, true)
    },
    async updateAdviceStatus (item, li, status) {
      let res = await this.api.updateAdviceStatus({
        serviceType: this.serviceType,
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
      if (!this.$refs.treatLog) return
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
    async getDoctorList () { // 给执行人和记录人options和默认值赋值
      let data = this.options
      if (!data.length) {
        let res = await this.api.getStaffListHasOrgByCondition({
          // clinicId: this.$store.state.currentUser.organizationId
        })
        res.data = res.data || {}
        this.options = res.data.resultList || []
        data = this.options
        this.$refs.treat = this.$refs.treat || []
        this.$refs.treat.forEach(item => {
          item.init(this.options)
        })
      }
      let set = false
      data.forEach(item => {
        if (item.id === this.$store.state.currentUser.userId) {
          set = true
        }
      })
      if (set) {
        this.recordList.forEach(item => {
          item.outpatientExecutes.forEach(li => {
            if (!li.operatorId && li.edit) {
              li.operatorId = this.$store.state.currentUser.userId
            }
            if (!li.recorderId && li.edit) {
              li.recorderId = this.$store.state.currentUser.userId
            }
          })
        })
      }
    },
    executeOrgIdDefault () {
      if (this.recordList.length > 0) {
        this.recordList.forEach(item => {
          item.outpatientExecutes.forEach(li => {
            if (!li.executeOrgId && li.edit) {
              li.executeOrgId = this.$store.state.currentUser.organizationId + ''
            }
          })
        })
      }
    },
    async checkIsEncounterByTriageId () { // 检查是否被接诊
      if (!this.$route.query.triageId) return
      let res = await this.mainheaderapi.checkIsEncounterByVisitNumber({
        triageId: this.$route.query.triageId
      })
      this.IsEncounterByTriageId = res.data.isEncounter === 1
    },
    init () {
      this.visitType = this.$route.query.visitType // 住院-3 门诊-1
      this.IsEncounterByTriageId = true
      this.patientId = this.$route.query.patientId
      this.visitNumber = this.$route.query.visitNumber
      this.hospitalizedNumber = this.$route.query.hospitalizedNumber
      this.serviceType = String(this.$route.params.serviceType || this.$route.query.adviceType)
      if (this.providerid) this.precheckData.providerid = this.providerid
      if (this.providerName) this.precheckData.providerName = this.providerName
      this.getRecipeByAdviceType()
      this.checkIsEncounterByTriageId()
    },
    refuse (item, li) {
      this.$confirm('是否确认无法执行，确认后信息无法更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.completeInspection(item, li, 3)
      })
    },
    async completeInspection (item, li, identification) {
      if (li.disabled) return
      if (identification === 0) {
        if (!li.reportTime) {
          this.$notify({
            title: '警告',
            message: '请选择执行时间',
            type: 'warning'
          })
          return
        }
        if (!li.recordTime) {
          this.$notify({
            title: '警告',
            message: '请选择记录时间',
            type: 'warning'
          })
          return
        }
      }
      li.disabled = true
      let time = ''
      let recordTime = ''
      if (li.reportTime) time = this.$moment(li.reportTime).format('YYYY-MM-DD HH:mm:ss')
      if (li.recordTime) recordTime = this.$moment(li.recordTime).format('YYYY-MM-DD HH:mm:ss')
      let obj = {
        adviceId: item.id,
        executeId: li.id,
        identification, // 执行医嘱 0；取消执行 1；编辑 2； （3 无法执行前端标记）
        operatorId: li.operatorId,
        operator: this.option(li.operatorId, this.options),
        reportTime: time,
        recordTime: recordTime,
        recorderId: li.recorderId,
        recorderName: this.option(li.recorderId, this.options),
        executeOrgId: li.executeOrgId,
        remark: li.remark || '',
        executeOrgName: this.option(li.executeOrgId, this.clinicList),
        scenes: this.serviceType === '802' ? 2 : 1
      }
      let res
      if (identification === 3) {
        delete obj.scenes
        delete obj.identification
        res = await this.api.rejectExecute(obj).catch(_ => {
          this.init()
        })
        if (res && res.head && res.head.errCode === 0) {
          li.edit = !li.edit
          this.$notify({
            title: '成功',
            message: '无法执行提交成功',
            type: 'success'
          })
        }
      } else {
        res = await this.api.completeInspection(obj).catch(_ => {
          this.init()
        })
        if (res && res.head && res.head.errCode === 0) {
          li.edit = !li.edit
          this.$notify({
            title: '成功',
            message: identification === 0 ? '执行完成' : '取消执行成功',
            type: 'success'
          })
        }
      }
      this.init()
    },
    async getRecipeByAdviceType () { // 获取执行列表
      if ((!this.visitNumber && !this.hospitalizedNumber) || !this.serviceType) return
      let query = {}
      if (this.$route.query.from === 'kanban') {
        query.visitNumber = this.visitNumber
        query.serviceType = this.serviceType
      } else {
        query.executeIds = [this.$route.query.taskId]
        if (query.executeIds.length === 0) {
          this.recordList = []
          return
        }
      }
      let res = await this.api.getRecipeByAdviceType(query)
      res.data = res.data || []
      this.length = res.data.length > 0
      res.data.forEach(item => {
        this.precheckData.patientName = item.patientName
        // item.isThirdAdvice = 1 // 1对接 ，其他不对接
        // item.outwardDeliveryFlag = 1 // outwardDeliveryFlag 1-外送；0-非外送
        item.clinicOptions = [] // 初始化执行机构options 不可删除
        item.options = [] // 初始化执行人和记录人options 不可删除
        item.isPushApp = !!item.isPushApp
        //  字段回显
        item.outpatientExecutes = item.outpatientExecutes || []
        let count = 0
        item.outpatientExecutes.forEach(li => {
          if (li.status === 30)count++
          let executeResult = li.executeResult || {}
          if (executeResult.reportTime) li.reportTime = executeResult.reportTime
          if (executeResult.recordTime) li.recordTime = executeResult.recordTime
          li.operatorId = executeResult.operatorId
          li.recorderId = executeResult.recorderId
          li.executeOrgId = executeResult.executeOrgId
          li.remark = executeResult.remark
          li.fileLists = []
          li.resultReportSource = String(executeResult.resultReportSource)
          if (executeResult.pdfReportUrl && String(li.resultReportSource) === '2') {
            li.fileLists = isJsonString(executeResult.pdfReportUrl) ? JSON.parse(executeResult.pdfReportUrl) : []
            li.fileLists.forEach(element => {
              element.open = false
            })
          }
            //  字段回显结束
            //  字段默认值
          li.edit = li.status === 10
          if (!li.reportTime && li.edit) {
            li.reportTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          }
          if (!li.recordTime && li.edit) {
            li.recordTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          }
        })
        item.complateCount = count
      })
      this.$nextTick(() => {
        this.recordList = res.data
        this.executeOrgIdDefault()
        this.getDoctorList()
        for (let form in this.$refs.ruleForm) {
          this.$refs.ruleForm[form].resetFields()
        }
      })
       //  字段默认值结束
    }
  }
}
</script>
<style lang="scss" scoped>
.inspection_upload {
  display: flex;
  flex-direction: column;
  height: 100%;
  .topbarbtn{
    background: #fff;
    margin-top: -4px;
    padding: 5px 15px;
  }
  .record_list{
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
    .load{
      text-align: center;
      background: #fcfcfc;
      height: 30px;
      line-height: 30px;
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
    .inputs{
      padding:20px 0;
    }
    .bottom_input{
      float: left;
      width: auto;
      color: #999;
      font-size: 14px;
      line-height: 40px!important;
      /deep/ .el-form-item__label{
        height: 40px;
        line-height: 40px;
      }
      /deep/ .el-form-item{
        margin-bottom: 0px;
      }
    }
    .time{
      /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 190px;
      }
    }
    /deep/ .el-textarea.is-disabled .el-textarea__inner {
      color: #000;
    }
    .result{
      color: #999;
      font-size: 14px;
      /deep/ .el-form-item__label{
        height: 40px;
        line-height: 40px;
      }
      .el-textarea{
        width: calc(100% - 50px);
      }
    }
    .treatline{
      border-bottom:1px solid #ddd;
      position: relative;
      .log{
        position: absolute;
        top:15px;
        right: 15px;
      }
    }
    .bottom_btn{
      // padding-bottom:10px;
      .is-plain{
        color: #1C7BEF;
        border-color: #1C7BEF;
      }
      .is-disabled{
        border-color: #ccc;
        color: #c0c4cc;
      }
      .exec{
        padding-left:20px;
        padding-right:20px;
      }
      .edit{
        padding-left: 60px;
        padding-top: 10px;
      }

    }
    .upload_area{
      background: #fff;
      padding:10px 15px 10px;
      min-height: 40px;
      // /deep/ .el-col{
      //   line-height: 30px;
      // }
    }
  }
}
</style>
