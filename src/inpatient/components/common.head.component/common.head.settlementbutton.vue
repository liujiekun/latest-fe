<template>
  <el-button type="primary" size="mini" @click="handlePreSettle">预结算</el-button>
</template>

<script>
import { preSettle } from '@/rcm/store/otmdiscomponent/hospital-medical.js'
import { commonHeadEvent } from '@/inpatient/components/common.head.model'
import getmacaddress from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'

export default {
  mixins: [getmacaddress],
  props: {
    itemData: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      obj: {
        totalFee: 0,
        selfpayText: 0,
        overallPayText: 0,
        personcountpay: 0
      }
    }
  },
  methods: {
    handlePreSettle () {
      if (!this.macId) {
        this.$messageTips(this, 'error', '未获取到macId，请刷新页面重新获取mac地址后，再来操作')
        return
      }
      let params = {
        ipNo: this.itemData.hospitalizedNumber,
        macId: this.macId
      }
      preSettle(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        // 重新获取预结算信息
        this.$bus.$emit(commonHeadEvent.refresh)
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.box {
  float: left;
  margin-right: 20px;
  height: 36px;
}
.box .boxContent {
  color: #000;
}
</style>
