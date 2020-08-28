<template>
  <el-dialog
    title="授权"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="true"
    :append-to-body="true"
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :rules="rules"
      :nosubmit="true"
      ref="form"
      :span="24"
      :info="true"
      labelWidth="80px"
      label-position="right"
    ></ever-form2>
    <div slot="footer">
      <el-button type="primary" size="small" @click="handleSure">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/rcm/store/otmdiscomponent/auth.manage.api.js'
// import appi from '@/inpatient/components/issued.orders/api.js'
let schema = [
  {
    label: '用户账号',
    name: 'userName'
  },
  {
    label: '登陆密码',
    name: 'passWord',
    props: {
      type: 'password',
      autocomplete: 'new-password'
    }
  },
  {
    label: '授权密码',
    name: 'authCode',
    props: {
      type: 'password',
      placeholder: '请输入6位数字或字母',
      maxlength: 6,
      autocomplete: 'new-password'
    }
  }
]
let rules = {
  name: [{ required: true, message: '请输入用户账号', trigger: 'change' }],
  word1: [{ required: true, message: '请输入用户账号', trigger: 'change' }],
  password: [{ required: true, message: '请输入授权密码', trigger: 'change' }]
}
export default {
  props: ['callbackVal', 'callbackValue', 'visitNumber', 'patientId', 'typeCode', 'authSettlementid'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      obj,
      schema,
      rules,
      visible: false
    }
  },
  created () {
  },
  methods: {
    handleSure () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            userName: this.obj.userName,
            passWord: this.obj.passWord,
            authCode: this.obj.authCode,
            typeCode: this.typeCode,
            patientId: this.patientId,
            visitNumber: this.visitNumber
          }
          if (this.authSettlementid) {
            params['settlementid'] = this.authSettlementid
          }
          api.checkAuth(params).then(rs => {
            if (rs.head && rs.head.errCode === 0) {
              let authorizerId = rs.data
              this.visible = false
              this.$emit('confirmCallback', { callbackVal: this.callbackVal, value: this.callbackValue, authInfo: { ...this.obj, authorizerId } })
            } else {
              this.$messageTips(this, 'error', '授权失败，稍后再试')
            }
          })
        }
      })
    }
  },
  watch: {
    'visible': {
      handler (val) {
        if (!val) {
          this.$refs.form.$refs.form.resetFields()
        }
      }
    }
  }
}
</script>
