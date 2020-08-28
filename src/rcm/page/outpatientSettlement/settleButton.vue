<!--
 * @Author: renpengfei
 * @Date: 2019-08-12 11:21:51
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-12-03 10:49:57
-->
<template>
  <div class="settleBtn">
    <!--part-return: 部分退条件 -->
    <fee-orders-dialog
      :dialog-show.sync="istrans"
      :base-info="baseInfo"
      :has-tpl="false"
      :fees-type="6"
      :part-return="(data) => data.orderItemStatus === 1"
      workspace="MZSF-001"
    ></fee-orders-dialog>
    <!-- 只有待结算页面才显示补费 -->
    <div class="makeup" v-if="!obj.id && obj.settleStatus == 0">
      <el-button type="primary" size="small" :disabled="!obj.patientid" @click="makeupfee">补费</el-button>
    </div>
    <!-- 医保医疗类别的显示 -->
    <medicalType
      v-if="settleStatus===1&&urlpath==0"
      v-model="medicalType"
      :insuranceOrgId="insuranceOrgId"
    ></medicalType>
    <div class="btnsright" :class="{recollect:obj.recollect}">
      <template v-if="!obj.writeOff">
        <el-button
          @click="listoffeePrint"
          v-if="$hasPermission('Auth_rcm_settlements_listoffeePrint')"
        >费用清单打印</el-button>
        <el-button
          @click="handlePreviousClick"
          v-if="previousButton.includes(settleStatus) && $route.query.settlementid && lastStep(obj)"
          :disabled="obj.loading"
        >上一步</el-button>
        <el-button
          @click="readCard"
          v-if="settleStatus===1&&urlpath==0&&!afterReadCard"
          :disabled="(obj.multipleSelection.length > 0&&!obj.loading) ? false : true"
        >读卡</el-button>
        <el-button
          type="primary"
          v-if="afterReadCard&&obj.settleStatus==1"
          @click="medicalSettle"
        >确认</el-button>
        <el-button
          @click="comfirmzeropay(false)"
          v-if="settlebtn"
          :disabled="(obj.multipleSelection.length > 0&&!obj.loading) ? false : true"
        >结算</el-button>
        <!-- 当前步骤是医保，且状态在预警里面 -->
        <el-button
          v-if="obj.settleStatus==1&&obj.warningStatus>=0"
          @click="hljPreWarningSettle"
        >预警预分解</el-button>
        <!-- 正常的收费单子 -->
        <el-button
          type="primary"
          @click="beforePay"
          v-if="(settleStatus == 0 || settleStatus == 3)&&!obj.recollect&&!obj.returnFlag"
          :disabled="obj.multipleSelection.length > 0&&!obj.loading ? false : true"
        >支付</el-button>
        <el-button
          type="primary"
          @click="refundPay"
          v-if="(settleStatus == 0 || settleStatus == 3)&&(obj.recollect || obj.returnFlag)"
          :disabled="obj.multipleSelection.length > 0&&!obj.loading&&(this.obj.sourceSettlement.payedfee-this.obj.unFee<0)"
        >退款</el-button>
        <el-button
          @click="createPrint(1,false)"
          v-if="(settleStatus == 4 || settleStatus == 6) && obj.requestType === 0 && obj.requestType !== 4 && obj.returnFlag==false"
        >收据打印</el-button>
        <el-button
          @click="createPrint(2,false)"
          v-if="!isHcjk && ((settleStatus == 4 || settleStatus == 6) && obj.allowPrintAgain && obj.requestType !== 0 && obj.requestType !== 4 && obj.returnFlag==false)"
        >收据重打</el-button>
        <el-button
          @click="createPrint(3,false)"
          v-if="!isHcjk && ((settleStatus == 4 || settleStatus == 6) && obj.allowPrintNew && obj.requestType !== 0 && obj.returnFlag==false)"
        >收据补打</el-button>
        <el-button
          plain
          @click="findInvoiceByIds({ id: obj.id })"
          v-if="isJinShui && obj.settleStatus == 4 && isHcjk"
        >国税发票</el-button>
        <!-- sob发起退费 -->
        <el-button
          @click="handleBillrefund"
          v-if="settleStatus == 5 && obj.mergedReceiptData.length > 0"
          :disabled="obj.loading || obj.multipleSelection.length<=0"
        >确认退费</el-button>
      </template>
    </div>
    <div class="settle_needpay">
      <div v-if="obj.recollect" :class="{recollect:obj.recollect}">
        <b>原单总金额：</b>
        <span>¥{{ obj.sourceSettlement.totalFee | formatToFinacial }}</span>
        <template
          v-if="obj.sourceSettlement.comInsuranceDirectFee +
          obj.sourceSettlement.majorAccountFee !=0"
        >
          <b>原单报销金额：</b>
          <span>
            ¥{{
            floatTool.add(
            obj.sourceSettlement.comInsuranceDirectFee,
            obj.sourceSettlement.majorAccountFee
            ) | formatToFinacial
            }}
          </span>
        </template>

        <b>原单优惠金额：</b>
        <span>
          ¥{{
          obj.sourceSettlement.totalBenefit | formatToFinacial
          }}
        </span>
        <b>原单应付金额：</b>
        <span class="cRed">
          ¥{{
          obj.sourceSettlement.payedfee | formatToFinacial
          }}
        </span>
      </div>
      <div :class="{recollect:obj.recollect}">
        <b>医保统筹：</b>
        <span>{{obj.medInsurPubPayFee | formatToFinacial}}</span>
        <b>医保账户：</b>
        <span>{{obj.medInsurOwnPayFee | formatToFinacial}}</span>
        <b>{{ obj.recollect ? "重收" : null }}总金额：</b>
        <span>¥{{ obj.totalFee | formatToFinacial }}</span>
        <template v-if="urlpath!=1">
          <b>{{ obj.recollect ? "重收" : null }}报销金额：</b>
          <span>
            ¥{{
            floatTool.add(obj.comInsuranceDirectFee, obj.majorAccountFee)
            | formatToFinacial
            }}
          </span>
          <b>{{ obj.recollect ? "重收" : null }}优惠金额：</b>
          <span>
            ¥{{
            obj.totalBenefit | formatToFinacial
            }}
          </span>
        </template>
        <b>{{ obj.recollect ? "重收" : null }}{{obj.returnFlag?'应退':'应付'}}金额：</b>
        <span
          class="cRed"
        >¥{{(obj.recollect?(obj.payedfee+obj.memberCardFee):obj.unFee) | formatToFinacial }}</span>
      </div>
      <div v-if="obj.recollect" :class="{recollect:obj.recollect}">
        <b>应退总金额：</b>
        <span>
          ¥{{
          floatTool.subtract(obj.sourceSettlement.totalFee, obj.totalFee)
          | formatToFinacial
          }}
        </span>
        <b>应冲报销金额：</b>
        <span>
          ¥{{
          floatTool.subtract(
          floatTool.add(
          obj.sourceSettlement.comInsuranceDirectFee,
          obj.sourceSettlement.majorAccountFee
          ),
          floatTool.add(obj.comInsuranceDirectFee, obj.majorAccountFee)
          ) | formatToFinacial
          }}
        </span>
        <b>应冲优惠金额：</b>
        <span>
          ¥{{
          floatTool.subtract(
          obj.sourceSettlement.totalBenefit,
          obj.totalBenefit
          ) | formatToFinacial
          }}
        </span>
        <b>应退金额：</b>
        <span class="cRed">
          ¥{{
          floatTool.subtract(
          obj.sourceSettlement.payedfee,
          (obj.payedfee+obj.memberCardFee)
          ) | formatToFinacial
          }}
        </span>
      </div>
    </div>
    <div v-show="false">
      <settlementtemprint :printinfo="obj" id="page1"></settlementtemprint>
    </div>
    <!-- 支付2 -->
    <paymethodstwo
      v-if="paydialogVisible"
      :dialogVisible.sync="paydialogVisible"
      :obj="newpayobj"
      @cancel="cancel"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
      @closedialog="closedialog"
    ></paymethodstwo>
    <!-- 支付1 -->
    <settle-pay-ment-layer
      :obj="newpayobj"
      v-if="layershow"
      :layershow.sync="layershow"
      @getData="getData"
      @closedialog="closedialog"
      @paymentSuccess="paymentSuccess"
      ref="settlepaymentlayer"
    ></settle-pay-ment-layer>
    <!-- 原路退款 -->
    <originalroadrefund
      v-if="refunddialogVisible"
      :refunddialogVisible.sync="refunddialogVisible"
      :paramsObj="refundOriginParams"
      @sureRefund="sureRefund"
    ></originalroadrefund>
    <!-- 医保卡读卡信息弹窗 -->
    <dialogmedicalinfo
      :insuranceOrgId="insuranceOrgId"
      @getMedDetails="getMedDetailsEvent"
      :scence="1"
      ref="medicalinfo"
    ></dialogmedicalinfo>
    <!-- 授权弹窗 -->
    <authorize-log
      ref="authorizelog"
      @confirmCallback="authorizeconfirm"
      :callbackVal="callbackVal"
      :typeCode="typeCode"
      :callbackValue="callbackValue"
      :visitNumber="visitNumber"
      :patientId="patientId"
      :authSettlementid="authSettlementid"
    ></authorize-log>
    <!-- 医保慢病弹窗 -->
    <specialDis
      :specialDis.sync="specialDis"
      :tableData="specialDisList"
      :insuranceOrgId="insuranceOrgId"
      @confirm="specialDisSure"
      :cardParams="obj.personInfo"
    ></specialDis>
  </div>
