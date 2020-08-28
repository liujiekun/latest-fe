<template>
  <span>
    <medical-content
      v-if="contentShow"
      :insuranceOrgId="insuranceOrgId"
      :macId="macId"
      :password="oldPassword"
      :scence="scence"
      v-bind="$attrs"
      :dialogmedicalinfovisible.sync="contentShow"
      @getMedDetails="confirmInfoFn"
    ></medical-content>
    <password-valid
      v-if="passwordValid"
      :passwordVisble.sync="passwordValid"
      @modifyPassword="modifyPassword"
      @confirm="passwordConfirm"
    ></password-valid>
    <password-modify
      v-if="passwordModify"
      :oldPassword="oldPassword"
      :passwordModify.sync="passwordModify"
      :macId="macId"
      @modifySuccess="modifySuccess"
    ></password-modify>
  </span>
</template>
<script>
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import medicalContent from '@/rcm/otmdiscomponent/medicalinfo-content.vue'
import passwordValid from '@/rcm/otmdiscomponent/password-valid.vue'
import passwordModify from '@/rcm/otmdiscomponent/password-modify.vue'
import getMacAddress from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
export default {
  // insuranceOrgId医保机构ID,scence：0挂号，1门诊
  props: ['insuranceOrgId', 'scence'],
  mixins: [getMacAddress],
  data () {
    return {
      orgList,
      contentShow: false,
      passwordValid: false,
      passwordModify: false,
      oldPassword: ''
    }
  },
  methods: {
    confirmInfoFn (val) {
      this.$emit('getMedDetails', val)
    },
    // 黑龙江医保密码确认
    passwordConfirm (password) {
      this.oldPassword = password
      // 将密码带过来一并读卡
      this.contentShow = true
    },
    // 要修改密码了
    modifyPassword (oldPassword) {
      this.oldPassword = oldPassword
      this.passwordModify = true
    },
    // 密码修改成功
    modifySuccess () {
      this.passwordValid = true
    },
    // 确定当前机构是要直接读卡还是需要校验密码
    startOperate () {
      if (this.orgList[this.insuranceOrgId].passwordValid) {
        // 需要密码校验
        this.passwordValid = true
      } else {
        // 直接读卡
        this.contentShow = true
      }
    },
    start () {
      this.startOperate()
    }
  },
  components: {
    passwordValid,
    passwordModify,
    medicalContent,
  }
}
</script>
