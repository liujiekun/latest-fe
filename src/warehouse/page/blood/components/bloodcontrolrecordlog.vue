<!-- 操作记录弹窗 -->
<template>
  <div class="record-dialog">
    <el-dialog title="操作记录" :visible.sync="visibleDialog" class="ui_dialog_02">
      <el-table :data.sync="recordData">
        <el-table-column label="操作时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.operateTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.operStaffObject.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作行为">
          <template slot-scope="scope">
            <span>{{scope.row.operateMessage}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { patch } from '@/util/common'
export default {
  props: ['recordData', 'visible'],
  data () {
    return {
    }
  },
  created () {
    console.log(this.recordData)
  },
  computed: {
    visibleDialog: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  },
  methods: {
    ...patch
  }
}
</script>
<style lang="less" scoped>
</style>
