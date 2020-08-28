<template>
  <el-dialog
    title="收样"
    :visible.sync="dialogVisible"
    class="sampling"
    width="50%">
    <div>
      <code-search
        :placeholder="'扫描或输入条码'"
        :api="api.getSampleInfoByBarcode"
        :showBtn="true"
        :codeSearchVal="dialogVisible"
        :paramsCode="'barcode'"
        @returnData="returnData">
      </code-search>
      <bloodPatient v-if="patientInfo.patientId" :source="source" :patientInfo="patientInfo"></bloodPatient>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="patientInfo.patientId ? false : true" @click="samplingSuccess">收样完成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '../store/bloodsamplingapi'
import codeSearch from '../components/codesearch'
import bloodPatient from '../components/bloodpatient.info'
export default {
  props: [],
  components: {
    codeSearch,
    bloodPatient
  },
  created () {
  },
  data () {
    return {
      api,
      dialogVisible: false,
      source: 'sampling',
      patientInfo: {},
      codeSearchVal: false
    }
  },
  methods: {
    samplingSuccess () {
      api.saveSampleInfo(this.patientInfo).then(res => {
        if (res.flag) {
          this.$messageTips(this, 'success', '收样成功')
          this.dialogVisible = false
        }
      })
    },
    returnData (v) {
      this.patientInfo = v
    },
    open (v) {
      this.dialogVisible = true
    }
  },
  watch: {
    'dialogVisible' (v) {
      if (!v) {
        this.patientInfo = {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sampling{
  /deep/ .el-dialog__footer {
    border-top: 1px solid #ccc;
  }
}

</style>
