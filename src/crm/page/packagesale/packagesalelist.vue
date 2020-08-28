<template>
  <div>
    <ever-bread-crumb
      v-if="pathTo"
      name="返回"
      showTitle="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="obj"
          ref="form"
          labelWidth="140px"
          label-position="right"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="tc">
            <el-autocomplete
              v-model="obj.tc"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            ></el-autocomplete>
          </template>
          <template slot="patientInfo">
            <ever-patient-select-query
              v-model="obj.patientInfo"
              @input="infoChange"
              ref="inputSeach"
              :disabled="$route.query.patientId ? true : false"
            >
            </ever-patient-select-query>
          </template>
          <template slot="payStatus">
            <el-select
              v-model="obj.payStatus"
              placeholder="请选择"
              clearable
              :disabled="$route.query.patientId?true:false">
              <el-option
                v-for="item in PAYMENT_STATUS"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="refundStatus">
            <el-select
              v-model="obj.refundStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in options.tf"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <!-- <template slot="saleMan">
            <el-select
              v-model="obj.saleMan"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in options.xsy"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template> -->
          <template slot="default">
            <el-form-item>
              <el-button @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button type="primary" @click="exportOrder">导出订单</el-button>
              <el-button type="primary" @click="establish">下单</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
<!-- 【ever-table】使用ever-table替换el-table-->
<!--      <ever-table-->
<!--        :columns="columns" 渲染表格的列-->
<!--        border 表格是否需要竖边框-->
<!--        :url="url" 查询表格数据的url 在urls.js中定义一个url-->
<!--        :is-auto-height="true" 是否为自适应高度的表格 【效果：表头固定，身体自动撑满剩余高度，并出现滚动条】-->
<!--        :params="params" 查询表格的参数-->
<!--        :config-option="configOption" 表格是否需要配置-->
<!--        @eventChange="eventChange"-->
<!--      ></ever-table>-->
      <ever-table
        :columns="columns"
        border
        :url="url"
        :is-auto-height="true"
        :params="params"
        :config-option="configOption"
        @eventChange="eventChange"
        ref="table"
      ></ever-table>
    </div>
    <el-dialog
      title="套餐打印"
      :visible.sync="printLogVisibile"
      width="80%"
      class="order ui_dialog_02 spe"
      v-loading="loading"
    >
      <div class="scoll">
        <el-row class="refund-row">
          <el-col :span="24">
            <el-radio
              v-model="printType"
              :label="1"
            >套餐支付收据</el-radio>
            <el-radio
              v-model="printType"
              :label="2"
              v-if="printRefund"
            >退费收据总表</el-radio>
            <el-radio
              v-model="printType"
              :label="3"
              v-if="printRefund"
            >退费收据明细</el-radio>
          </el-col>
        </el-row>
        <el-table
          :data="printData"
          style="width: 100%"
          border
          ref="multipleTable"
        >
          <el-table-column
            prop="setMealName"
            align="center"
            label="套餐名称"
          ></el-table-column>
          <el-table-column
            prop="money"
            align="center"
            label="金额"
          ></el-table-column>
          <el-table-column
            prop="operateTime"
            label="时间"
          ></el-table-column>
          <el-table-column
            prop="operateName"
            align="center"
            label="操作员"
          ></el-table-column>
          <el-table-column
            prop="itemNum"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="logRowPrint(scope.row)"
              >打印</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      class="refund-dialog"
      :close-on-click-modal="false"
      :title="'请输入授权密码'"
      :visible.sync="settlementObj.passwordLog"
      width="30%"
    >
      <span class="detail-log">
        <el-row>
          <el-col :span="24">
            <el-input
              placeholder="请输入授权密码"
              type="password"
              v-model="settlementObj.password"
              :maxlength="6"
            ></el-input>
          </el-col>
        </el-row>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitPassword"
        >提 交</el-button>
      </span>
    </el-dialog>
    <establish-package-order
      :dialogVisible.sync="paydialogVisible"
      :infoInputFocus="true"
      :isReturnInfos="false"
      :initoptions="options"
      @establishCallback="establishCallback"
      @closePayLogCallback="establishCallback"
    ></establish-package-order>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @cancel="cancelLog"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
    ></paymethodstwo>
    <refund-dialog
      :dialogVisible.sync="refundVisible"
      :refundInfo="refundInfo"
      @establishCallback="establishCallback"
    ></refund-dialog>
    <DRP-dialog
      ref="drpDialog"
      :headerObj="patientObj"
      :isRefresh="true"
      @refresh-status="handleRefreshStatus"
    ></DRP-dialog>
  </div>
