<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :width="dialogWidth"
      class="fee-add-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :modal-append-to-body="true"
    >
      <span slot="title" class="fee-add-title">{{$t('补费')}}</span>
      <div v-if="visible">
        <patient-fee v-bind="$attrs"></patient-fee>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import patientFee from './index.vue'
export default {
  components: {
    patientFee
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '1400px'
    }
  },
  data () {
    return {
      name: '补费'
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.dialogShow
      },
      set: function (val) {
        this.$emit('update:dialogShow', val)
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:dialogShow', false)
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.fee-add-dialog {
  .fee-add-title {
    font-size: 18px;
  }
  /deep/ .el-dialog {
    min-width: 900px;
  }
}
</style>
