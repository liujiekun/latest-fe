<template>
  <div id="numberform">
    <el-row class="header">
      <el-col :span="12" align="left">
        <strong class="title">挂号信息</strong>
      </el-col>
    </el-row>
    <el-form class="query_form_wrap" :model="form" label-width="70px" ref="form" size="small" :validate-on-rule-change="false">
      <el-row :gutter="5">
        <el-col :span="4">
          <el-form-item label="初复诊" prop="subsequentVisit" :rules="rules.required">
            <el-select v-model="form.subsequentVisit" style="width:100%" filterable>
              <el-option label="未知" :value="-1"></el-option>
              <el-option label="初诊" :value="0"></el-option>
              <el-option label="复诊" :value="1"></el-option>
              <el-option label="转诊" :value="2"></el-option>
              <el-option label="急诊" :value="3"></el-option>
              <el-option label="体检" :value="4"></el-option>
              <el-option label="简易" :value="5"></el-option>
              <el-option label="疫苗" :value="6"></el-option>
            </el-select>
            <div
              class="el-form-item__error"
              v-if="diagnosis === 0 && form.subsequentVisit === 1"
            >该患者为新患者</div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="科室" prop="deptId" :rules="rules.required">
            <dept-cascader
              v-model="selectDept"
              :template-type="1"
              @change="resetResource"
              style="width:100%"
            ></dept-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="医生" prop="appointmentResourceId" :rules="rules.required">
            <el-select
              v-model="selectResource"
              placeholder="请选择医生"
              value-key="resourceId"
              style="width:100%"
              @change="resetSource"
              filterable
            >
              <el-option
                v-for="(item, i) in resourceArrangeList"
                :key="i"
                :value="item"
                :label="item.resourceName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="号源" prop="serviceTimesliceDto" :rules="rules.requiredObject">
            <number-source
              v-model="selectSource"
              :resource="resource"
              :organ-id="form.organId"
              :dept-id="form.deptId"
              :resource-id="form.resourceId"
              :resource-type="form.resourceType"
              :is-add="isAddSource"
              :appoint-id="form.id"
              :channel="2"
              :date="initSource ? initSource.date : $moment().format('YYYY-MM-DD')"
            ></number-source>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="4">
          <el-form-item label="指定">
            <el-select v-model="form.isAppointResource" style="width:100%">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="医保">
            <sys-type code="THC_CRM_INSURE" v-model="form.medicalInsuranceType" :use-value="true"></sys-type>
            <!--
            <el-select v-model="form.medicalInsuranceType" style="width:100%" filterable>
              <el-option label="自费" :value="0"></el-option>
              <el-option label="基本医疗" :value="1"></el-option>
              <el-option label="基本医疗(无卡)" :value="4"></el-option>
              <el-option label="商业保险" :value="2"></el-option>
              <el-option label="新农合" :value="3"></el-option>
            </el-select>
            -->
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="折扣">
            <el-select v-model="form.discountCard" value-key="id" style="width:100%">
              <el-option :value="0" label="无折扣"></el-option>
              <el-option
                :label="item.name"
                :value="item"
                v-for="(item, i) in discountList"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="爱院">
            <referrer v-model="referrerObject" :disabled="true"></referrer>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="4">
          <el-form-item label="套餐">
            <el-select
              v-model="form.shopSetItemId"
              placeholder="套餐信息"
              style="width: 100%"
              @change="choose"
            >
              <el-option :value="-1" label="不使用"></el-option>
              <el-option
                :value="item.setmealOrderDetailId"
                :label="item.setMealName"
                v-for="(item, i) in serviceSetList"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="red" v-show="countShow" style="font-size:12px;">剩余次数：{{count}}</div>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注" prop="symptom">
            <el-autocomplete
              style="width:100%"
              v-model="form.symptom"
              :maxlength="50"
              :fetch-suggestions="querySearchSymptom"
              placeholder="请输入挂号备注"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="4">
              <el-form-item>
                <el-checkbox v-model="form.jiuZhenCard" :true-label="1" :false-label="0">就诊卡</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-checkbox v-model="form.medicalRecordBook" :true-label="1" :false-label="0">病历本</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-checkbox v-model="form.isUrgent" :true-label="1" :false-label="0">急诊</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-checkbox v-model="isAddSource" :disabled="!selectDept || !selectDept.deptId">加号</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer" style="display:flex;">
      <div align="right" style="flex:1">
        <span>
          挂号费:
          <strong class="small">￥{{form.servicePrice ? form.servicePrice.toFixed(2) : '0.00'}}</strong>
        </span>
        <span>
          就诊卡:
          <strong class="small">￥{{jiuZhenCardPrice.toFixed(2)}}</strong>
        </span>
        <span>
          病历本:
          <strong class="small">￥{{recordBookPrice.toFixed(2)}}</strong>
        </span>
        <span>
          急诊费:
          <strong class="small">￥{{urgentPrice.toFixed(2)}}</strong>
        </span>
        <span>
          打折:
          <strong class="small">￥{{discountPrice}}</strong>
        </span>
        <span>
          合计:
          <strong>￥{{(form.servicePrice - discountPrice + recordBookPrice + jiuZhenCardPrice + urgentPrice).toFixed(2)}}</strong>
        </span>
      </div>
      <div align="right" v-if="!value || (appointState !== -1 && appointState !== 9)">
        <el-button type="primary" plain @click="printPatient" :disabled="!appointId">补打挂号条</el-button>
        <el-button type="primary" @click="backNumber" :disabled="!appointId">退号</el-button>
        <el-button type="primary" @click="createNumber(2)" :disabled="isSubmit || !appointId">换号</el-button>
        <el-button
          type="primary"
          @click="payNumber(0)"
          :disabled="isSubmit"
          v-if="form.serviceOrder && form.serviceOrder.isPaid === 0"
        >继续支付</el-button>
        <el-button
          type="primary"
          @click="createNumber(1)"
          :disabled="isSubmit"
          v-else-if="!form.serviceOrder"
        >挂号缴费</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import sobapi from '@/sob/store/serviceapi'
