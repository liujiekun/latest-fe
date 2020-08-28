<template>
  <div id="addition">
    <h4>追加体检项目</h4>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="catalogue" label="目录" width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="setMealWithin" label="套餐内" width="70">
        <template
          slot-scope="scope"
        >{{scope.row.setMealWithin&&scope.row.setMealWithin=='1'?'是':'否'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="typeId" label="类型">
        <template slot-scope="scope">{{adviceTypeName[scope.row.detailObj.adviceType]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="detailObj.serviceName" label="项目名称" width="120"></el-table-column>
      <el-table-column show-overflow-tooltip label="处置内容" :formatter="handleDetail" width="60"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="detailObj.count"
        label="数量"
        align="center"
        width="130px"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="detailObj.price" label="价格"></el-table-column>
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
          <span v-if="scope.row.isAppointment===1">已预约</span>
          <span v-if="scope.row.isAppointment===0">未预约</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="dptName" label="开单科室">
        <template slot-scope="scope">{{scope.row.dptName?scope.row.dptName:'--'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop label="体检科室">
        <template
          slot-scope="scope"
        >{{scope.row.detailObj.adviceContent && JSON.parse(scope.row.detailObj.adviceContent)['excuteProvider']?JSON.parse(scope.row.detailObj.adviceContent)['excuteProvider']['name']:'--'}}</template>
      </el-table-column>
    </el-table>
    <div style="padding:20px 0;" v-if="!allDisabled">
      <prescription
        :filterPlaceholder="'请输入检查、检验、治疗、手术'"
        :filterAdviceType="adviceType"
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
    </div>
  </div>
</template>
<script>
import examapi from '@/medcenter/store/examappointapi'
import prescription from '@/inpatient/components/medical.orders/issued.orders'
import { objSortBy } from '@/util/common'
const adviceTypeName = { '300': '耗材', '301': '西药', '302': '中成药', '303': '中药饮片', '304': '中药颗粒', '800': '检查', '801': '检验', '802': '治疗', '2124': '出院', '2125': '手术', '867': '其他', '799': '医事服务' }
export default {
  props: ['allDisabled'],
  data () {
    return {
      adviceTypeName,
      examapi,
      patientId: this.$route.query.patientId,
      activeName: 'form',
      dptId: this.$route.query.dptId,
      visitId: this.$route.query.visitSn,
      schemaId: '',
      formName: '',
      form: {},
      focusField: '',
      examData: [],
      examList: [],
      examType: Number(this.$route.query.examType || this.$route.params.examType),
      warnText: '',
      visitType: 1,
      adviceType: '300,800,801,802,867,2125',
      showAdd: true,
      callbackData: '',
      waitSendData: [],
      baseInfo: '',
      tableData: [],
      multipleSelection: [],
      loading: false,
      visitSn: this.$route.query.visitSn
    }
  },
  components: {
    prescription
  },
  created () {
    this.getBySetMealCatalogId()
  },
  methods: {
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
    handleSelectionChange (val) {
      console.log(val, 'multipleSelection')
      this.multipleSelection = val
      this.$emit('otherData', val)
    },
    addProgram () {
    },
    showAddEvent () {
      this.showAdd = !this.showAdd
    },
    // 展开开医嘱区域
    openAddEvent () {
      this.showAll = false
      this.showSend = true
      this.showAdd = true
    },
    submitEvent (val) {
      console.log(val, '处方信息')
      this.waitSendData = val
      val[0].adviceId = null
      let detailes = JSON.stringify(this.waitSendList(val))
      val[0].detailes = detailes
      this.$set(val[0], 'subDate', '')
      this.$set(val[0], 'timeObj', {})
      this.$set(val[0], 'examDoctorObj', {})
      this.$set(val[0], 'timeData', [])
      this.$set(val[0], 'setMealWithin', '0') // 套餐内外
      this.$set(val[0], 'physicalExamId', this.$route.query.id) // 主键id
      this.$set(val[0], 'payStatus', 0) // 主键id
      this.$set(val[0], 'disabled1', false) // 解决多次点击的问题
      this.$set(val[0], 'visitSn', this.visitSn) // 解决多次点击的问题
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
      this.totalPrice1 += val[0].price * val[0].count
      val[0].physicalExamId = this.physicalExamId
      console.log(this.tableData, 'this.tableData')
      this.examapi.addPhysicalExamItem(val[0]).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.getBySetMealCatalogId()
        }
      })
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
    },
    getBySetMealCatalogId () { // 获取体检套餐or目录
      this.examapi.getAdditionalitems({ visitSn: this.visitSn }).then(rs => {
        this.finalNum = 1
        if (rs && rs.data && rs.data[0]) {
          this.colNum = rs.data.length
          this.tableData = rs.data.map(v => {
            v.disabled1 = false
            v.timeData = []
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
              if (v && v.payStatus === 0) {
                this.totalPrice2 += v.price * v.count
              }
              this.totalPrice1 += v.price * v.count
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
    }
  }
}
</script>
<style scoped>
#addition {
  padding: 0 10px;
}
</style>