</template>

<script>
import api from '../../store/packageapi.js'
import establishPackageOrder from './establishpackageorder'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import refundDialog from './refunddialog'
import { STATUS_OF_USE, PREGNANCY_TEST_PACKAGE, BILLING_STATUS, listDestValue, everprint } from '@/util/common'
import DRPDialog from '@/rcm/page/components/drpdialog'
import moment from 'moment'
import { CRM_PACKAGESALELIST, tableColWidth } from '@/util/table-config'
import urlMap from '@/util/urls'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import urls from '@/card/urls'
import req from '@/util/req'

let querySchema = [
  {
    label: '套餐名称',
    name: 'tc',
    comp: 'custom'
  },
  {
    label: '患者',
    name: 'patientInfo',
    comp: 'custom'
  },
  {
    name: 'orderTime',
    label: '下单时间',
    comp: 'el-date-picker',
    props: {
      type: 'datetimerange',
      'range-separator': '至',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    name: 'payTime',
    label: '支付时间',
    comp: 'el-date-picker',
    props: {
      type: 'datetimerange',
      'range-separator': '至',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    label: '套餐分类',
    name: 'setmealType',
    comp: 'sys-type',
    props: {
      code: 'THC_MEAL_CLASSIFY_CODE',
      placeholder: '套餐分类'
    }
  },
  {
    name: 'useStatus',
    label: '使用',
    comp: 'ever-select',
    props: {
      options: STATUS_OF_USE
    }
  },
  {
    label: '支付状态',
    name: 'payStatus',
    comp: 'custom'
  },
  {
    label: '退费',
    name: 'refundStatus',
    comp: 'custom'
  },
  {
    label: '销售员',
    name: 'saleMan',
    comp: 'ever-staff-select',
    props: {
      fields: 'id',
      clearable: true,
      type: 'select'
    }
  },
  {
    name: 'saleChannel',
    label: '销售渠道',
    comp: 'ever-select',
    props: {
      options: [
        {
          id: 1,
          name: '院内销售'
        },
        {
          id: 2,
          name: '商城销售'
        }
      ],
      clearable: true,
    }
  },
]
export default {
  mixins: [selectInquireList],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    obj.orderTime = [moment(new Date().getTime() - 2592000000).format('YYYY-MM-DD HH:mm:ss'), moment(new Date().getTime() + 86400000).format('YYYY-MM-DD HH:mm:ss')]
    obj.orderCreateTimeEnd = moment(new Date().getTime() + 86400000).format('YYYY-MM-DD HH:mm:ss')
    obj.orderCreateTimeStart = moment(new Date().getTime() - 2592000000).format('YYYY-MM-DD HH:mm:ss')
    obj.payTime = []
    obj.chargeTimeEnd = ''
    obj.chargeTimeStart = ''
    obj.setMealId = ''
    obj.patientId = ''
    return {
      paydialogVisible: false,
      printLogVisibile: false,
      payVisible: false,
      refundVisible: false,
      loading: false,
      obj,
      curId: '',
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
      querySchema,
      printDataAll: {},
      printData: [],
      printType: 1,
      printRefund: true,
      time: null,
      PAYMENT_STATUS: [
        { id: '', name: '全部' },
        { id: '1', name: '已付' },
        { id: '2', name: '未付' }
      ],
      options: {
        tf: [
          { id: '', name: '全部' },
          { id: '1', name: '未退费' },
          { id: '2', name: '全部退费' },
          { id: '3', name: '部分退费' }
        ]
        // xsbm: [],
        // xsy: []
      },
      oldInfoPatientId: '',
      STATUS_OF_USE,
      current: Number(this.$route.query.page) || 1,
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      pageSizes: [10, 20, 30, 50, 100],
      statusDRP: false,
      pathTo: this.$route.query.patientId,
      BILLING_STATUS, // 结算状态arr
      settlementObj: {
        passwordLog: false,
        id: '',
        password: '',
        initialPassword: ''
      },
      PREGNANCY_TEST_PACKAGE,
      patientObj: {
        patientName: '',
        sexName: '',
        birthday: ''
      },
      // 【ever-table】编写columns
      // 特殊列，需要根据条件添加到columns中
      settlementStatusColumn: {
        prop: 'settlementStatus',
        label: '结算',
        width: tableColWidth.name3W65,
        formatter: ({ value }) => listDestValue(BILLING_STATUS, +value)
      },
      columns: [
        {
          prop: 'setMealName',
          label: '套餐名称',
          showOverflowTooltip: true,
          type: 'link',
          urlFormatter: ({ row }) => {
            return this.$router.options.routes[0].name === 'card' ? `/card/packorderdetail/${row.id}` : `/kanban/orderdetails/${row.id}`
          },
          width: tableColWidth.w300
        },
        {
          prop: 'setMealTypeName',
          label: '套餐分类',
          width: tableColWidth.name4W80
        },
        {
          prop: 'patientNumber', // 即使是使用了formatter渲染数据，也需要指定一个唯一的prop
          label: '患者编号',
          width: tableColWidth.w150,
          formatter: ({ row }) => row.patient && row.patient.patientNumber !== 'temporary' ? row.patient.patientNumber : ''
        },
        {
          prop: 'patientName',
          label: '患者姓名',
          width: tableColWidth.name7W120,
          formatter: ({ row }) => row.patient ? row.patient.name : ''
        },
        {
          prop: 'birthday',
          label: '出生日期',
          width: tableColWidth.dateW105,
          formatter: ({ row }) => (row.patient && row.patient.birthday ? row.patient.birthday : '').split(' ')[0]
        },
        {
          prop: 'gender',
          label: '性别',
          width: tableColWidth.name2W54,
          type: 'component',
          component: {
            prop: 'changexxx',
            name: 'sysValue',
            code: 'patient.sex',
            type: 'GBT.2261.1',
          }
        },
        // 根据 statusDRP 的值插入 结算 列
        {
          prop: 'payStatusChs',
          label: '支付',
          width: tableColWidth.name2W54
        },
        {
          prop: 'useStatus',
          label: '使用',
          width: tableColWidth.name3W65,
          formatter: ({ value }) => listDestValue(STATUS_OF_USE, +value)
        },
        {
          prop: 'refundStatusChs',
          label: '退费',
          width: tableColWidth.name4W80,
        },
        {
          prop: 'totalPrice',
          label: '原价',
          width: tableColWidth.name6W105,
          align: 'right',
          formatter: ({ value }) => this.$filters.formatToFinacial(value)
        },
        {
          prop: 'totalPriceDis',
          label: '售价',
          width: tableColWidth.name6W105,
          align: 'right',
          formatter: ({ value }) => this.$filters.formatToFinacial(value)
        },
        {
          prop: 'usedPriceDis',
          label: '已用金额',
          width: tableColWidth.name6W105,
          align: 'right',
          formatter: ({ value }) => this.$filters.formatToFinacial(value)
        },
        {
          prop: 'leftPriceDis',
          label: '剩余金额',
          width: tableColWidth.name6W105,
          align: 'right',
          formatter: ({ value }) => this.$filters.formatToFinacial(value)
        },
        {
          prop: 'saleManName',
          label: '下单人员',
          width: tableColWidth.name7W120,
        },
        {
          prop: 'saleChannel',
          label: '销售渠道',
          formatter ({ value }) {
            const obj = {1: '院内销售', 2: '商城销售'}
            return obj[value]
          }
        },
        {
          prop: 'tollCollectorName',
          label: '收费员',
          width: tableColWidth.name7W120,
        },
        {
          prop: 'itemNumFinished',
          label: '已开方',
          width: tableColWidth.name3W65,
        },
        {
          prop: 'createTime',
          label: '下单时间',
          width: tableColWidth.datetimeAllW160,
        },
        {
          prop: 'chargeTime',
          label: '支付时间',
          width: tableColWidth.datetimeAllW160,
        },
        {
          prop: 'limitUseDate',
          label: '使用期限',
          width: tableColWidth.datetimeAllW160,
        },
        // 按钮组
        {
          prop: 'ever-op',
          label: '操作',
          width: tableColWidth.w220,
          type: 'btns',
          undraggable: true,
          fixed: 'right',
          btns: ({ row }) => {
            const result = []
            if (+row.payStatus === 1) {
              result.push({
                prop: 'payPrint',
                label: '打印',
                type: 'success'
              })
            }
            if (+row.payStatus === 2) {
              result.push(
                {
                  prop: 'pay',
                  label: '支付',
                  type: 'primary'
                },
                {
                  prop: 'cancel',
                  label: '取消',
                  type: 'danger'
                }
              )
            }
            if (+row.settlementStatus === BILLING_STATUS[0].id && row.setMealType === PREGNANCY_TEST_PACKAGE) {
              result.push({
                prop: 'handleSettlement',
                label: '产房结算',
                type: 'primary'
              })
            }
            if (+row.settlementStatus === BILLING_STATUS[1].id && row.setMealType === PREGNANCY_TEST_PACKAGE) {
              result.push({
                prop: 'cancelSettlement',
                label: '取消结算',
                type: 'danger'
              })
            }
            return result
          }
        },
      ],
      // 【ever-table】将查询操作转移到ever-table中
      url: urlMap.packageapi.setmealOrder,
      params: {
        _uuid: '',
      },
      configOption: {
        id: CRM_PACKAGESALELIST,
      },
      printPatientId: '',
      receiptCode: 'PACKAGE_CHARGE_PRINT'
    }
  },
  components: {
    establishPackageOrder,
    refundDialog,
    DRPDialog
  },
  created () {
    this.initOtions()
    this.$nextTick(() => {
      this.$refs.inputSeach.$el.querySelectorAll('input.el-input__inner')[0].focus()
    })
  },
  mounted () {
    // 获取查询参数
    this.list()
  },
  watch: {
    'obj.setmealType': {
      handler: function (val, oldval) {
        this.statusDRP = val === PREGNANCY_TEST_PACKAGE
        if (this.statusDRP) {
          // 加上列 settlementStatus
          if (!this.columns.some(item => item.prop === 'settlementStatus')) {
            this.columns.splice(5, 0, this.settlementStatusColumn)
          }
        } else {
          // 去除列 settlementStatus
          this.columns = [...this.columns.filter(item => item.prop !== 'settlementStatus')]
        }
      }
    },
    'obj.patientInfo': {
      handler: function (val, oldval) {
        if (!val) {
          this.obj.patientId = ''
          this.list()
        }
      }
    },
    'obj.tc': {
      handler: function (val, oldval) {
        if (!val) {
          this.obj.setMealId = ''
        }
      }
    },
    'printLogVisibile': {
      handler: function (val, oldval) {
        if (!val) {
          this.printRefund = true
          this.printType = 1
          this.printData = []
        }
      }
    },
    'printType': {
      handler: function (val, oldval) {
        if (val === 1) {
          this.printData = this.printDataAll.payPrintList ? this.printDataAll.payPrintList : []
        } else {
          this.printData = this.printDataAll.refundPrintList ? this.printDataAll.refundPrintList : []
        }
      }
    }
  },
  methods: {
    async exportOrder () {
      const res = await req.request(urls.exportOrder, this.$refs.table.localParams)
      if (res && res.data && res.data.fileId) {
        this.downfile(res.data.fileId)
      }
    },
    downfile (id) {
      this.downUrl = this.$ever.fileUrl + this.$ever.filePath + id
      const tmpId = new Date().getTime()
      const a = document.createElement('a')
      a.setAttribute('id', tmpId)
      a.setAttribute('download', '')
      a.setAttribute('target', '_self')
      a.setAttribute('href', this.downUrl)
      document.body.appendChild(a)
      a.click()
      window.setTimeout(_ => {
        a.parentNode.removeChild(a)
      }, 1000)
    },
    submitPassword () {
      if (this.settlementObj.password !== this.settlementObj.initialPassword) {
        this.$messageTips(this, 'error', '授权密码不正确')
        return
      }
      this.settlementObj.passwordLog = false
      this.settlementObj.password = ''
      api.setMealCancelSettlement({ id: this.settlementObj.id }).then(rs => {
        this.$messageTips(this, 'success', '取消结算成功')
        this.list()
      })
    },
    handleSettlement (row) {
      let sexName = ''
      if (row.patient && row.patient.sex) sexName = this.$filters.formatSex(row.patient.sex)
      Object.assign(this.patientObj, { patientName: row.patient && row.patient.name ? row.patient.name : '', sexName, birthday: row.patient && row.patient.birthday ? row.patient.birthday.split(' ')[0] : '' })
      if (row.patientId) this.$refs.drpDialog.open(row.patientId)
    },
    handleRefreshStatus () {
      this.list()
    },
    cancelSettlement (row) {
      this.settlementObj.id = row.id
      this.settlementObj.passwordLog = true
    },
    infoChange (val) {
      if (val) {
        this.obj.patientId = val
      } else {
        this.obj.patientId = ''
      }
      this.list()
      // this.list()
    },
    payPrint (row) {
      let params = {
        orderId: row.id
      }
      api.getPrint(params).then(res => {
        this.printDataAll = res.data
        this.printData = res.data.payPrintList
        this.printRefund = (row.refundStatus === 2 || row.refundStatus === 3)
        this.printLogVisibile = true
        this.printPatientId = row.patientId
      })
    },
    logRowPrint (row) {
      let code = ''
      let params = {}
      let preview = true
      if (this.printType === 1) {
        code = this.receiptCode
        params = { orderId: row.orderId, id: row.orderId }
      } else if (this.printType === 2) {
        code = 'PACKAGE_REFUND_RECEIPT_SUMMARY'
        params = { orderId: row.orderId, refundTime: row.operateTime, setMealId: row.setMealId, patientId: this.printPatientId }
      } else {
        code = 'PACKAGE_REFUND_RECEIPT_DETAILS'
        params = { orderId: row.orderId, setMealId: row.setMealId, refundTime: row.operateTime, patientId: this.printPatientId }
      }
      try {
        everprint(code, params, {
          preview,
          cb: _ => {
            console.log('打印完成')
          },
          lang: '01'
        })
      } catch (err) { }
    },
    /* 与service.panel.list.vue中有所不同的是，在查询前对参数进行了处理 */
    list (searchFirstPage = false) {
      // 分页参数在ever-table中获取，每次获取新的params时改变_uuid，保证每次点击查询时，即使查询条件没变，也会进行查询
      let params = Object.assign({ _uuid: U() }, this.obj, { searchFirstPage })
      if (this.$route.query.patientId && this.$route.query.patientName) {
        this.obj.patientInfo = this.$route.query.patientName
        params.patientId = this.$route.query.patientId
      }
      if (this.oldInfoPatientId) {
        params.patientId = this.oldInfoPatientId
      }
      params.orderCreateTimeStart = params.orderTime ? params.orderTime[0] : ''
      params.orderCreateTimeEnd = params.orderTime ? params.orderTime[1] : ''
      params.chargeTimeStart = params.payTime ? params.payTime[0] : ''
      params.chargeTimeEnd = params.payTime ? params.payTime[1] : ''
      // 该变params即会进行查询
      this.params = params
    },
    querySearchAsync (queryString, cb) {
      clearTimeout(this.time)
      this.time = null
      this.time = window.setTimeout(_ => {
        api.searchAvailable({
          offset: 0,
          pagesize: 200,
          name: queryString
        }).then(res => {
          let data = this.initData(res.data.resultList)
          cb(data)
        })
      }, 300)
    },
    initData (data) {
      let arr = []
      data.forEach(item => {
        arr.push({ value: item.name, address: item.id })
      })
      return arr
    },
    handleSelect (item) {
      this.obj.setMealId = item.address
    },
    establishCallback (val) {
      if (val && typeof val === 'object') {
        this.oldInfoPatientId = val.id
        this.obj.patientId = val.name
      } else if (val && typeof val === 'boolean') {
      }
      this.list()
    },
    establish () {
      this.paydialogVisible = true
    },
    cancel (row) {
      this.$confirm('确定是要取消此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.changeStatus({ id: row.id, payStatus: 4 }).then(result => {
          if (result.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '取消成功')
          }
        })
      })
    },
    async pay (row) {
      let order = await api.orderPay({ id: row.id })
      let settlement = await api.oneStepSettle(order.data)
      this.curId = row.id
      // 患者id
      this.payObj.patientid = row.patientId
      // 结算单id
      this.payObj.id = settlement.data.settlementBillId
      // 结算单号
      this.payObj.settleCode = settlement.data.settlementBillCode
      // 还需支付
      this.payObj.unexefee = row.orderTotalPriceDis
      // 已收金额
      this.payObj.exefee = 0
      // 总额
      this.payObj.totalFee = row.orderTotalPriceDis
      this.payVisible = true
    },
    // 关闭弹窗
    cancelLog () {
      this.payVisible = false
    },
    // 支付成功回掉
    payStatus () {
      api.changeStatus({ id: this.curId, payStatus: 1 }).then(result => {
        if (result.head.errCode === 0) {
          this.payVisible = false
          this.list()
          this.$messageTips(this, 'success', '支付成功')
          try {
            everprint(this.receiptCode, { orderId: this.curId, id: this.curId }, {
              preview: false,
              cb: _ => {
                console.log('打印完成')
              },
              lang: '01'
            })
          } catch (err) { }
        }
      }) // 支付成功之后修改订单的支付状态
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    initOtions () {
      // 销售部门改为所有可选科室
      // this._sentenceSelect(true).then(res => {
      //   this.options.xsbm = res
      // }) // 获取部门列表
      api.getByCode({ code: 'cacel_settlement' }).then(res => { // 获取取消结算授权码
        this.settlementObj.initialPassword = res.data
      })
    },
    refund (row) {
      this.refundInfo.orderId = row.id
      this.refundInfo.setMealId = row.setMealId
      this.refundInfo.setMealName = row.setMealName
      this.refundInfo.name = row.patient.name
      this.refundInfo.birthday = row.patient.birthday
      this.refundInfo.sex = row.patient.sex
      this.refundInfo.saleManName = row.saleManName
      this.refundInfo.createTime = row.createTime
      this.refundInfo.patientId = row.patient.id
      this.refundVisible = true
    },
    // 【ever-table】添加事件处理
    eventChange ({ row, prop }) {
      this[prop] && this[prop](row)
    }
  }
}
</script>
<style lang="less" scoped>
</style>