</template>
<script>
import settlementtemprint from '@/rcm/page/settlement-tem-print'
import { singleConfig, previousButton } from './settleconfig'
import refunddialog from '@/rcm/page/outpatientSettlement/refunddialog.vue'
import originalroadrefund from '@/rcm/page/pay/originalroadrefund'
import dialogmedicalinfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import {
  settleCreate,
  previousSettle,
  getPrint,
  billrefundOrigin,
  confirmRefund,
  refundSettle,
  phyDelete,
  getInsuranceIdByVisitNumber
} from '@/rcm/store/outpatient/outpatient'
import { floatTool } from '@/util/common'
import api from '@/rcm/store/settlementapi'
import medicareapi from '@/rcm/store/medicareapi'
import { frPrint, doPrint, everprint } from '@/util/print.js'
import invoice from '@/rcm/page/invoicemanage/invoice'
import settlePayMentLayer from '@/rcm/page/pay/settlepaymentlayer'
import commonReceiptPrinting from '@/rcm/page/outpatientSettlement/common.receipt.printing'
import AuthorizeLog from './authorize.log'
import authApi from '@/rcm/store/otmdiscomponent/auth.manage.api.js'
// CPOE 补费组件
import FeeOrdersDialog from '@/inpatient/components/fee.orders/fee.dialog'
// 医保公共的医保类型
import medicalType from '@/rcm/otmdiscomponent/medicalType.vue'
// 医保公共的慢病弹窗
import specialDis from '@/rcm/otmdiscomponent/specialdisease.vue'
import { hljybCode, jljhCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
// 黑龙江医保相关的方法通过mixin混入
import hljSettlebutton from '@/rcm/otmdiscomponent/hljmedical/hlj-settlebutton.js'
import jljhSettlebutton from '@/rcm/otmdiscomponent/jljhmedical/jljh-settlebutton.js'
import authorizeInfo from '@/rcm/page/outpatientSettlement/authorizeinfo.js'
export default {
  mixins: [invoice, commonReceiptPrinting, hljSettlebutton, jljhSettlebutton],
  props: {
    settleStatus: {
      type: Number,
      default: 0
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    AuthorizeLog,
    FeeOrdersDialog,
    settlePayMentLayer,
    settlementtemprint,
    refunddialog,
    originalroadrefund,
    dialogmedicalinfo,
    medicalType, // 医疗类别总弹窗
    specialDis // 黑龙江慢病弹窗
  },
  data () {
    return {
      callbackVal: '', // 回调函数的函数名字
      callbackValue: '', // 回调函数的传参
      authorizeInfo: authorizeInfo,
      authSettlementid: null, // 授权弹窗如果是在结算页是免单进入的支付页面，此时已经有的结算单id，需要把该参数传给授权接口
      typeCode: '',
      visitNumber: this.$route.query.visitNumber,
      patientId: this.$route.query.patientId,
      showconfirmbtn: true,
      dialogmedicalinfovisible: false,
      urlpath: this.$route.meta && this.$route.meta.status,
      singleConfig: singleConfig,
      previousButton: previousButton,
      istrans: false,
      tableData: [],
      floatTool: floatTool,
      paydialogVisible: false,
      layershow: false,
      refunddialogVisible: false,
      newpayobj: {
        recollect: this.obj.recollect,
        refundReceiptFlows: [],
        paystatusobj: {
          settlementid: '',
          returnFlag: 0
        },
        writeOffId: '',
        exefee: 0,
        iscallback: true,
        payObj: {
          paymethod: '1',
          remark: '',
          flowfee: '',
          auth_code: '', // 授权码
          qrfee: '' // pos机的金额
        },
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: '1',
        // 结算单id
        id: '',
        loading: false,
        // 总金额
        totalFee: 0,
        totalBenefit: 0,
        unFee: 0,
        settleCode: '',
        payTradeLog: [] // 支付记录
      },
      // 原路退费的对象
      refundOriginParams: {
        id: '',
        partialRefund: false,
        recollect: false,
        paymethodArr: [],
        wipeOffFee: 0,
        unexefee: 0
      },
      printInfo: { id: '', code: '' },
      insuranceOrgId: '', // 医保读卡组件需要的医保机构ID
      clinicType: false,
      isHcjk: false,
      hljybCode, // 黑龙江医保的code标识
      jljhCode, // 蛟河医保code标识
      specialDis: false,
      afterReadCard: false,
      medicalType: '11', // 医疗类别,默认是普通门诊
      specialDisList: []// 慢病的列表
    }
  },
  mounted () {
    // 判断某一个打印机打印完成，启动下一个打印任务
    let _this = this
    this.isHcjk = this.$ever.getClinicConfig().clinicType === 'hcjk'
    window.addEventListener(
      'message',
      function (e) {
        if (e.data === 'printdone' && _this.isHcjk) {
          if (_this.iframeSrcArr && _this.iframeSrcArr.length) {
            _this.hcjkPrintFun()
          }
        }
      },
      false
    )
    // 获取授权列表
    this.getAuthList()
  },
  watch: {
    // 补费框关闭时，重新获取数据
    istrans () {
      if (!this.istrans) this.refundStatus()
    },
    '$store.state.pending': function (num) {
      // 防止点击补费操作的时候，不执行loading
      if (this.istrans) return
      if (num > 0) {
        if (this.layershow) return
        this.obj.loading = true
      }
      if (num === 0) {
        this.obj.loading = false
      }
    },
    '$route.meta': {
      handler: function (val, oldval) {
        this.urlpath = val && val.status
      },
      immediate: true
    }
  },
  computed: {
    // 补费组件需要参数
    baseInfo () {
      const {
        rootorderid: visitNumber,
        orderDoctor: doctorId,
        patientid: patientId,
        patientName,
        orderDept: providerId,
        orderDeptName: providerName,
        doctorName
      } = this.obj && this.obj.master || {}
      return ({
        visitNumber,
        doctorId,
        patientId,
        patientName,
        providerId,
        providerName,
        feesDoctor: {
          id: doctorId,
          name: doctorName
        }
      })
    },
    settlebtn: function () {
      if (this.singleConfig.includes(this.settleStatus)) {
        // 医保账单显示读卡按钮，结算单显示结算按钮
        if (this.settleStatus === 1) {
          if (Number(this.urlpath) === 0) {
            // 读卡
            return false
          } else {
            // 兼顾黑龙江预警结算
            return this.obj.warningStatus === undefined || this.obj.warningStatus < 0
          }
        } else if (this.settleStatus === 2) {
          return this.$hasPermission('Auth_menu_rcm_settlements_claimAdjuster')
        } else if (this.settleStatus === 7) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  methods: {
    getAuthList () {
      authApi.authList().then(rs => {
        if (!rs.head.errCode) {
          this.authorizeInfo = rs.data
        } else {
          this.$messageTips(this, 'error', '授权列表获取失败')
        }
      })
    },
    // 慢病选择之后
    specialDisSure (val) {
      this.medicalOperation('SpecialDisSure', val)
    },
    // 不同医保机构转发不同执行函数
    medicalOperation (operate, val) {
      let method = this[orgList[this.insuranceOrgId]['code'] + operate]
      if (typeof method === 'function') {
        method.call(this, val)
      }
    },
    // 待遇信息确认带着读卡信息生成结算单
    getMedDetailsEvent (medicalobj) {
      if (Object.keys(medicalobj).length > 0) {
        this.obj.personInfo = medicalobj
        if (medicalobj.personname !== this.obj.patientName) {
          this.$messageTips(this, 'error', '医保卡信息与当前患者姓名不一致，不能进行医保结算')
          return false
        }
        if (this.insuranceOrgId === this.hljybCode) {
          /** 黑龙江医保的额外参数开始 */
          this.obj.personInfo.icCardPassword = medicalobj.password
          this.obj.personInfo.icCard = medicalobj.icCard
          this.obj.personInfo.hljMedicalType = this.medicalType
          /** 黑龙江医保的额外参数结束 */
          // 调慢病查询接口
          this.getHljSpecialDisList()
        } else if (this.insuranceOrgId === this.jljhCode) {
          this.obj.personInfo.medicalType = this.medicalType
          this.getJljhSpecialDisList()
        } else {
          this.handleSettleClick(false)
        }
      } else {
        this.$messageTips(this, 'error', '没有读取到医保卡信息，请放置好医保卡重新读取')
        return false
      }
    },
    // 医保分解
    medicalSettle () {
      this.medicalOperation('MedicalSettle')
    },
    async readCard () {
      // 机构id接口获取
      let params = {
        visitNumber: this.$route.query.visitNumber
      }
      getInsuranceIdByVisitNumber(params).then(res => {
        if (!res.data) {
          this.$messageTips(this, 'error', '未获取到医保机构id,请稍后再试！')
          return false
        }
        this.insuranceOrgId = res.data
        if (this.insuranceOrgId === this.hljybCode) {
          // 黑龙江医保每次读卡先把医疗类别的项处理成默认值，即普通门诊
          this.medicalType = '11'
        }
        this.$nextTick(_ => {
          this.$refs.medicalinfo.start()
        })
      }, err => {
        console.log('err', err)
      })
    },
    // 从已结算列表过来的统一退费入口
    refundPay () {
      if (this.obj.recollect) {
        // 重收生成的单子
        this.recollectPay()
      } else { // 正常的退费单子，或者挂号的项目退费
        if (Number(this.obj.parameters.refund_method) === 0) {
          // 原路退
          this.billrefundOriginRoad(this.obj)
        } else {
          // 自定义退
          this.obj.payType = 1
          // 正向数额
          this.obj.unexefee = -this.obj.unFee
          this.obj.isRefund = true
          this.newpayobj = this.obj
          this.paydialogVisible = true
        }
      }
    },
    async recollectPay () {
      const { id, returnId, recollect } = this.obj
      let params = { settlementId: returnId }
      billrefundOrigin(params).then(res => {
        // 记录退费新生成的id
        const { refundFlowList, partialRefund, refundFee, wipeOffFee } = res.data
        this.refundOriginParams.id = id
        this.refundOriginParams.partialRefund = partialRefund // 标识是部分退还是全退
        this.refundOriginParams.recollect = recollect
        this.refundOriginParams.paymethodArr = refundFlowList
        this.refundOriginParams.unexefee = refundFee
        this.refundOriginParams.wipeOffFee = wipeOffFee
        this.refunddialogVisible = true
      }, err => {
        console.log('err', err)
      })
    },
    handleBillrefund () {
      if (Number(this.urlpath) === 1) {
        this.billrefund()
      } else {
        if (Number(this.obj.parameters.refund_method) === 0) {
          // 原路退
          this.billrefundOriginRoad(this.obj)
        } else {
          // 自定义退
          this.obj.payType = 1
          // 正向数额
          this.obj.unexefee = -this.obj.unFee
          this.obj.isRefund = true
          this.newpayobj = this.obj
          this.paydialogVisible = true
        }
      }
    },
    // 待退费页签的退费
    async billrefund () {
      let multipleSelection = JSON.parse(
        JSON.stringify(this.obj.multipleSelection)
      )
      multipleSelection.map(item => {
        item.recipeDetails.map(v => {
          v.discount = floatTool.divide(v.discount, 100)
        })
      })
      try {
        let params = {
          patientid: this.$route.query.patientId, // 患者id
          rootorderid: this.$route.query.visitNumber, // 患者visitNumber
          mergedReceiptData: multipleSelection,
        }
        // 如果用了医保，需要mecid
        if (this.obj.medicalInsurance) {
          params.macId = this.macId
        }
        let data = await refundSettle(params)
        if (data.data.reSettleId) {
          this.$router.push({
            path: '/rcm/reconstruct/settled',
            query: {
              settlementid: data.data.reSettleId,
              visitNumber: this.$route.query.visitNumber,
              dptId: this.$route.query.dptId,
              patientId: this.$route.query.patientId
            }
          })
        } else {
          Object.assign(this.obj, data.data)
          this.obj.paystatusobj.returnFlag = 1
          this.obj.isRefund = true
          this.newpayobj = this.obj
          if (Number(this.obj.parameters.refund_method) === 0) {
            // 待退费的原路退
            this.billrefundOriginRoad(data.data)
          } else {
            this.paydialogVisible = true
          }
        }
      } catch (err) { }
    },
    // 待退费的页签的原路退
    billrefundOriginRoad (data) {
      const { id, returnId, recollect } = data
      let params = { settlementId: returnId }
      billrefundOrigin(params).then(res => {
        // 记录退费新生成的id
        const { refundFlowList, partialRefund, refundFee, wipeOffFee } = res.data
        this.refundOriginParams.id = id
        this.refundOriginParams.partialRefund = partialRefund // 标识是部分退还是全退
        this.refundOriginParams.recollect = recollect
        this.refundOriginParams.paymethodArr = refundFlowList
        this.refundOriginParams.unexefee = refundFee
        this.refundOriginParams.wipeOffFee = wipeOffFee
        this.refunddialogVisible = true
      }, err => {
        console.log('err', err)
      })
    },
    // 确定待退费
    sureRefund ({ feeList }) {
      let params = {
        reSettle: this.refundOriginParams.recollect,
        settlementId: this.refundOriginParams.id,
        refundFlowList: feeList
      }
      confirmRefund(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.refunddialogVisible = false
        // 刷新页面
        this.$emit('getSettleStatus')
      }).catch((err) => {
        console.log('err', err)
      })
    },
    async hcjkPrint (id) {
      let json = await api.getCountOfHaiChuangInvoiceItem({ settlementId: id })
      let arr = []
      let offsize = Math.ceil(Number(json.data) / 10)
      for (let i = 0; i < offsize; i++) {
        arr.push(i * 10)
      }
      this.printInfo.id = id
      this.iframeSrcArr = arr
      this.hcjkPrintFun()
    },
    hcjkPrintFun () {
      let toPrint = this.iframeSrcArr.shift()
      if (String(toPrint) !== 'undefined') {
        frPrint(
          this.printInfo.code,
          { id: this.printInfo.id, startIndex: toPrint },
          { preview: true }
        )
      }
    },
    // 上一步
    async handlePreviousClick () {
      try {
        let params = {
          id: this.$route.query.settlementid
        }
        let data = await previousSettle(params)
        if (data.settlementId) {
          this.obj.id = data.settlementId
          this.$emit('getSettleStatus')
        } else {
          this.$router.push({
            path: '/rcm/reconstruct/peddingsettlement',
            query: {
              visitNumber: this.$route.query.visitNumber,
              dptId: this.$route.query.dptId,
              patientId: this.$route.query.patientId
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    comfirmzeropay (ispay) {
      if (Number(this.obj.parameters.zero_pay_page) === 1) { // 0元支付不保留支付页
        if (Number(this.obj.unFee) === 0) { // 0元支付不保留支付页面，并且选择商保后支付金额是0元，就不回再跳到支付按钮
          this.$confirm('当前还需支付0元，点击确定直接支付完成！', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.callbackVal = 'handleSettleClick'
            this.callbackValue = ispay
            this.$refs.authorizelog.visible = true
            // this.handleSettleClick(ispay)
          }).catch(() => { })
        } else {
          this.handleSettleClick(ispay)
        }
      } else {
        this.handleSettleClick(ispay)
      }
    },
    // 如果是账单则需要跳页面结算单则刷新getprint
    async handleSettleClick (ispay) {
      try {
        // 商保
        let settlementComInsurDet = []
        if (this.obj.settlementComInsurDetID) {
          settlementComInsurDet = [
            {
              insurOrgId:
                (this.obj.settlementComInsurDetID &&
                  this.obj.settlementComInsurDetID.insurerId) ||
                (this.obj.details &&
                  this.obj.details.settlementComInsurDet &&
                  this.obj.details.settlementComInsurDet[0] &&
                  this.obj.details.settlementComInsurDet[0].insurOrgId),
              salePolicy:
                this.obj.settlementComInsurDetID &&
                  this.obj.settlementComInsurDetID.salePolicy === 0
                  ? '0'
                  : '',
              insurProductId:
                this.obj.settlementComInsurDetID &&
                this.obj.settlementComInsurDetID.productId,
              patientid: this.$route.query.patientId
            }
          ]
        } else {
          settlementComInsurDet = []
        }
        let settlementMajorAccount = []
        if (this.obj.productId) {
          settlementMajorAccount = [
            {
              customerName:
                this.obj.productId && this.obj.productId.customerName, // 大客户名称
              productName: this.obj.productId && this.obj.productId.productName, // 报销方案名称
              reimburseRate:
                this.obj.productId && this.obj.productId.reimburseRate, // 报销比例
              customer: this.obj.productId && this.obj.productId.customer, // 大客户id
              productId: this.obj.productId && this.obj.productId.id // 报销方案id
            }
          ]
        } else {
          settlementMajorAccount = []
        }
        let settlementDetail = []
        if (this.obj.settleStatus === 0) {
          this.getDetail().map(item => {
            item.discount = floatTool.divide(item.discount, 100)
            settlementDetail.push(item)
          })
        } else {
          settlementDetail = this.getDetail()
        }
        let params = {
          // 医保信息
          medInsurOwnPayFee: this.obj.medInsurOwnPayFee, // 医保自费金额
          medInsurPubPayFee: this.obj.medInsurPubPayFee, // 医保报销金额
          // 商保信息
          comInsurance: settlementComInsurDet.length > 0, // 是否使用商保
          comInsuranceDirectFee: this.obj.comInsuranceDirectFee, // 商保报销金额
          insuranceTotalfee: this.obj.insuranceTotalfee, // 商保合计金额
          recRate: this.obj.recRate, // 商保报销比例,
          comInsuranceBenefit: this.obj.comInsuranceBenefit,
          comInsuranceBenefitFee: this.obj.comInsuranceBenefit
            ? this.obj.comInsuranceBenefitFee
            : 0,
          // 大客户信息
          majorAccountFee: this.obj.majorAccountFee, // 大客户报销金额
          majorTotalfee: this.obj.majorTotalfee, // 大客户总金额
          reimburseRate: this.obj.reimburseRate, // 大客户比例
          // 通用信息
          id: this.obj.id || '',
          settlecode: this.obj.settleCode || '',
          patientid: this.$route.query.patientId, // 患者id
          rootorderid: this.$route.query.visitNumber, // 患者visitNumber
          settleStatus: this.settleStatus, // 当前结算状态
          details: {
            settlementDetail: settlementDetail,
            settlementComInsurDet: settlementComInsurDet,
            settlementMajorAccount: settlementMajorAccount,
            settlementCouponDet: this.obj.details.settlementCouponDet,
            settlementMemberDet: this.obj.details.settlementMemberDet,
            settlementBenefitDet: this.obj.details.settlementBenefitDet,
            settlementPromotion: this.obj.details.settlementPromotion,
            medPersonInfo: this.obj.details.medPersonInfo
          },
          benefitFee: this.obj.benefitInfo.benefitFee,
          promotionFee: this.obj.benefitInfo.promotionFee,
          selfDiscountFee: this.obj.benefitInfo.selfDiscountFee,
          membergradecutfee: this.obj.benefitInfo.membergradecutfee,
          memberactcutfee: this.obj.benefitInfo.memberactcutfee,
          discounts: this.obj.discounts,
          personInfo: this.obj.personInfo || {}, // 医保患者信息
          // 蛟河是否默认使用个人账户支付，交互页面checkbox为true,得给医保传0，反之一样
          medicalPay: this.obj.personInfo.medicalPay
        }
        // 医保阶段要macId
        if (!params.personInfo.macId && this.obj.settleStatus === 1) {
          params.personInfo.macId = this.macId
        }
        let data = await settleCreate(params)
        // 账单待结算
        if (Number(this.urlpath) === 0) {
          if (ispay) {
            Object.assign(this.obj, data.settlement)
            this.newpayobj = this.obj
            return Promise.resolve(data)
          } else {
            this.$router.push({
              path: '/rcm/reconstruct/settled',
              query: {
                settlementid: data.settlement.id,
                showDetail: 0,
                visitNumber: data.settlement.rootorderid,
                dptId: data.settlement.orderDept,
                patientId: data.settlement.patientid,
                time: Date.now()
              }
            })
          }
          // 账单待退费
        } else if (Number(this.urlpath) === 1) {
          // 结算单
        } else if (Number(this.urlpath) === 2) {
          if (ispay) {
            Object.assign(this.obj, data.settlement)
            this.newpayobj = this.obj
            return Promise.resolve(data)
          } else {
            this.$emit('getSettleStatus')
          }
        }
      } catch (err) {
        console.log(err)
        return Promise.reject()
      }
    },
    getDetail () {
      let newmultipleSelection = JSON.parse(
        JSON.stringify(this.obj.multipleSelection)
      )
      let settlementDetail = newmultipleSelection.reduce((total, cur) => {
        total = [...total, ...cur.recipeDetails]
        return total
      }, [])
      return settlementDetail
    },
    // 补费
    makeupfee () {
      this.istrans = !this.istrans
    },
    // 套餐支付完成后，点击遮罩的回调
    getpackStatus () {
      this.obj.tcloading.close()
      document.onclick = null
      this.$emit('packageAfterPay')
    },
    // 支付前需判断是否存在未支付套餐，如果有引用关系的未支付套餐，需更改折扣
    beforePay () {
      // 只有商业保险和大客户才会有免单按钮，并且显示大按钮是结算按钮
      // promotionId活动 memberCardId储值卡 benefitCardId身份卡 giftcardIds.length>0优惠券
      // mergedReceiptData.recipeDetails[0].mealFlag 是否套餐
      // mergedReceiptData.recipeDetails[0].discount === 100
      let ishasPackage = this.getDetail().some(
        v => v.mealPaidFlag === 2 && v.mealFlag
      )
      if (ishasPackage) {
        this.$alert(
          '存在未支付的套餐，请先支付套餐或者使用自费支付(将套餐勾选框勾掉)！',
          '支付',
          {
            confirmButtonText: '确定'
          }
        )
      } else {
        this.judgeAuthorize()
      }
    },
    judgeAuthorize () {
      let lock = false
      let typeCode = []
      this.authorizeInfo.forEach(item => {
        if (item.code === 'sbin_free_auth' && item.status) { // 商保免单授权
          if (this.obj.comInsuranceBenefit) { // 并且结算单选中了免单
            lock = true
            typeCode.push('sbin_free_auth')
            this.authSettlementid = this.$route.query.settlementid
          }
        } else if (item.code === 'discount_auth' && item.status) { // 折扣授权
          let benefit = this.obj.benefitInfo
          // promotionId活动 memberCardId储值卡 benefitCardId身份卡 giftcardIds.length>0优惠券
          if (!benefit.promotionId && !benefit.memberCardId && !benefit.benefitCardId && benefit.giftcardIds.length === 0) { // 营销优惠带来的折扣的改变不需要进行授权
            this.obj.mergedReceiptData.forEach(lab => {
              lab.recipeDetails.forEach(v => {
                if (!v.freeSheet && v.discount !== 100) { // freeSheet是否是cope开的免单项目，是的话不需要授权
                  lock = true
                  typeCode.push('discount_auth')
                }
              })
            })
          }
        } else if (item.code === 'meal_sett_auth' && item.status) { // 套餐结算
          this.obj.mergedReceiptData.forEach(lab => {
            lab.recipeDetails.forEach(v => {
              if (v.mealFlag) {
                lock = true
                typeCode.push('meal_sett_auth')
              }
            })
          })
        }
      })
      if (lock) {
        this.callbackVal = 'handlePayClick'
        this.typeCode = [...new Set(typeCode)].join(',')
        this.$refs.authorizelog.visible = true
      } else {
        this.handlePayClick()
      }
    },
    // 支付环节0元支付处理
    async payzero (paymode) {
      if (Number(this.obj.parameters.zero_pay_page) === 1) {
        if (Number(this.obj.unFee) === 0) {
          this.$confirm('当前还需支付0元，点击确定直接支付完成！', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              let data = await this.handleSettleClick(true)
              if (Number(this.obj.unFee) === 0) {
                this.$router.push(
                  {
                    path: '/rcm/reconstruct/settled',
                    query: {
                      settlementid: data.settlement.id,
                      showDetail: 0,
                      visitNumber: data.settlement.rootorderid,
                      dptId: data.settlement.orderDept,
                      patientId: data.settlement.patientid,
                      time: Date.now()
                    }
                  }
                  // v => {
                  //   this.$emit('getSettleStatus')
                  // }
                )
              } else {
                paymode === '1'
                  ? (this.layershow = true)
                  : (this.paydialogVisible = true)
              }
            })
            .catch(() => { })
        } else {
          await this.handleSettleClick(true)
          paymode === '1'
            ? (this.layershow = true)
            : (this.paydialogVisible = true)
        }
      } else {
        await this.handleSettleClick(true)
        paymode === '1'
          ? (this.layershow = true)
          : (this.paydialogVisible = true)
      }
    },
    // 支付
    async handlePayClick () {
      let paymode = this.obj.parameters.pay_mode
      if (this.obj.isRefund) {
        this.obj.isRefund = false
      }
      if (this.obj.settleStatus === 0) {
        this.payzero(paymode)
      } else if (this.obj.settleStatus === 3) {
        this.newpayobj = this.obj
        // 作废场景不需要更新结算单
        paymode === '1'
          ? (this.layershow = true)
          : (this.paydialogVisible = true)
      }
    },
    // 关闭弹窗
    cancel () {
      this.paydialogVisible = false
    },
    paysuccess () {
      // let path = this.$route.meta && this.$route.meta.status
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: {
          settlementid: this.newpayobj.id,
          showDetail: 0,
          visitNumber: this.$route.query.visitNumber,
          dptId: this.$route.query.dptId,
          patientId: this.$route.query.patientId,
          time: Date.now()
        }
      })
    },
    // 支付2成功回掉
    payStatus () {
      if (!this.newpayobj.isRefund) { // 退费的不打印
        this.createPrint(1, true) // 心和堂要求支付完成自动调打印
      }
      this.paysuccess()
    },
    // 关闭前回调
    async closedialog (done) {
      try {
        if (Number(this.urlpath) === 0) {
          if (this.obj.id && this.obj.settleStatus === 3) {
            this.paysuccess()
          }
        } else if (this.settleStatus === 4) {
          let params = {
            id: this.newpayobj.id
          }
          await phyDelete(params)
        }
        done()
      } catch (err) {
        done()
      }
    },
    // 支付1成功回掉
    getData (isFinish, type) {
      if (isFinish) {
        this.layershow = false
        // 退费的不打印,第二个参数是标识直接关闭弹窗的也不打印
        if (!this.newpayobj.isRefund && !type) {
          this.createPrint(1, true) // 心和堂要求支付完成后，自动调打印
        }
        // 如果整笔结算单没有支付完成，不关弹窗，也先不跳转20191214
        // 原来的逻辑是paysuccess在isFinish外面，导致线上支付第一笔之后，会立刻跳转，然后组件初始化，弹窗给关了
        this.paysuccess()
      } else {
        this.$messageTips(this, 'success', '支付成功')
        this.$emit('getSettleStatus')
      }
    },
    // 作废成功回掉
    refundStatus () {
      this.$emit('getSettleStatus')
    },
    // 支付弹窗支付成功的回调
    paymentSuccess () { },
    // 费用清单打印
    listoffeePrint () {
      if (this.$route.query.settlementid) {
        everprint('mzfyqd_afterComInsur', { settlementId: this.$route.query.settlementid }, {
          preview: true
        })
      } else { // 切换到新模板了
        everprint('mzfyqd', { visitNumber: this.$route.query.visitNumber }, { preview: true })
      }
    },
    billPrintCall () {
      everprint('rcm-outpatient-bill', { id: (this.$route.query.settlementid || this.obj.id), patientId: this.$route.query.patientId }, { preview: true })
    },
    printSuccessCall () {
      let params = {
        id: this.$route.query.settlementid || this.obj.id,
        forPrint: true
      }
      getPrint(params).then(rs => {
        Object.assign(this.obj, rs.data)
      })
    },
    // 支付后打印目前存在问题
    /*
    @isAuto，标识是否支付完成后自动打印的
    */
    createPrint (btnType = 1, isAuto) {
      if (this.isHcjk) {
        if (isAuto) {
          // 海创支付完成之后，不要自动打印
          return
        } else {
          // 海创要判断需要打印几张
          this.printInfo.code = 'thc_rcm_FEIYONGQINGDAN_LNN_20181114'
          this.hcjkPrint(this.$route.query.settlementid || this.obj.id)
          return
        }
      }
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.printSuccessCall, // 打印成功的回调
        billPrintCall: this.billPrintCall, // 没有关联模版走老票据打印的回调
        code: 'rcm_dishui', // 模版code
        everPrintParams: null,
        settlementId: this.$route.query.settlementid || this.obj.id, // settlementid
        printType: 2, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info)
    },
    // 医保打印
    medicareSettlementPrint () {
      if (Number(this.obj.insuranceType) !== 0) {
        return false
      }
      api.medicareSettlementPrint(this.obj.id).then(
        result => {
          if (result.head.errCode === 0) {
            this.medicalprintobj = Object.assign({}, result.data)
            medicareapi
              .printInvoice({
                tradeno: this.medicalprintobj.tradeno,
                invoiceno: this.medicalprintobj.settleCode,
                businessinfo: this.medicalprintobj.settleCode,
                hosptype: this.medicalprintobj.clinicType
              })
              .then(
                result => {
                  if (result.head.errCode === 0) {
                    if (result.detailreprintflag === '1') {
                      doPrint(this, 'medicalprint')
                    }
                  } else {
                    this.$notify({
                      type: 'error',
                      message: '打印数据还没有准备好，请重试'
                    })
                  }
                },
                errorFn => {
                  this.$notify({
                    type: 'error',
                    message: '打印数据还没有准备好，请重试'
                  })
                }
              )
          } else {
            this.$notify({
              type: 'error',
              message: '打印数据还没有准备好，请重试'
            })
          }
        },
        errorFn => {
          this.$notify({
            type: 'error',
            message: '打印数据还没有准备好，请重试'
          })
        }
      )
    },
    lastStep (obj) { // 查找上一步结算节点
      let settledStatusArr = obj.patientIdentity.filter(item => item.status === 1)
      let length = settledStatusArr.length
      if (length > 0 && settledStatusArr[length - 1].sort === 1) { // 如果上一步是医保，则上一步就不展示
        return false
      }
      return true
    },
    // 授权的回调函数
    authorizeconfirm (callVal) {
      this[callVal.callbackVal](callVal.value)
    }
  },
}
</script>

<style scoped>
.settleBtn {
  position: absolute;
  bottom: 0;
  border-top: 1px solid #eeeeee;
  width: 100%;
  background: #fff;
  left: 0px;
  z-index: 1000;
  padding: 0 10px;
  box-sizing: border-box;
}
.settleBtn .makeup {
  float: left;
  line-height: 36px;
  padding: 10px 0;
}
.settleBtn .btnsright {
  float: right;
}
.settleBtn .btnsright .el-button {
  margin: 10px 0;
}
.settleBtn .btnsright.recollect .el-button {
  margin: 26px 0;
}
.settleBtn .btnsright .el-button + .el-button {
  margin-left: 6px;
}
.trans {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.settle_needpay {
  float: right;
  /* line-height: 56px; */
  /* height: 56px; */
  color: #000;
  font-size: 14px;
  text-align: right;
  margin-right: 20px;
}
.settle_needpay div {
  line-height: 56px;
}
.settle_needpay .recollect {
  line-height: 26px;
}
.settle_needpay span {
  font-size: 16px;
  display: inline-block;
  margin-right: 6px;
  font-weight: 500;
}
.settle_needpay span:last-child {
  font-size: 20px;
}
.settle_needpay b {
  font-weight: 400;
  display: inline-block;
}
</style>
