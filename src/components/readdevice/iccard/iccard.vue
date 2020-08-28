<template>
  <span>
    <el-popover v-if="insuranceOrgId==sysqzyyCode" placement="top-start" trigger="hover">
      <template slot="default">
        <el-button type="primary" size="mini" @click="handleHasCard(true)">有卡</el-button>
        <el-button type="primary" size="mini" @click="handleHasCard(false)">无卡</el-button>
      </template>
      <template slot="reference">
        <slot>
          <i class="el-input__icon icon iconfont icon-menzhen-yibaoka cBlack mr5"></i>
        </slot>
      </template>
    </el-popover>
    <span v-else @click="readICCard()">
      <slot>
        <i class="el-input__icon icon iconfont icon-menzhen-yibaoka cBlack mr5"></i>
      </slot>
    </span>
    <!--医保信息展示 -->
    <medical-info
      ref="medicalInfo"
      :insuranceOrgId="insuranceOrgId"
      :hasCard="hasCard"
      :scence="scence"
      @getMedDetails="getMedDetails"
    ></medical-info>
  </span>
</template>
<script>
import medicalInfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import userapi from '@/workspace/store/userbaseapi'
import memberApi from '@/crm/store/memberapi'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

export default {
  components: {
    medicalInfo
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    insuranceOrgId: {
      type: String,
      default: ''
    },
    scence: {
      type: [Number, String],
      default: 0
    },
    // 是否用做医保查询的个人编号
    usedInPersonNo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sysqzyyCode,
      hasCard: false
    }
  },
  methods: {
    readICCard () {
      if (!this.insuranceOrgId) {
        this.$messageTips(this, 'error', '请先选择医保机构再进行医保读卡操作')
        return false
      }
      this.$refs.medicalInfo.start()
    },
    // 三亚医保作妖，区分有卡和无卡
    handleHasCard (hasCard) {
      this.hasCard = hasCard
      this.readICCard()
    },
    getMedDetails (obj) {
      this.usedInPersonNo ? this.emitPersonNo(obj) : this.addIcInfo(obj)
    },
    // 医保读卡之后，去系统查询该患者，然后将患者的数据渲染到页面上
    addIcInfo (obj) {
      // 用医保读卡返回的身份证号和姓名去查询患者信息
      if (!obj.idno || !obj.personname) {
        this.$messageTips(this, 'error', '未获取到读卡人信息')
        return false
      }
      let params = { idNo: obj.idno, keyword: obj.personname }
      // let params = { idNo: '210302199311240003', keyword: '柳一' }
      userapi.searchFuzzy(params).then(res => {
        if (res.data.totalCount > 0) {
          let result = res.data.resultList[0]
          this.inputselect1 = result.name
          result.agebirthday = {
            birthday: result.birthday,
            age: result.age,
            isMonth: result.isMonth,
            isDay: result.isDay
          }
          if (this.getMembercardFlag) {
            memberApi.getBaseInfoById1({
              patientId: result.id
            }).then(rs => {
              if (rs.head.errCode === 0) {
                this.$emit('memberdata', rs.data)
                this.$emit('medicalInfo', obj) // 医保信息
              }
            })
          } else {
            this.$emit('select', result)
            this.$emit('medicalInfo', obj) // 医保信息
          }
        } else {
          this.$messageTips(this, 'error', '没有查到与该医保卡对应的患者信息，请先到客户中心建档')
        }
      }, err => {
        console.log('err', err)
      })
    },
    emitPersonNo (medicalObj) {
      this.$emit('emitPersonNo', medicalObj)
    },
  }
}
</script>
<style scoped>
.icon:hover {
  color: #1c7bef;
}
</style>
