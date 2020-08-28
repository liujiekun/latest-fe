<template>
  <div id="medAppoint">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list(true)"
          :is-query="true"
          :inline="true"
        >
          <template slot="patientName">
            <ever-patient-select
              v-model="queryObj.patientName"
              :allow-create="true"
              @select="selectPatient"
            ></ever-patient-select>
          </template>
          <template slot="daterange">
            <ever-range-picker
              :start.sync="queryObj.startTime"
              :end.sync="queryObj.endTime"
              @change="list(true)"
            ></ever-range-picker>
          </template>
          <template slot="companyName">
            <el-select
              v-model="queryObj.companyName"
              placeholder="请选择往来单位"
              clearable
              filterable
              @change="list(true)"
            >
              <el-option
                v-for="(item, i) in companyData"
                :key="i"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </template>
        </ever-form2>
        <div class="main-option">
          <el-button size="medium">
            <a
              class="cGray"
              v-if="hnFlag === '2'"
              :href="this.$ever.crmIndex + '/crm/HnMemberadd'"
              target="_blank"
            >患者建档</a>
            <a
              class="cGray"
              v-if="hnFlag === '1'"
              :href="this.$ever.crmIndex + '/crm/memberadd'"
              target="_blank"
            >患者建档</a>
          </el-button>
          <el-button size="medium" type="primary" @click="goBatchOrder">批量下单</el-button>
          <el-button size="medium" type="primary" @click="establish">下单</el-button>
        </div>
      </div>
      <el-table v-loading.body="loading" highlight-current-row :data="tableData" border>
        <el-table-column prop="patientName" label="姓名" width="140"></el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="scope" v-if="scope.row.patientSex">
            <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column label="出生日期">
          <template slot-scope="scope">{{ scope.row.birthday | formatDateByExp('YYYY-MM-DD') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" label="手机号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="idNo" label="身份证号码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="buyTime" label="购买时间">
          <template
            slot-scope="scope"
          >{{ scope.row.buyTime | formatDateByExp('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="setMealName" label="套餐名称" width="260"></el-table-column>
        <el-table-column show-overflow-tooltip prop="companyName" label="往来单位" width="260"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="date"
          label="操作"
          width="180"
          align="left"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push({ name: 'meddetail', query: scope.row})"
            >详情</el-button>
            <el-button
              type="danger"
              size="small"
              v-if="scope.row.payStatus===0"
              @click="cancelAppoint(scope.row)"
            >取消</el-button>
            <el-button
              type="danger"
              size="small"
              v-if="scope.row.ifRefund&&!scope.row.companyName"
              @click="returns(scope.row)"
            >退费</el-button>
            <el-button type="danger" size="small" v-if="scope.row.ifPay" @click="pay(scope.row)">支付</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <!-- 退费弹窗 -->
    <refund-dialog
      :dialogVisible.sync="refundVisible"
      :refundInfo="refundInfo"
      @establishCallback="establishCallback"
    ></refund-dialog>
    <!-- 下单弹窗 -->
    <establish-package-order
      :dialogVisible.sync="paydialogVisible"
      :initoptions="options"
      @establishCallback="establishCallback"
      :isMedcenter="true"
      @closePayLogCallback="closePayLogCallback"
    ></establish-package-order>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @cancel="cancelLog"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
    ></paymethodstwo>
  </div>
</template>
<script>
import api from '@/medcenter/store/medappointapi'
import packageapi from '@/crm/store/packageapi.js'
import examapi from '@/medcenter/store/examappointapi'
import sourcedetailapi from '@/arrange/store/sourcedetailapi'
import list from '@/util/list'
import sourceapi from '@/arrange/store/sourceapi'
import refundDialog from '@/crm/page/packagesale/refunddialog'
import establishPackageOrder from '@/crm/page/packagesale/establishpackageorder'
import selectInquireList from '@/warehouse/util/selectinquirelist'
let querySchema = [
  {
    name: 'patientName',
    placeholder: '输入患者姓名',
    comp: 'custom',
    label: '患者',
    options: []
  },
  {
    name: 'daterange',
    label: '预约时间',
    comp: 'custom', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
    span: 24
  },
  {
    name: 'companyName',
    label: '往来单位',
    comp: 'custom', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
    span: 24
  }
  // {
  //   name: 'companyName',
  //   comp: 'select',
  //   label: '往来单位',
  //   valueKey: 'value',
  //   props: {
  //     options: [
  //     ],
  //     placeholder: '请选择往来单位',
  //     clearable: true,
  //     useValue: true
  //   }
  // }
]
export default {
  mixins: [list, selectInquireList],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.startTime = ''
    queryObj.endTime = ''
    querySchema.patientName = ''
    return {
      api,
      packageapi,
      sourceapi,
      examapi,
      sourcedetailapi,
      show: true,
      loading: true,
      deptList: [],
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
      queryObj,
      querySchema,
      obj: {},
      currentRow: {},
      refundVisible: false,
      paydialogVisible: false,
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
      curId: '',
      payVisible: false,
      companyData: [],
      options: {
        zfzt: [
          { id: '', name: '全部' },
          { id: '1', name: '已付' },
          { id: '2', name: '未付' },
          { id: '3', name: '部分支付' }
        ],
        tf: [
          { id: '', name: '全部' },
          { id: '1', name: '未退费' },
          { id: '2', name: '全部退费' },
          { id: '3', name: '部分退费' }
        ],
        xsbm: [],
        xsy: []
      },
      hnFlag: this.$ever.getClinicConfig().memberModel
    }
  },
  watch: {
    'queryObj.patientName': {
      handler: function (val, oldval) {
        if (!val) {
          this.queryObj.patientId = ''
          this.list(true)
        }
      }
    }
  },
  created () {
    this.initOtions()
    this.getInsurance()
  },
  methods: {
    selectPatient (val) {
      if (val && val.id) {
        this.queryObj.patientId = val.id
        this.list(true)
      }
    },
    closePayLogCallback () {
      this.list()
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    // 支付成功回掉
    payStatus () {
      // this.$messageTips(this, 'success', '支付成功')
      packageapi.changeStatus({ id: this.curId, payStatus: 1 }).then(result => {
        if (result.head.errCode === 0) {
          this.payVisible = false
          // this.query()
          // this.payPrint({id: this.curId})
          this.$messageTips(this, 'success', '支付成功')
          this.list()
        }
      }) // 支付成功之后修改订单的支付状态
    },
    // 关闭弹窗
    cancelLog () {
      this.payVisible = false
    },
    async pay (row) {
      let order = await packageapi.orderPay({ id: row.orderId })
      let settlement = await packageapi.oneStepSettle(order.data)
      this.curId = row.orderId
      // 患者id
      this.payObj.patientid = row.patientId
      // 结算单id
      this.payObj.id = settlement.data.settlementBillId
      // 结算单号
      this.payObj.settleCode = settlement.data.settlementBillCode
      // 还需支付
      this.payObj.unexefee = row.totalPriceDis
      // 已收金额
      this.payObj.exefee = 0
      // 总额
      this.payObj.totalFee = row.totalPriceDis
      this.payVisible = true
    },
    establish () {
      this.paydialogVisible = true
    },
    initOtions () {
      this._sentenceSelect(true).then(res => {
        this.options.xsbm = res
      })  // 获取部门列表
      this.packageapi.getStaffList().then(result => {
        this.options.xsy = result.data
      })// 获取员工列表
    },
    establishCallback (val) {
      if (val) {
        this.list()
      }
    },
    goDetail () {
    },
    goBatchOrder () {
      this.$router.push({ path: '/medcenter/batchorder' })
    },
    cancelAppoint (row) {
      this.$confirm('确定是要取消此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.examapi.deletephysicalExam({ orderId: row.orderId }).then(result => {
          if (result.head.errCode === 0) {
            this.$notify({
              message: '取消成功',
              type: 'success'
            })
            this.list()
          }
        })
      })
    },
    returns (row) {
      this.refundInfo.orderId = row.orderId
      this.refundInfo.setMealId = row.setMealId
      this.refundInfo.setMealName = row.setMealName
      this.refundInfo.name = row.patientName
      this.refundInfo.birthday = row.birthday
      this.refundInfo.sex = row.patientSex
      this.refundInfo.saleManName = row.saleManName
      this.refundInfo.createTime = row.createTime
      this.refundInfo.patientId = row.patientId
      this.refundVisible = true
    },
    resetPatient () {
      this.queryObj.date = ''
      this.queryObj.patientName = ''
      this.queryObj.startTime = ''
      this.queryObj.endTime = ''
      this.queryObj.contactUnit = ''
      this.queryObj.patient = {
        agebirthday: '',
        name: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: ''
      }
    },
    getInsurance () {
      this.packageapi.getInsurance().then(rs => {
        for (var insur of rs.data) {
          insur.name = insur.insuranceOrgCnName
          insur.id = String(insur.id)
        }
        if (rs && rs.data) {
          this.companyData = rs.data
        }
      })
    }
  },
  components: {
    refundDialog,
    establishPackageOrder
  }
}
</script>
<style scoped>
#medAppoint .cBlue {
  color: #1c7bef;
}
#medAppoint .cGray {
  color: #606266;
}
#medAppoint .cWhite {
  color: #ffffff;
}
/* #medAppoint .inspect{margin-top:10px;}
#medAppoint .cBlue{color:#1C7BEF;}
#medAppoint .inspect_bot{margin-top: 10px;}
#medAppoint h4{margin:0px 0px 0px 0px;border-left:3px solid transparent;padding:4px;}
#medAppoint .lh40{line-height: 40px;}
#medAppoint .final{font-size: 12px;color: #666666;}
#medAppoint .layout_inner /deep/ .el-form--inline .el-form-item__content{width:100%!important;}
#medAppoint .appoint_title{margin-bottom: 10px;}
#medAppoint .appoint_title .el-col:nth-child(2){text-align:right;}
#medAppoint .cGray{color:#606266;}
#medAppoint .cWhite{color:#FFFFFF;} */
/* #medAppoint .appoint_title{height:36px;line-height: 36px;} */
</style>

