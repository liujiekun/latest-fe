<!-- 操作记录弹窗 -->
<template>
  <div class="record-dialog">
    <el-dialog title="血液采购价格修改记录" :visible.sync="visibleDialog" class="ui_dialog_02">
      <el-form label-width="100px" class="logsForm">
        <el-col :span="12">
          <el-form-item label="血液种类：">
            <span>{{infoObject.bloodTypesName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="血源编码：">
            <span>{{infoObject.bloodSourceCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="血型：：">
            <span>{{infoObject.aboName}}{{infoObject.rhName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="血量：">
            <span style="font-size:16px">{{infoObject.bloodVolume}}{{infoObject.unitName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采血日期：">
            <span>{{infoObject.drawBloodDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失效日期：">
            <span>{{infoObject.bloodExpirationDate}}</span>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table :data.sync="recordData" style="width: 100%" border>
        <el-table-column width="180" label="调价时间">
          <template slot-scope="scope">
            <span>{{scope.row.createDate | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="调整人">
          <template slot-scope="scope">
            <span v-if="scope.row.staffObject">{{scope.row.staffObject.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原采购价（元）">
          <template slot-scope="scope">
            <span>{{scope.row.befPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="新采购价（元）">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调价原因">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { patch, SEARCH_CODE, SPEC_CODE, CONTROL_TYPE } from '@/util/common'
export default {
  props: ['recordData', 'visible', 'infoObject'],
  data () {
    return {
      SEARCH_CODE,
      SPEC_CODE,
      CONTROL_TYPE
    }
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
.logsForm {
  margin-top: -10px;
}
.logsForm /deep/ .el-form-item {
  margin-bottom: 0;
  line-height: 20px;
}
</style>
