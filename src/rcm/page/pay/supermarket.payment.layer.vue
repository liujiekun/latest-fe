<template>
  <div>
    <!-- 支付方式一 -->
    <settle-pay-ment-layer
      :obj="payObj"
      v-if="layershow"
      :layershow.sync="layershow"
      @getData="payStatus"
      @closedialog="closedialog"
      ref="settlepaymentlayer"
    ></settle-pay-ment-layer>
    <!-- 支付方式二 -->
    <paymethodstwo
      :dialogVisible.sync='paydialogVisible' 
      :obj='payObj'
      @cancel='cancel' 
      @payStatus='payStatus' 
      @refundstatus='refundStatus' 
      @closedialog='closedialog'
    ></paymethodstwo>
    <!-- 原路退款，退款明细 -->
    <originalroadrefund 
      :refunddialogVisible.sync="refunddialogVisible"
      :type="8"
      :obj="payObj"
      @refundSuccess="refundSuccess"
    ></originalroadrefund>
  </div>
</template>
<script>
import api from '@/rcm/store/outpatient/supermarket.payment.api.js'
import settlePayMentLayer from '@/rcm/page/pay/settlepaymentlayer'
import originalroadrefund from '@/rcm/page/pay/originalroadrefund'
export default {
  props: {
    visibile: {
      type: [Boolean],
      default: false
    },
    payInfo: {
      type: [Object],
      default: {}
    }
  },
  data () {
    return {
      api,
      layershow: false,
      paydialogVisible: false,
      refunddialogVisible: false,
      payObj: {
        // recollect: this.obj.recollect,
        refundReceiptFlows: [],
        paystatusobj: {
          settlementid: '',
          returnFlag: 0
        },
        writeOffId: '',
        iscallback: true,
        payObj: {
          paymethod: '1',
          remark: '',
          flowfee: '',
          auth_code: '', // 授权码
          qrfee: '' // pos机的金额
        },
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: '8',
        // 结算单id
        id: '',
        loading: false,
        // 还需支付
        unexefee: 0,
        // 已收金额
        exefee: 0,
        // 总金额
        totalFee: 0,
        // 支付方式二总额
        totalPayedFee: 0,
        totalBenefit: 0,
        unFee: 0,
        settleCode: '',
        payTradeLog: [] // 支付记录
      },
      payMethod: 1,
      refundType: 1
    }
  },
  components: {
    settlePayMentLayer,
    originalroadrefund
  },
  methods: {
    getPayMethod () {
      api.getValueByCode('shop_pay_mode').then(rs => {
        this.payMethod = rs.data
      })
    },
    getRefundType () {
      api.getValueByCode('refund_method').then(rs => {
        this.refundType = rs.data
      })
    },
    // 关闭弹窗
    cancel () {
      this.$emit('cancel')
    },
    // 支付成功回掉
    payStatus () {
      this.$emit('payStatus')
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    closedialog (done) {
      done()
      this.$emit('cancel')
    },
    refundSuccess () {
      this.$emit('refundSuccess')
    },
    getRefundDetail () {
      api.getRefundDetail({settementId: this.payObj.id}).then(rs => {
        if (rs.head.errCode === 0) {
          this.payObj.refundReceiptFlows = rs.data
          this.refunddialogVisible = true
        }
      })
    },
  },
  created () {
    this.getPayMethod()
    this.getRefundType()
  },
  watch: {
    'visibile': {
      handler: function (val, oldval) {
        if (val) {
          Object.assign(this.payObj, this.payInfo)
          if (this.payInfo.isRefund) { // 如果是退费 只走支付方式2，判断是原路退费还是自定义退费
            if (this.refundType === '1') { // 自定义退款
              this.paydialogVisible = true
            } else { // 原路退款
              this.getRefundDetail()
            }
          } else { // 支付的话判断是支付方式一还是支付方式二
            if (this.payMethod === '1') { // 支付方式一
              this.payObj.totalPayedFee = this.payInfo.unexefee
              this.payObj.payObj.flowfee = this.payInfo.unexefee
              this.layershow = true
            } else { // 支付方式二
              this.paydialogVisible = true
            }
          }
        } else {
          this.layershow = false
          this.paydialogVisible = false
          this.refunddialogVisible = false
        }
      }
    }
  }
}
</script>
