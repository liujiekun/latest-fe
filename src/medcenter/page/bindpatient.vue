<template>
  <!-- v-if="isTijian&&scope.row.businessDataStatus!==1&&!scope.row.patientId"  -->
  <el-popover placement="bottom" title width="400" trigger="manual" content v-model="visible">
    <el-form :model="bindForm" label-width="80px" ref="bindForm">
      <el-form-item label="患者姓名" prop="patient.name" :rules="rules.required">
        <ever-patient-select
          v-model="bindForm.patient.name"
          @select="selectBind"
          :allow-create="false"
          :grey-denies-dialog-show="true"
          :showAttrType="true"
        ></ever-patient-select>
      </el-form-item>
    </el-form>
    <el-row class="footer">
      <el-col :span="24" align="right">
        <el-button type="primary" size="small" @click="bindClick">提交</el-button>
      </el-col>
    </el-row>
    <el-button type="primary" size="small" slot="reference" @click="showpopover">绑定</el-button>
  </el-popover>
</template>
<script>
import api from '@/medcenter/store/medappointapi'
export default {
  props: ['data'],
  data () {
    return {
      api,
      patient: {},
      visible: false,
      bindForm: {
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: '',
          id: ''
        }
      },
      rules: {
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ]
      }
    }
  },
  methods: {
    showpopover () {
      this.visible = !this.visible
    },
    bindClick () {
      this.$refs.bindForm.validate(valid => {
        if (valid) {
          console.log(this.data, 'bind')
          let params = {
            id: this.data.id || '',
            patientId: this.patient.id || ''
          }
          if (params.id && params.patientId) {
            this.api.bindAppointmentRecord(params).then(rs => {
              if (rs && rs.head.errCode === 0) {
                this.$messageTips(this, 'success', '绑定成功', '提示')
                this.resetPatient()
                this.visible = false
                this.$emit('bindpatient')
              }
            })
          }
        }
      })
    },
    selectBind (val) {
      this.patient = val
    },
    resetPatient () {
      this.bindForm = {
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: '',
          id: ''
        }
      }
    }
  }
}
</script>

