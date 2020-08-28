<template>
  <el-dialog :close-on-click-modal="false" class="execute_dialog" title="手术执行" :visible.sync="dialogVisible">
    <execute-form ref="executeform" :nosubmit="true" :patient="patient" @success="success"></execute-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button @click="submit" type="primary">执行</el-button>
    </span>
  </el-dialog>
</template>
<script>
import executeForm from '@/csa/page/execute.form.vue'
export default {
  data () {
    return {
      dialogVisible: false,
      patient: {}
    }
  },
  components: { executeForm },
  methods: {
    opens (patient) {
      this.patient = patient
      this.dialogVisible = true
    },
    submit () {
      this.$refs.executeform.zxsubmit()
    },
    success (res) {
      this.$emit('success', null)
      this.dialogVisible = false
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scope>
.execute_dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/ .el-form {
    padding: 20px 20px 28px 5px;
  }
  .header {
    padding: 20px 20px;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    font-size: 14px;
    // margin-bottom: 20px;
  }
}
</style>