import referrer from '@/arrange/page/reservation/appointbest.vue'
import numberSource from '@/arrange/page/hyregister/source.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import { frPrint } from '@/util/common'
export default {
  props: ['value', 'initSource', 'appoint', 'diagnosis'],
  data () {
    return {
      api,
      sobapi,
      baseCode: 'thc_rcm.guahaotiao_mem_20181022',
      returnCode: 'thc_rcm_guahaotiao_return',
      isSubmit: false,
      discountList: [],
      serviceSetList: [],
      timerangeList: [],
      resourceArrangeList: [],
      selectSource: '',
      addSourceTime: '',
      referrerObject: '',
      selectDept: '',
      selectResource: '',
      currentArrange: '',
      isAddSource: false,
      isAppoint: true,
      recordBookPrice: 0,
      jiuZhenCardPrice: 0,
      urgentPrice: 0,
      visitNumber: '',
      appointId: '',
      appointState: '',
      resource: '',
      count: '',
      countShow: false,
      form: {
        appointmentType: 1,
        appointmentResourceId: '',
        appointmentResourceName: '',
        appointmentResourceType: '',
        appointmentDate: '',
        appointmentStarttime: '',
        appointmentEndtime: '',
        benefitId: '',
        discount: '',
        discountCard: 0,
        deptId: '',
        deptName: '',
        jiuZhenCard: '',
        medicalRecordBook: '',
        medicalInsuranceType: '1',
        id: '',
        isAppointResource: 1,
        isMedicalInsurance: 0,
        isPhysicalExamination: '',
        isTodayAppoint: true,
        isUrgent: 0,
        organId: '',
        organName: '',
        patient: '',
        patientId: '',
        patientName: '',
        resourceId: '',
        resourceName: '',
        resourceType: '',
        symptom: '',
        shopSetItemId: -1,
        subsequentVisit: 0,
        serviceid: '',
        serviceId: '',
        servicePrice: 0,
        serviceTimesliceDto: '',
        visitNumber: ''
      },
      rules: {
        requiredNo: [
          { required: false, message: '选填项', trigger: ['change'] }
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredObject: [
          { required: true, message: '必填项', trigger: ['change'], type: 'object' }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ],
        zeroRegister: [
          { required: true, message: '挂0元号，请填写备注', trigger: ['change'] }
        ]
      }
    }
  },
  watch: {
    'value' (val) {
      this.resetForm()
      setTimeout(_ => {
        this.appointId = val.id
        this.appointState = val.appointmentState
        this.form = Object.assign(this.form, val)
        this.form.subsequentVisit = this.form.subsequentVisit || 0
        this.form.serviceId = this.form.serviceid
        this.form.isAppointResource = this.form.isAppointResource || 0
        this.form.isPhysicalExamination = this.form.isPhysicalExamination || ''
        this.form.medicalRecordBook = this.form.medicalRecordBook || 0
        this.form.jiuZhenCard = this.form.jiuZhenCard || 0
        this.form.shopSetItemId = this.form.shopSetItemId || -1
        this.form.discountCard = this.form.discount || 0
        this.form.channelId = ''
        this.form.channelName = ''
        this.countShow = false
        this.isAddSource = !!this.form.isPlus
        this.referrerObject = { referrer: { id: this.form.referrer, name: this.form.referrerName }, referrerDept: { id: this.form.referrerDeptId, name: this.form.referrerDeptNmae } }
        this.selectDept = val ? { deptId: val.deptId, deptName: val.deptName, id: val.deptId, name: val.deptName, isSource: true } : ''
        this.selectResource = val ? {
          resourceId: val.appointmentResourceId,
          resourceName: val.appointmentResourceName,
          resourceType: val.appointmentResourceType
        } : ''
        this.selectSource = val ? {
          service: { id: val.serviceid, name: val.serviceName },
          source: { startTimeStr: val.appointmentStarttime, endTimeStr: val.appointmentEndtime, dateStr: this.$moment(val.appointmentDate).format('YYYY-MM-DD') }
        } : ''
      }, 0)
    },
    'selectDept' (val, old) {
      if (val) {
        this.form.deptId = val.deptId
        this.form.deptName = val.deptName
        this.getResouceList()
        this.$emit('val', this.form)
      } else {
        this.form.deptId = ''
        this.form.deptName = ''
        this.resourceArrangeList = []
      }
      if (val && (!old || val.deptId !== old.deptId)) {
        this.$bus.$emit('changeDept', val)
      }
      if (val && !val.isAppoint) {
        this.$emit('changeDept', val)
      }
    },
    'selectResource' (val, old) {
      if (val && val.resourceId) {
        this.form.appointmentResourceId = val.resourceId
        this.form.appointmentResourceName = val.resourceName
        this.form.appointmentResourceType = val.resourceType
        this.form.resourceId = val.resourceId
        this.form.resourceName = val.resourceName
        this.form.resourceType = val.resourceType
        this.currentArrange = val
      } else {
        this.form.appointmentResourceId = ''
        this.form.appointmentResourceName = ''
        this.form.resourceId = ''
        this.form.resourceName = ''
        this.form.appointmentResourceType = ''
        this.form.serviceid = ''
        this.currentArrange = ''
      }
      if (old && val.timeTrunks) {
        this.form.serviceid = ''
      }
      if (!val.isAppoint) {
        this.$emit('changeResource', val)
      }
    },
    'form.subsequentVisit' (val) {
      this.getServicePrice()
    },
    'form.serviceTimesliceDto': {
      handler (val, old) {
        if (val) {
          this.form.appointmentDate = val.dateStr || this.$moment().format('YYYY-MM-DD')
          this.form.appointmentStarttime = val.startTimeStr
          this.form.appointmentEndtime = val.endTimeStr
        }
      },
      deep: false
    },
    'form.patient' (val) {
      if (val) {
        this.form.patientId = val.id
        this.form.patientName = val.name
        this.form.medicalInsuranceType = val.medPersonInfo ? '2' : '1'
        this.form.symptom = val.appointRemark
        this.$bus.$emit('number:patient', val)
      }
    },
    'form.medicalInsuranceType' (val) {
      this.form.isMedicalInsurance = val !== '1' ? 1 : 0
    },
    'form.discountCard' (val) {
      this.form.discount = val ? val.value : 100
      this.form.benefitId = val ? val.id : ''
    },
    'form.medicalRecordBook' (val) {
      if (!val) {
        this.recordBookPrice = 0
      } else {
        this.getItemPrice('bingliben').then(price => {
          this.recordBookPrice = price
        })
      }
    },
    'form.isUrgent' (val) {
      if (!val) {
        this.urgentPrice = 0
      } else {
        this.getItemPrice('register_jiajifei').then(price => {
          this.urgentPrice = price
        })
      }
    },
    'form.jiuZhenCard' (val) {
      if (!val) {
        this.jiuZhenCardPrice = 0
      } else {
        this.getItemPrice('jiuzhenka').then(price => {
          this.jiuZhenCardPrice = price || 0
        })
      }
    },
    'form.shopSetItemId' (val) {
      if (val !== -1) {
        this.form.discount = 0
      }
      this.getServicePrice()
    },
    'selectSource.source' (val) {
      this.form.serviceTimesliceDto = val
    },
    'selectSource.service' (val) {
      if (val) {
        this.form.serviceid = this.form.serviceId = val.id
        this.getDiscountList()
        this.getServicePrice()
        this.getPatientServiceSet()
        if (!this.isAppoint) {
          this.$emit('changeService', val)
        }
      }
    },
    'initSource' (val) {
      this.isAddSource = false
      this.form.serviceOrder = null
      this.form.orderid = null
      this.countShow = false
      this.appointState = ''
      this.form.shopSetItemId = -1
      if (val) {
        this.selectDept = { deptId: val.deptId, deptName: val.deptName, id: val.deptId, name: val.deptName, isSource: true, isAppoint: val.isAppoint }
        if (val.serviceTimesliceDto) {
          val.resourceId = val.serviceTimesliceDto.resourceId
          val.resourceName = val.serviceTimesliceDto.resourceName
          val.resourceType = val.serviceTimesliceDto.resourceType
        } else if (val.doctorList && val.doctorList[0]) {
          val.resourceId = val.doctorList[0].resourceId
          val.resourceName = val.doctorList[0].resourceName
          val.resourceType = val.doctorList[0].resourceType
        }
        this.selectResource = {
          resourceId: val.resourceId,
          resourceName: val.resourceName,
          resourceType: val.resourceType
        }
        this.selectSource = { service: { id: val.serviceId, name: val.serviceName }, source: val.serviceTimesliceDto }
      }
    },
    'isAddSource' (val) {
      this.form.addWay = val ? 2 : 1
      this.getResouceList()
    },
    'appoint' (val) {
      if (!val.useAppoint) {
        if (!val.clear) {
          this.resetForm()
          this.form.patient = val.patient
        } else if (!this.value) {
          this.appointId = ''
          this.form.id = ''
        }
        this.isAppoint = false
      } else {
        Object.assign(this.form, val)
        this.isAppoint = true
        this.form.subsequentVisit = this.form.subsequentVisit || 0
        this.form.serviceId = this.form.serviceid
        this.form.isAppointResource = this.form.isAppointResource || 0
        this.form.isPhysicalExamination = this.form.isPhysicalExamination || ''
        this.form.medicalRecordBook = this.form.medicalRecordBook || 0
        this.form.jiuZhenCard = this.form.jiuZhenCard || 0
        this.form.shopSetItemId = this.form.shopSetItemId || -1
        this.form.channelId = ''
        this.form.channelName = ''
        this.selectDept = { deptId: val.deptId, deptName: val.deptName, id: val.deptId, name: val.deptName, isSource: true, isAppoint: this.isAppoint }
        this.referrerObject = { referrer: { id: this.form.referrer, name: this.form.referrerName }, referrerDept: { id: this.form.referrerDeptId, name: this.form.referrerDeptNmae } }
        this.selectResource = {
          resourceId: val.resourceId || val.appointmentResourceId,
          resourceName: val.resourceName || val.appointmentResourceName,
          resourceType: val.resourceType || val.appointmentResourceType,
          isAppoint: this.isAppoint
        }
        this.selectSource = {
          service: { id: this.form.serviceId, name: this.form.serviceName, isAppoint: this.isAppoint },
          source: {
            startTimeStr: this.form.appointmentStarttime,
            endTimeStr: this.form.appointmentEndtime,
            dateStr: this.$moment(val.appointmentDate).format('YYYY-MM-DD')
          }
        }
      }
    }
  },
  created () {
    this.$bus.$off('onError')
    this.$bus.$on('onError', val => {
      this.isSubmit = false
    })
    this.$bus.$on('appoint:success', val => {
      this.resetForm()
    })
    this.$bus.$on('changetab', val => {
      if (val !== 'ghcx') {
        this.appointId = ''
        this.form.id = ''
        this.form.serviceOrder = ''
      }
    })
  },
  methods: {
    choose (val) {
      let item = this.serviceSetList.filter(item => {
        return item.setmealOrderDetailId === val
      })[0]
      if (item) {
        this.count = item.availableNum
        this.countShow = true
      } else {
        this.count = 0
        this.countShow = false
      }
    },
    createNumber (flag) {
      if (!this.form.patient) {
        this.$messageTips(this, 'warning', '请选择患者', '提示')
        return false
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.isSubmit = true
        let request = flag === 1 ? this.api.createNumber : this.api.changeAppoint
        if (flag === 1 && !this.form.useAppoint && (!this.form.serviceOrder || !this.form.orderid)) {
          this.form.id = ''
        }
        if (this.form.patient.mobile && this.form.patient.mobile.includes('-')) {
          this.form.patient.mobile = this.form.patient.mobile.split('-').join('')
        }
        this.registerValidate(valid => {
          request(this.form).then(rs => {
            this.isSubmit = false
            if (rs.errCode) {
              return false
            }
            if (rs.data.rcmId !== '-1') {
              this.appointId = rs.data.appointId
              this.form.visitNumber = rs.data.appointmentInfo.visitNumber
              rs.data.settlementInfo.isChange = flag !== 1
              this.payNumber(0, rs.data.settlementInfo)
            } else {
              this.$messageTips(this, 'success', '已挂号完成', '挂号成功')
              this.resetForm()
            }
          })
        })
      })
    },
    backNumber () {
      if (!this.form.id) {
        return false
      }
      this.$confirm('您确定要进行退号操作吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.cannelAppoint({ id: this.form.id }).then(rs => {
          if (rs.errCode) {
            return false
          }
          if (rs.data.rcmResult && rs.data.rcmResult.id !== '-1') {
            this.appointId = this.form.id
            this.payNumber(1, rs.data.rcmResult)
          }
        })
      })
    },
    payNumber (flag, result) {
      if (result) {
        result.visitNumber = this.form.visitNumber
        this.$bus.$emit('appoint:rcm2Visible', {
          flag: 'ajax_success',
          printType: 'register',
          rcmResult: result,
          appointId: this.appointId,
          isRefund: !!flag,
          xianchang: 1,
          isMedicalInsurance: this.form.isMedicalInsurance
        })
      } else {
        this.api.getAppointSettlementInfo({ id: this.appointId, returnFlag: flag }).then(rs => {
          if (rs.data) {
            rs.data.visitNumber = this.form.visitNumber
            this.$bus.$emit('appoint:rcm2Visible', {
              flag: 'ajax_success',
              printType: 'register',
              rcmResult: rs.data,
              appointId: this.appointId,
              xianchang: 1,
              isMedicalInsurance: this.form.isMedicalInsurance
            })
          }
        })
      }
    },
    querySearchSymptom (val, callback) {
      this.api.getAppointmentSymptom({ symptom: val }).then(rs => {
        rs.data.map(item => {
          item.value = item.symptom
        })
        callback(rs.data)
      })
    },
    getBasesetResourceTimeList () {
      this.api.getBasesetArrangeResource({
        timeTrunkType: 1,
        deptId: this.form.serviceTimesliceDto.deptId,
        resourceId: this.form.serviceTimesliceDto.resourceId,
        resourceType: this.form.serviceTimesliceDto.resourceType
      }).then(rs => {
        this.timerangeList = []
        if (rs.head.errCode || !rs.data || !rs.data.timerangeList[0]) {
          return false
        }
        rs.data.timerangeList.map(item => {
          this.timerangeList = this.timerangeList.concat(item.timesliceVOList)
        })
        this.timerangeList = this.timerangeList.filter(item => {
          return item.startTimeStr > this.$moment().format('HH:mm')
        })
        if (!this.addSourceTime && this.timerangeList[0]) {
          this.addSourceTime = this.timerangeList[0]
        }
      })
    },
    getResouceList () {
      let startDate = ''
      let endDate = ''
      if (this.isAddSource) {
        startDate = this.$moment().format('YYYY-MM-DD')
        endDate = this.$moment().format('YYYY-MM-DD')
      } else {
        startDate = this.form.appointmentDate ? this.$moment(this.form.appointmentDate).format('YYYY-MM-DD') : this.$moment().format('YYYY-MM-DD')
        endDate = this.form.appointmentDate ? this.$moment(this.form.appointmentDate).format('YYYY-MM-DD') : this.$moment().format('YYYY-MM-DD')
      }
      this.api.getArrangeResourceItem({
        timeTrunkType: 1,
        deptId: this.form.deptId,
        startDate: startDate,
        endDate: endDate
      }).then(rs => {
        this.resourceArrangeList = []
        if (rs.head.errCode || !rs.data[0]) {
          this.selectResource = ''
          return false
        }
        this.resourceArrangeList = rs.data
        if (!this.selectResource || !this.resourceArrangeList.filter(item => {
          return this.selectResource.resourceId === item.resourceId
        })[0]) {
          this.selectResource = this.resourceArrangeList[0]
        }
      })
    },
    getPatientServiceSet () {
      this.serviceSetList = []
      if (this.form.patient && this.form.patient.id && this.form.deptId && this.form.serviceid) {
        this.api.getServiceSetList({
          patientId: this.form.patient.id,
          dptId: this.form.deptId,
          serviceId: this.form.serviceid
        }).then(rs => {
          if (rs.head.errCode || !rs.data) {
            this.form.shopSetItemId = -1
            return false
          }
          this.serviceSetList = rs.data
        })
      } else {
        this.form.shopSetItemId = -1
      }
    },
    getServicePrice () {
      if (!this.form.serviceId || this.form.subsequentVisit === 5) {
        this.form.servicePrice = 0
        return false
      }
      this.api.getServicePrice(this.form.serviceId).then(rs => {
        this.form.servicePrice = !rs.head.errCode ? rs.data[0].price : 0
      })
    },
    getItemPrice (code) {
      return this.sobapi.listByCode({ code: code }).then(rs => {
        if (!rs.head.errCode && rs.data) {
          return this.api.getServicePrice(rs.data.id).then(rs => {
            return !rs.head.errCode ? rs.data[0].price : 0
          })
        } else {
          return 0
        }
      })
    },
    getDiscountList () {
      if (this.form.patient.id && this.form.serviceId) {
        this.api.getPatientDiscounts({ patientId: this.form.patient.id, itemId: this.form.serviceId }).then(rs => {
          if (!rs.head.errCode && rs.data[0]) {
            this.discountList = rs.data.map(item => {
              item.name = (item.discount / 10).toFixed(1) + '折'
              item.value = item.discount
              item.id = item.patientBenefitId
              return item
            })
          }
        })
      }
    },
    printPatient () {
      if (!this.form.patient) {
        this.$messageTips(this, 'info', '请选择患者', '提示')
        return false
      }
      if (!this.form.visitNumber) {
        this.$messageTips(this, 'info', '请选择挂号记录', '提示')
        return false
      }
      frPrint(this.baseCode, { id: this.form.visitNumber })
    },
    resetForm () {
      this.appointId = ''
      this.appointState = ''
      this.selectDept = ''
      this.selectResource = ''
      this.selectSource = ''
      this.referrerObject = ''
      this.isAddSource = false
      this.form = {
        appointmentType: 1,
        appointmentResourceId: '',
        appointmentResourceName: '',
        appointmentResourceType: '',
        appointmentDate: '',
        appointmentStarttime: '',
        appointmentEndtime: '',
        benefitId: '',
        discount: '',
        discountCard: 0,
        deptId: '',
        deptName: '',
        jiuZhenCard: '',
        medicalRecordBook: '',
        medicalInsuranceType: '1',
        id: '',
        isAppointResource: 1,
        isMedicalInsurance: 0,
        isPhysicalExamination: '',
        isTodayAppoint: true,
        isUrgent: 0,
        organId: '',
        organName: '',
        patient: '',
        patientId: '',
        patientName: '',
        resourceId: '',
        resourceName: '',
        resourceType: '',
        symptom: '',
        shopSetItemId: -1,
        subsequentVisit: 0,
        serviceid: '',
        serviceId: '',
        servicePrice: 0,
        serviceTimesliceDto: true,
        visitNumber: ''
      }
      this.$nextTick(() => {
        return this.$refs.form && this.$refs.form.resetFields()
      })
    },
    resetResource () {
      if (this.selectDept) {
        this.selectDept.isSource = false
      }
    },
    resetSource (val) {
      this.resource = val
    },
    registerValidate (callback) {
      let condition = this.form.id ? [7] : [2, 4, 7]
      if (!this.form.patient.anonymous) {
        condition = condition.concat([9, 11])
      }
      this.api.appointValidate({
        conditionIds: condition,
        patient: {
          patientId: this.form.patient.id,
          patientPhone: this.form.patient.mobile,
          patientSex: this.form.patient.sex,
          patientAge: this.form.patient.age
        },
        info: {
          appointmentDate: this.form.appointmentDate,
          appointmentStarttime: this.form.appointmentStarttime + ':00'
        },
        dept: this.selectDept
      }).then(rs => {
        if (!rs.data[0]) {
          return callback && callback()
        } else {
          this.$confirm(this.createValidateHtml(rs.data), '警告', {
            customClass: 'appvalidate',
            showConfirmButton: !this.isContinueRegister(rs.data),
            dangerouslyUseHTMLString: true,
            confirmButtonText: '继续提交',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback && callback()
          }).catch(() => {
            this.isSubmit = false
          })
        }
      })
    },
    createValidateHtml (data) {
      let html = []
      html.push('<ol>')
      data.map((item, i) => {
        html.push('<li class="' + (!item.isContinue ? 'red' : 'gray') + '">' + item.message + '</li>')
      })
      html.push('</ol>')
      return html.join('')
    },
    isContinueRegister (data) {
      return data.filter(item => {
        return !item.isContinue
      }).length
    }
  },
  components: {
    referrer,
    numberSource,
    deptCascader
  },
  computed: {
    discountPrice () {
      if (this.form.discount !== '' && this.form.servicePrice) {
        return (this.form.servicePrice - this.form.servicePrice * this.form.discount / 100).toFixed(2)
      } else {
        return '0.00'
      }
    }
  }
}
</script>
<style scoped>
#numberform {
  background: #ffffff;
  padding: 10px 10px 0;
  overflow: hidden;
}
#numberform .header {
  margin-bottom: 15px;
  font-size: 14px;
}
#numberform .header strong.title {
  font-size: 14px;
  border-left: 3px solid #1c7bef;
  padding-left: 10px;
  color: #000;
}
#numberform .footer {
  padding: 10px 0;
  border-top: 1px solid #dddddd;
  font-size: 14px;
}
#numberform .footer span {
  margin-right: 10px;
  display: inline-block;
  vertical-align: baseline;
  height: 36px;
  line-height: 36px;
}
#numberform .footer strong {
  font-size: 24px;
  color: #ee4433;
}
#numberform .footer strong.small {
  font-size: 16px;
}
.red {
  color: #ee4433;
  margin-top: -7px;
  margin-bottom: 9px;
  margin-left: 70px;
}
</style>
