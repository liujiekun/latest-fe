<template>
  <el-dialog
    :title="'原路退款'"
    width="70%"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules" :span="8">
      <div></div>
    </ever-form2>
    <el-row slot="footer" class="dialog-footer">
      <span class="paymethod_con_label">实退金额：</span>
      <span class="paymethod_con_money">￥{{Number(paramsObj.unexefee || 0).toFixed(2)}}</span>
      <span class="paymethod_con_label">抹零金额：</span>
      <span class="paymethod_con_money">￥{{Number(paramsObj.wipeOffFee || 0).toFixed(2)}}</span>
      <el-button type="primary" :disabled="isSureLoading" @click="refundBtn">确认退款</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { floatTool } from '@/util/common'
export default {
  props: ['refunddialogVisible', 'paramsObj', 'type'],
  data () {
    let rules = {}
    let len = this.paramsObj.paymethodArr.length
    let schema = this.paramsObj.paymethodArr.map(item => {
      // 定义规则
      rules[item.payMethod] = [{
        validator: (rule, value, callback) => {
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            if (value > item.flowFee) {
              callback(new Error(`最大输入金额：${item.flowFee}`))
            } else {
              callback()
            }
          } else {
            callback(new Error(`请输入正确的金额格式,两位小数`))
          }
        },
        trigger: 'change'
      }]
      const returnItem = {
        ...item,
        label: item.payName,
        name: `${item.payMethod}`,
        props: {
          placeholder: `最大允许输入金额：${item.flowFee}`,
          clearable: true
        }
      }
      // 如果源单就一种支付方式，直接待退费值输入，输入框禁用
      return returnItem
    })

    let queryObj = this.$ever.createObjFromSchema(schema)
    // 如果全退，就填上金额，全部禁用
    if (!this.paramsObj.partialRefund) {
      Object.keys(queryObj).forEach((key, index) => {
        schema[index].props.disabled = true
        queryObj[schema[index].name] = schema[index].flowFee
      })
    } else {
      if (len === 1) {
        schema[0].props.disabled = true
        queryObj[schema[0].name] = this.paramsObj.unexefee
      }
    }
    return {
      schema,
      rules,
      queryObj,
      isSureLoading: false
    }
  },
  computed: {
    v: {
      get () {
        return this.refunddialogVisible
      },
      set (val) {
        this.$emit('update:refunddialogVisible', val)
      }
    }
  },
  methods: {
    refundBtn () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const totalMoney = Object.keys(this.queryObj).reduce((total, method) => {
            total = floatTool.add(total, Number(this.queryObj[method]))
            return total
          }, 0)
          // 总金额不相等，return false
          if (totalMoney !== this.paramsObj.unexefee) {
            this.$messageTips(this, 'error', '退费金额必须等于实退金额')
            return false
          }
          // todo 退费要的格式
          let feeList = Object.keys(this.queryObj).filter((key) => this.queryObj[key] > 0).map(key => {
            return {
              payMethod: key,
              flowFee: this.queryObj[key]
            }
          })
          this.$emit('sureRefund', { feeList })
        }
      })
    },
    beforeClose (done) {
      this.$emit('beforeClose')
      done()
    }
  }
}
</script>
