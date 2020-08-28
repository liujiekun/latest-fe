<template>
  <div id="huandzl">
    <el-table
      :border="false"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="55" :selectable="selectable" type="selection"></el-table-column>
      <el-table-column v-if="type == 'hl'" prop="nursingContent" label="护理工作内容"></el-table-column>
      <el-table-column v-if="type == 'zl'" prop="treatmentContent" label="诊疗工作内容"></el-table-column>
      <el-table-column prop="mustselectFlag" label="是否必选" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-row>
      <el-button type="primary" @click="updateStatusBatchHl" v-if="btnstatus('')">完成</el-button>
    </el-row>
  </div>
</template>

<script>
import api from '@/inpatient/store/resident.js'
import { setTimeout } from 'timers'
export default {
  props: ['id', 'type', 'status', 'jueType'],
  data () {
    return {
      api,
      selectTable: [],
      tableData: [],
      label: ''
    }
  },
  components: {
  },
  mounted () {
    this.init()
  },
  methods: {
    btnstatus () {
      if (String(this.status) !== '10' || (this.type === 'hl' && this.jueType === 'ys')) return false
      return true
    },
    init () {
      this.label = this.type === 'hl' ? '护理' : '诊疗'
      this.listByStageInstanceId()
    },
    handleSelectionChange (val) {
      this.selectTable = val
    },
    selectable (row, index) { // 这个函数是看哪个行（hanag）不能使用
      return String(row.status) !== '20' && String(this.status) === '10'
    },
    async listByStageInstanceId () { // 获取列表
      let res
      if (this.type === 'zl') {
        res = await this.api.listByStageInstanceId({
          stageInstanceId: this.id
        })
      } else if (this.type === 'hl') {
        res = await this.api.listByStageInstanceIdHl({
          stageInstanceId: this.id
        })
      }
      this.tableData = res.data
      // 下面这个方法来让哪个值被选择
      this.tableData.forEach((val, index) => {
        val.mustselectFlag = val.mustselectFlag ? '是' : '否'
        if (String(val.status) === '20') {
          setTimeout(_ => {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[index])
          })
        }
      })
    },
    async updateStatusBatchHl () { // 更新状态
      let res
      let ids = []
      this.selectTable.forEach(val => {
        if (String(val.status) !== '20') ids.push(val.id)
      })
      if (ids.length === 0) return
      let obj = {
        ids: ids,
        status: 20
      }
      if (this.type === 'zl') {
        res = await this.api.updateStatusBatch(obj)
      } else if (this.type === 'hl') {
        res = await this.api.updateStatusBatchHl(obj)
      }
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          title: '保存成功',
          type: 'success',
          message: res.head && res.head.errMsg
        })
        this.listByStageInstanceId()
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
#huandzl {
  padding: 0 15px 15px;
}
</style>

