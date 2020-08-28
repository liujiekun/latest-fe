<template>
  <div id="appointOpen">
    <div class="warpper_tj">
        <el-row class="table_tj">
          <el-table  v-loading="loading" :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
          <el-table-column prop="catalogue" label="目录" width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="setMealWithin" label="套餐内" width="70">
            <template slot-scope="scope">
              {{scope.row.setMealWithin&&scope.row.setMealWithin=='1'?'是':'否'}}
            </template>
          </el-table-column>
          <el-table-column prop="typeId" label="类型">
            <template slot-scope="scope">
                {{scope.row.typeName}}
                <!-- {{adviceTypeName[scope.row.detailObj.adviceType]}} -->
            </template>
          </el-table-column>
          <el-table-column prop="detailObj.serviceName" label="项目名称" width="120">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="处置内容" :formatter="handleDetail" width="60"></el-table-column>
          <el-table-column show-overflow-tooltip label="数量" prop="itemNum" align="center" width="60">
            <template slot-scope="scope">
                <div v-if="scope.row.itemNum" class="aright">{{scope.row.itemNum}}</div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" label="价格" align="center" width="60">
            <template slot-scope="scope">
                <div v-if="scope.row.price" class="aright">{{scope.row.price}}</div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="priceDis" label="售价" align="center" width="60">
            <template slot-scope="scope">
                <div v-if="scope.row.priceDis" class="aright">{{scope.row.priceDis}}</div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="payStatus" label="支付状态">
            <template slot-scope="scope">
                <span v-if="scope.row.payStatus==0">未支付</span>
                <span v-if="scope.row.payStatus==1">已支付</span>
                <span v-if="scope.row.payStatus==2">新建</span>
                <span v-if="scope.row.payStatus==3">部分支付</span>
                <span v-if="scope.row.payStatus==4">已取消</span>
                <span v-if="scope.row.payStatus==5">已退费</span>
                <span v-if="scope.row.payStatus==6">退费中</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="status" label="预约状态">
            <template slot-scope="scope">
                <span v-if="scope.row.isAppointment===3">已挂号</span>
                <span v-if="scope.row.isAppointment===2">加号</span>
                <span v-if="scope.row.isAppointment===1&&scope.row.adviceType==='799'">已预约</span>
                <span v-if="scope.row.isAppointment===1&&scope.row.adviceType!=='799'">已报到</span>
                <span v-if="scope.row.isAppointment===0">未预约</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dptName" label="开单科室">
            <template slot-scope="scope">
              {{scope.row.dptName?scope.row.dptName:'--'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="体检科室">
            <template slot-scope="scope">
              {{scope.row.detailObj.adviceContent && JSON.parse(scope.row.detailObj.adviceContent)['excuteProvider']?JSON.parse(scope.row.detailObj.adviceContent)['excuteProvider']['name']:'--'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" label="日期" width="160" fixed="right">
            <template slot-scope="scope">
                <el-row v-if="scope.row.adviceType==='799'">
                  <el-date-picker
                  width="80"
                  v-model="scope.row.subDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  @change="changeDate(scope.row,scope.$index)" :disabled="scope.row.isAppointment?true:false">
                  </el-date-picker>
                </el-row>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" label="体检医生"  width="160" fixed="right">
              <template slot-scope="scope">
                <el-select v-model="scope.row.examDoctorObj" value-key="resourceId" clearable placeholder="请选择"
                @change="changeDoctor(scope.row,scope.$index)" v-if="scope.row.adviceType==='799'" :disabled="scope.row.isAppointment?true:false">
                  <el-option
                  v-for="item in scope.row.doctorData"
                  :key="item.resourceId"
                  :label="item.resourceName"
                  :value="item">
                  </el-option>
                </el-select>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="服务"  width="160" fixed="right">
            <template slot-scope="scope">
              <el-row v-if="scope.row.adviceType==='799'">
                <el-select v-model="scope.row.ServieObj" value-key="id" clearable placeholder="请选择服务" :disabled="scope.row.isAppointment?true:false"  @change="changeServieId(scope.row,scope.$index)">
                    <el-option
                      v-for="item in scope.row.serviceList"
                      :key="item.id"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" label="时间" width="160" fixed="right">
            <template slot-scope="scope">
                <el-row v-if="scope.row.adviceType==='799'">
                  <el-select v-model="scope.row.timeObj" value-key="startTimeStr" clearable placeholder="请选择" :disabled="scope.row.isAppointment?true:false">
                    <el-option
                      v-for="item in scope.row.timeData"
                      :key="item.startTimeStr"
                      :label="item.startTimeStr"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-row>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small"  v-if="scope.row.adviceType&&scope.row.adviceType==='799'&&scope.row.isAppointment===0" @click="addAppoint(scope.row,1)">预约</el-button>
              <el-button size="small"  v-if="scope.row.adviceType&&scope.row.adviceType==='799'&&scope.row.isAppointment===0" @click="addAppoint(scope.row, 2)">加号</el-button>
              <el-button type="danger" size="small"  v-if="scope.row.adviceType&&scope.row.adviceType==='799'&&scope.row.isAppointment===1 || scope.row.isAppointment===2" @click="deleteAppointment(scope.row.id)">取消预约</el-button>
              <el-button type="danger" size="small" v-if="(scope.row.payStatus===1||scope.row.payStatus===6)&&!scope.row.adviceId&&scope.row.adviceType!=='799'" @click="returns(scope.row)" :disabled="scope.row.disabled1">退费</el-button>
              <!-- v-ever-click-once="scope.row.disabled1" -->
              <el-button type="danger" size="small" v-if="scope.row.payStatus===0&&scope.row.setMealWithin===0" @click="deleteProgram(scope.row.id)">取消</el-button>
              <i class="el-icon-edit-outline" @click="itemEdit(scope.row,scope.$index)" v-if="!scope.row.physicalExamVo"></i>
              <confirm @confirm="itemDelete(scope.row,scope.$index)" :msg="'确定要删除吗？'" :iconType="1" v-if="!scope.row.physicalExamVo"></confirm>
            </template>
          </el-table-column>
        </el-table>
        </el-row>
        <el-row class="totalPrice">
            <span style="margin-right: 20px;">套餐内售价：
              <label>￥{{totalPrice4.toFixed(2)}}</label>
            </span>
            <span style="margin-right: 20px;">套餐内应付：
              <label>￥{{totalPrice3.toFixed(2)}}</label>
            </span>
            <span style="margin-right: 20px;">套餐外售价：
              <label>￥{{totalPrice1.toFixed(2)}}</label>
            </span>
            <span style="margin-right: 20px;">套餐外应付：
              <label>￥{{totalPrice2.toFixed(2)}}</label>
            </span>
            <el-button size="medium" type="primary" :disabled="isPay1" @click="pay1">支付</el-button>
        </el-row>
        <el-row class="advice_wrap" v-if="!deptObj.setMealCatalogId==''">
        <prescription
          :filterPlaceholder = "'请输入检查、检验、治疗、手术'"
          :filterAdviceType ="adviceType"
          ref="pres"
          :title="'医嘱内容'"
          :visit-type.number="visitType"
          :show-add="showAdd"
          :init-data.sync="waitSendData"
          :callback-data="callbackData"
          :user-info="baseInfo"
          :is-add-tpl="true"
          @change="showAddEvent"
          @open="openAddEvent"
          @submit="submitEvent"
        ></prescription>
      </el-row>
    </div>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @cancel="cancel"
      @payStatus="payStatus"
    ></paymethodstwo>
     <refund-dialog :dialogVisible.sync='refundVisible' :refundInfo='refundInfo' @establishCallback="establishCallback"></refund-dialog>
  </div>
</template>
<script>
// import waitarea from '@/inpatient/components/waitarea.vue'
import waitarea from '@/inpatient/components/waitarea.outpatient.vue'
import refundDialog from '@/crm/page/packagesale/refunddialog'
import packageapi from '@/crm/store/packageapi.js'
import prescription from '@/inpatient/components/medical.orders/issued.orders'
import disposalContentDialog from '@/crm/page/packagesale/disposalcontentdialog'
import api from '@/medcenter/store/medappointapi'
import examapi from '@/medcenter/store/examappointapi'
import appointapi from '@/arrange/store/appointapi'
import { objSortBy, messageTips } from '@/util/common'
import confirm from '@/card/page/packagemanagement/packageconfirm'
import sysvalue from '@/warehouse/store/sysvalueapi'
// const adviceTypeName = {'300': '耗材', '301': '西药', '302': '中成药', '303': '中药饮片', '304': '中药颗粒', '800': '检查', '801': '检验', '802': '治疗', '2124': '出院', '2125': '手术', '867': '其他', '799': '医事服务'}
export default {
  props: ['deptObj', 'patientObj', 'isBill', 'isPrint', 'settlementId'],
  data () {
    return {
      api,
      examapi,
      packageapi,
      appointapi,
      tableData: [],
      visitType: 1,
      showAdd: true,
      refundVisible: false,
      callbackData: '',
      waitSendData: [],
      baseInfo: '',
      packageDiscount: '',
      directoryName: '',
      editId: '', // 编辑id
      loading: false,
      visible: false,
      disabled1: false,
      disabled2: false,
      // adviceType: '300,800,801,802,867,2125',
      // adviceTypeName: adviceTypeName,
      adviceType: '',
      adviceTypeName: {},
      multipleSelection: [],
      totalPrice1: 0,
      totalPrice2: 0,
      totalPrice3: 0,
      totalPrice4: 0,
      payParams: this.$route.query,
      id: this.$route.query.id ? this.$route.query.id : null,
      params: {},
      orderId: '',
      payVisible: false,
      physicalExamId: '',
      payObj: {
        patientid: '', // 患者id
        settlementId: '', // 结算单id
        settlementNo: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '3', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        paymethodArr: [], // 支付方式
        isValited: true, // 押金是false,费用为true
        payTradeLog: [], // 支付记录
        isDeposit: 0// 是否押金
      },
      refundInfo: {
        patientId: '',
        setMealId: '',
        orderId: '',
        setMealName: '',
        name: '',
        birthday: '',
        sex: '',
        saleManName: '',
        createTime: ''
      },
      fixedService: '2ec3efe7-dd10-4a5b-a036-840e8e7e04ec',
      colNum: 0,
      finalNum: 1,
      isMeal: false,
      refundFee: 0,
      isPay1: false,
      serviceList: [],
      resourceArrangeList: [],
      customerService: this.customerService !== false
    }
  },
  components: {
    waitarea,
    prescription,
    confirm,
    disposalContentDialog,
    refundDialog
  },
  watch: {
    '$route.query': { // 监控路由
      handler: function (query) {
      },
      immediate: true
    },
    'deptObj': {
      handler: function (val) {
        if (val) {
          this.params = {
            physicalExamId: this.physicalExamId, // 主键id
            setMealCatalogId: this.deptObj.setMealCatalogId// 目录id
          }
          if (this.params.physicalExamId) {
            this.getBySetMealCatalogId(this.params)
          }
        }
      },
      deep: true
    },
    'tableData': {
      handler: function (val) {
        this.totalPrice2 = 0
        this.totalPrice1 = 0
        this.totalPrice3 = 0
        this.totalPrice4 = 0
        this.isMeal = val.some(v => {
          return v.payStatus === 1 && v.setMealWithin === 0// 有一个套餐内的项目是支付的就可以退费了
        })
        val.forEach(v => {
          // 1、套餐内售价
          if (v && v.payStatus === 0 && v.setMealWithin === 1) {
            this.totalPrice3 += v.priceDis * v.itemNum
          }
          // 2、套餐内应付
          if (v && v.payStatus !== 5 && v.payStatus !== 6 && v.setMealWithin === 1) {
            this.totalPrice4 += v.priceDis * v.itemNum
          }
          // 3、套餐外的售价
          if (v && v.payStatus === 0 && v.setMealWithin === 0) {
            this.totalPrice2 += v.priceDis * v.itemNum
          }
          // 4、套餐外的应付
          if (v.payStatus !== 5 && v.payStatus !== 6 && v.setMealWithin === 0) {
            this.totalPrice1 += v.priceDis * v.itemNum
          }
        })
        this.$emit('getData', this.tableData)
      },
      deep: true
    },
    'totalPrice2': {
      handler: function (val) {
        if (!val || val <= 0) {
          this.isPay1 = true
        } else {
          this.isPay1 = false
        }
      },
      immediate: true
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(result => {
      let adviceType = []
      for (let item of result) {
        this.adviceTypeName[item.id] = item.name
        adviceType.push(item.id)
      }
      this.adviceType = adviceType.join(',')
    })
    this.physicalExamId = this.$route.query && this.$route.query.id
    this.params = {
      physicalExamId: this.physicalExamId, // 主键id
      setMealCatalogId: ''// 目录id
    }
    this.getBySetMealCatalogId(this.params)
  },
  methods: {
    // 退费
    returns (row) {
      this.refundInfo.orderId = row.orderId
      this.refundInfo.setMealId = this.patientObj.setMealId
      this.refundInfo.setMealName = this.patientObj.setMealName
      this.refundInfo.name = this.patientObj.patientName
      this.refundInfo.birthday = this.patientObj.birthday
      this.refundInfo.sex = this.patientObj.patientSex
      this.refundInfo.saleManName = this.patientObj.saleManName
      this.refundInfo.createTime = row.createTime
      this.refundInfo.patientId = this.patientObj.patientId
      this.refundVisible = true
    },
    // 退费成功的回调
    establishCallback (val) {
      if (val) {
        this.getBySetMealCatalogId(this.params)
      }
    },
    // 取消套餐外的项目
    deleteProgram (val) {
      this.examapi.deleteProgram({id: val}).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '取消成功')
          this.getBySetMealCatalogId(this.params)
        }
      })
    },
    // 取消预约医师服务
    deleteAppointment (val) {
      this.examapi.deleteAppointment({id: val}).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '取消预约成功')
          this.getBySetMealCatalogId(this.params)
        }
      })
    },
    // 预约医师服务
    addAppoint (val, addType) {
      let params = {
        id: val.id,
        payStatus: val.payStatus,
        status: val.status,
        subDate: val.subDate,
        orderId: val.orderId,
        orderItemId: val.orderItemId,
        serviceId: val.ServieObj.id,
        visitServiceName: val.ServieObj.name,
        addType: addType
      }
      if (val && val.examDoctorObj && val.examDoctorObj.resourceId && val.examDoctorObj.resourceName) {
        params.examDoctorId = val.examDoctorObj.resourceId
        params.examDoctor = val.examDoctorObj.resourceName
      } else {
        params.examDoctorId = null
        params.examDoctor = null
      }
      if (val && val.timeObj && val.timeObj.startTimeStr && val.timeObj.endTimeStr) {
        params.subTime = val.timeObj.startTimeStr
        params.appointmentEndtime = val.timeObj.endTimeStr
      } else {
        params.subTime = null
        params.appointmentEndtime = null
      }
      if (val.detailObj && val.detailObj.adviceContent && JSON.parse(val.detailObj.adviceContent)['excuteProvider']) {
        params.deptId = JSON.parse(val.detailObj.adviceContent)['excuteProvider']['id']
        params.deptName = JSON.parse(val.detailObj.adviceContent)['excuteProvider']['name']
      }
      params.patientId = this.payParams.patientId
      this.examapi.addAppointment(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '预约成功')
          this.getBySetMealCatalogId(this.params)
        }
      })
    },
    goPay () {
      let _query = 'patientId=' + this.payParams.patientId + '&deptId=29' + '&returnFlag=1' + '&visitNumber=' + this.payParams.examineSn + '&sid=0' + '&status=0' + '&ordertype=1'
      let _url = this.$ever.rcmIndex + '/rcm/outpatientfee/peddingsettlement?' + _query
      window.open(_url, '_blank')
    },
    async pay1 () {
      this.isPay1 = true
      if (this.totalPrice2 <= 0) {
        return
      }
      let res = await this.api.createMealOutItemOrder({id: this.physicalExamId})
      let settlement = await packageapi.oneStepSettle(res.data)
      let row = res.data
      this.curId = row.orderId
      // 患者id
      this.payObj.patientid = row.patientId
        // 结算单id
      this.payObj.id = settlement.data.settlementBillId
        // 结算单号
      this.payObj.settleCode = settlement.data.settlementBillCode
        // 还需支付
      this.payObj.unexefee = row.payPrice
        // 已收金额
      this.payObj.exefee = 0
        // 总额
      this.payObj.totalFee = row.totalPrice
      this.payVisible = true
    },
    // 支付成功之后修改订单的支付状态
    payStatus () {
      packageapi.changeStatus({id: this.curId, payStatus: 1}).then(result => {
        if (result.head.errCode === 0) {
          this.payVisible = false
          this.$messageTips(this, 'success', '支付成功')
          // 支付进行报到
          // if (this.isPrint) {
          //   this.createPhysicalInfo()
          // } else {
          //   this.getBySetMealCatalogId(this.params)
          // }
          this.getBySetMealCatalogId(this.params)
        }
      })
    },
    async createPhysicalInfo () {
      let data = this.tableData.filter(v => {
        if (v && !v.adviceId && v.payStatus === 1) {
          if (v.detailObj) {
            v.examineSn = this.patientObj.examineSn || ''
            v.detailObj.patientId = this.patientObj.patientId
            v.detailObj.physicalOrderId = v.id
            v.detailObj.shopSetItemId = v.orderItemId
            v.detailObj.price = v.priceDis
            if (v && v.adviceContent) {
              v.excuteProvider = JSON.parse(v.adviceContent)['excuteProvider']['id']
            }
            v.physicalExamVo = v.detailObj
            return v
          }
        }
      })
      if (data && data[0]) {
        let res = await this.api.createPhysicalInfo(data)
        if (res && res.head.errCode === 0) {
          this.getBySetMealCatalogId(this.params)
        }
      }
    },
     // 关闭弹窗
    cancel () {
      this.payVisible = false
      // this.$emit('establishCallback', true)
    },
    submitEvent (val) {
      this.finalNum = this.finalNum + 1
      this.waitSendData = val
      val[0].newItem = 1
      val[0].adviceId = null
      let detailes = JSON.stringify(this.waitSendList(val))
      val[0].detailes = detailes
      this.$set(val[0], 'subDate', '')
      this.$set(val[0], 'timeObj', {})
      this.$set(val[0], 'examDoctorObj', {})
      this.$set(val[0], 'ServieObj', {}) // 服务
      this.$set(val[0], 'timeData', [])
      this.$set(val[0], 'setMealWithin', '0') // 套餐内外
      this.$set(val[0], 'physicalExamId', this.$route.query.id) // 主键id
      this.$set(val[0], 'payStatus', 0) // 主键id
      this.$set(val[0], 'disabled1', false) // 解决多次点击的问题
      this.$set(val[0], 'typeName', this.adviceTypeName[val[0].adviceType])
      if (this.adviceTypeName[val[0].adviceType]) {
        this.$set(val[0], 'typeName', this.adviceTypeName[val[0].adviceType])
      } else {
        this.$set(val[0], 'typeName', '检查')
      }
      if (this.deptObj.catalogue) {
        this.$set(val[0], 'catalogue', this.deptObj.catalogue)
      } else {
        this.$set(val[0], 'catalogue', '根目录')
      }
      if (this.deptObj.setMealCatalogId) {
        this.$set(val[0], 'setMealCatalogId', this.deptObj.setMealCatalogId)
      } else {
        this.$set(val[0], 'setMealCatalogId', '')
      }
      if (this.deptObj.dptId) {
        this.$set(val[0], 'dptId', this.deptObj.dptId)
      }
      if (this.deptObj.dptName) {
        this.$set(val[0], 'dptName', this.deptObj.dptName)
      }
      if (this.deptObj.doctorId) {
        this.$set(val[0], 'doctorId', this.deptObj.doctorId)
      }
      if (this.deptObj.doctorName) {
        this.$set(val[0], 'doctorName', this.deptObj.doctorName)
      }
      // 获取预约医生
      if (val[0].adviceType && val[0].adviceType === '799') {
        this.$set(val[0], 'doctorData', [])
        this.resourceArrangeList = []
        this.appointapi
        .getArrangeResourceList({
          timeTrunkType: 1,
          deptId: val[0].excuteProvider,
          startDate: val[0].subDate || this.$moment().format('YYYY-MM-DD'),
          endDate: val[0].subDate || this.$moment().format('YYYY-MM-DD')
        })
        .then(rs => {
          if (rs.head.errCode === 0) {
            rs.data.map(item => {
              this.resourceArrangeList = this.resourceArrangeList.concat(item.resourceArrangeResultList)
            })
            this.$set(val[0], 'doctorData', this.resourceArrangeList)
          } else {
            this.$set(val[0], 'doctorData', [])
          }
        })
      }
      val[0].detailObj = {}
      let obj = JSON.parse(val[0].detailes)
      for (let flag in obj) {
        obj[flag].map((item, i) => {
          item.index = i
          item.temp = new Date().getTime()
          Object.assign(val[0].detailObj, item)
        })
      }
      this.tableData.push(val[0])
      this.waitSendData = []
      this.totalPrice1 += val[0].priceDis * val[0].itemNum
      val[0].physicalExamId = this.physicalExamId
      this.examapi.createPhysicalExamItem(val[0]).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            message: '保存成功',
            type: 'success'
          })
          this.getBySetMealCatalogId(this.params)
        }
      })
    },
    getBySetMealCatalogId (params) { // 获取体检套餐or目录
      this.api.getBySetMealCatalogId(params).then(rs => {
        this.finalNum = 1
        if (rs && rs.data && rs.data[0]) {
          this.colNum = rs.data.length
          this.tableData = rs.data.map(v => {
            // this.$set(val[0], 'typeName', this.adviceTypeName[item.adviceType])
            if (this.adviceTypeName[v.adviceType]) {
              v.typeName = this.adviceTypeName[v.adviceType]
            } else {
              v.typeName = '检查'
            }
            v.disabled1 = false
            v.timeData = []
            v.serviceList = []
            v.detailObj = {}
            v.timeObj = {
              startTimeStr: v.subTime,
              endTimeStr: v.appointmentEndtime
            }
            v.timeData.push(v.timeObj)
            v.examDoctorObj = {
              resourceId: v.examDoctorId,
              resourceName: v.examDoctor
            }
            this.$set(v, 'doctorData', [v.examDoctorObj])
            v.ServieObj = {
              id: v.visitServiceId,
              name: v.visitServiceName
            }
            this.$set(v, 'serviceList', [v.ServieObj])
            let obj = JSON.parse(v.detailes)
            for (let key in obj) {
              obj[key].map((item, i) => {
                item.index = i
                item.temp = new Date().getTime()
                Object.assign(v.detailObj, item)
                if (v.detailObj && v.detailObj.adviceContent && JSON.parse(v.detailObj.adviceContent)['excuteProvider'] && JSON.parse(v.detailObj.adviceContent)['excuteProvider']['id']) {
                  v.excuteProviderId = JSON.parse(v.detailObj.adviceContent)['excuteProvider']['id']
                }
                if (v.detailObj && v.detailObj.count) {
                  v.count = v.detailObj.count
                }
              })
              if (v && v.payStatus === 0 && v.setMealWithin === 0) {
                this.totalPrice2 += v.priceDis * v.itemNum
              }
              if (v.payStatus !== 5 && v.payStatus !== 6 && v.setMealWithin === 0) {
                this.totalPrice1 += v.priceDis * v.itemNum
              }
              if (v.adviceType && v.adviceType === '799') {
                let params = {
                  serviceId: v.serviceId,
                  deptId: v.excuteProviderId
                }
                this.api.getArrangeResource(params).then(rs => { // 预约的医生
                  if (rs && rs.data) {
                    this.$set(v, 'doctorData', rs.data)
                  } else {
                    this.$set(v, 'doctorData', [])
                  }
                })
              }
            }
            return v
          })
        }
      })
    },
     // 获取医生
    changeDate (row, index) {
      row.examDoctorObj = {}
      row.ServieObj = {}
      row.timeObj = {}
      if (row.subDate) {
        this.tableData[index].doctorData = []
        this.resourceArrangeList = []
        let params = {
          timeTrunkType: 1,
          deptId: row.excuteProviderId,
          startDate: row.subDate || this.$moment().format('YYYY-MM-DD'),
          endDate: row.subDate || this.$moment().format('YYYY-MM-DD')
        }
        this.appointapi.getArrangeResourceList(params).then(rs => {
          if (rs.head.errCode === 0) {
            rs.data.map(item => {
              this.resourceArrangeList = this.resourceArrangeList.concat(
                      item.resourceArrangeResultList
                    )
            })
            this.tableData[index].doctorData = this.resourceArrangeList
          } else {
            this.tableData[index].doctorData = []
          }
        })
      } else {
        this.tableData[index].doctorData = []
      }
    },
    // 获取服务
    changeDoctor (row, index) {
      row.ServieObj = {}
      row.timeObj = {}
      let params = {
        timeTrunkType: 1,
        date: row.subDate || this.$moment().format('YYYY-MM-DD'),
        // organId: this.form.organId,
        deptId: row.excuteProviderId,
        resourceId: row.examDoctorObj.resourceId
      }
      if (params.resourceId && params.deptId && params.date) {
        this.appointapi
        .listServiceRange(params)
        .then(rs => {
          if (rs.head.errCode || !rs.data[0]) {
            return false
          }
          this.tableData[index].serviceList = rs.data.map(item => {
            return { id: item.serviceId, name: item.serviceName }
          })
        })
      }
    },

    // 获取时间
    changeServieId (row, index) {
      // if (!this.resourceId) {
      //   this.errMsg = '请先选择资源/医生'
      //   return false
      // }
      // if (!this.serviceId) {
      //   this.errMsg = '请先选择服务'
      //   return false
      // }
      row.timeObj = {}
      let params = {
        timeTrunkType: 1,
        resourceId: row.examDoctorObj.resourceId,
        serviceId: row.ServieObj.id,
        deptId: row.excuteProviderId,
        date: row.subDate || this.$moment().format('YYYY-MM-DD'),
        customerService: this.customerService !== false,
        forRegister: false,
        channelId: this.channel || 1
      }
      if (params.resourceId && params.date && params.serviceId) {
        this.api.getServiceTimeslieList(params).then(rs => {
          if (rs && rs.data[0]) {
            this.tableData[index].timeData = rs.data
            this.tableData[index].timeObj = {}
          } else {
            messageTips(this, 'warning', '当日该医生无排班，请修改医生或日期')
            this.tableData[index].timeData = []
            this.tableData[index].timeObj = {}
          }
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('otherData', val)
    },
    // 编辑等待区域的医嘱
    editWaitService (items) {
      this.callbackData = items
    },
    // 展开添加医嘱区域
    showAddEvent () {
      this.showAdd = !this.showAdd
    },
    // 展开开医嘱区域
    openAddEvent () {
      this.showAll = false
      this.showSend = true
      this.showAdd = true
    },
    itemEdit (row, index) {
      this.editId = row.id
      let _data = []
      let detailes = JSON.parse(row.detailes)
      for (let flag in detailes) {
        detailes[flag].map((item, i) => {
          item.index = i
          item.temp = new Date().getTime()
          if (row && row.id) {
            item.id = row.id
          }
          _data.push(item)
        })
        this.editWaitService(_data)
      }
      this.tableData.splice(index, 1)
    },
    handleDetail (row) {
      let data = JSON.parse(row.detailes)
      var arrcontent = {}
      if (typeof data !== 'object') {
        data = JSON.parse(data)
      }
      // 显示具体处置内容的时候，看是否有serviceItem,还要看具体的类型
      for (let flag in data) {
        arrcontent = data[flag] && data[flag][0]
      }
      return arrcontent && arrcontent.entrust
    },
    itemDelete (row, index) {
      this.finalNum = this.finalNum - 1
      this.tableData.splice(index, 1)
    },
    waitSendList (val) {
      let obj = {}
      if (!val[0]) {
        return []
      }
      // this.orderByWaitData()
      val = objSortBy(val, 'isMain')
      val.map(v => {
        if (obj[v.adviceId]) {
          obj[v.adviceId].push(v)
        } else {
          obj[v.adviceId] = [v]
        }
      })
      return obj
    }
  }
}
</script>
<style scoped>
#appointOpen{width: 100%; height:100%; display: flex;flex:1;}
.el-input-number--small{width:100px;}
.ordericon{cursor: pointer;}
.el-icon-sort-up{float:left;}
.el-icon-sort-down{float:right;}
.el-popover.ever_popover_confirm .confirm_txt{
  margin: 0;
  padding: 0 0 10px;
  white-space: nowrap;
  font-size: 14px;
}
.el-popover.ever_popover_confirm .confirm_txt  i{
  display: inline-block;
  font-size: 20px;
  color: #1c7bef;
  margin-right:5px;
  vertical-align: middle;
}
.el-popover.ever_popover_confirm .confirm_txt   span{
  display: inline-block;
  vertical-align: middle;
}
.el-popover.ever_popover_confirm .confirm_txt .el-button {
  padding: 5px 10px;
}
#appointOpen /deep/ .el-input-group__append{
  padding: 0 5px;
}
#appointOpen /deep/ .el-input-number__increase, #appointOpen /deep/ .el-input-number__decrease{
  width: 20px;
}
#appointOpen .totalPrice span>label{
    font-size: 20px;
    font-weight: bold;
    color:#e43!important;
}
#appointOpen .el-date-editor.el-input, .el-date-editor.el-input__inner{width:140px;}
.table_exam td{border:1px #000000 solid;}
.table_exam{border-collapse:collapse;}
.aright{text-align:right;}
#appointOpen /deep/ .issued_orders_wrap .gray{font-size:14px;}
#appointOpen .advice_wrap{background:#ffffff;margin-top: 10px;padding:10px;}
.warpper_tj{height:100%;display: flex;flex:1;flex-direction:column;overflow: hidden;}
.table_tj{background:#ffffff;padding:0 10px;flex:1;overflow: auto;}
.totalPrice{text-align: right;background:#ffffff;padding:10px;}
</style>
