<template>
  <el-footer class="alg_c bWhite" height="42px" v-if="showBtn || (type === 9 && successList.length)">
    <template  v-if="showBtn">
      <template v-if="type === 8">
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" type="primary" @click="clickBtn(1)">通过</el-button>
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" @click="clickBtn(2)">驳回</el-button>
      </template>
      <template v-if="type === 9">
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" type="primary" @click="clickBtn(3)">入库</el-button>
        <el-button :disabled="!selectionTable.length" :loading="btnloading" size="small" @click="clickBtn(4)">拒收</el-button>
      </template>
    </template>
    <el-button v-if="type === 9" size="small" @click="hanlderShowSummary" type="primary">入库汇总</el-button>
    <!-- 汇总弹框 -->
    <el-dialog :visible.sync="miniDialog" custom-class="ui_dialog_01" center>
      <div style="min-height:160px; max-height: 400px;padding:10px 20px;">
        <el-table
          :data="summaryList"
          :max-height="400"
          border>
          <el-table-column prop="materialName" label="物资名称">
            <template slot-scope="{row:{materialName}}">
              {{materialName || tableDefaultCellValue}}
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" width="100">
            <template slot-scope="{row:{spec}}">
              {{spec || tableDefaultCellValue}}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="100">
            <template slot-scope="{row:{num, packagUnitName}}">
              {{num ? `${num}${packagUnitName}` : tableDefaultCellValue }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="miniDialog = false">确认</el-button>
      </span>
    </el-dialog>
  </el-footer>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
export default {
  props: {
    type: {
      type: Number,
      default: 8
    },
    tableData: {
      type: Array,
      default: () => []
    },
    selectionTable: {
      type: Array,
      default: () => []
    },
    toExamine: Number,
    isInvented: Number
  },
  data () {
    return {
      tableDefaultCellValue,
      btnloading: false,
      miniDialog: false
    }
  },
  computed: {
    // 操作按钮是否显示
    showBtn () {
      if (this.type === 8) {
        return this.tableData.some(item => !item.taskItemList[0].examineFlag)
      } else {
        return this.tableData.some(item => item.taskItemList[0].status === 9)
      }
    },
    // 入库明细中，所有已完成状态的数据
    successList () {
      try {
        // status = 10 已完成退药入库
        return this.tableData.filter(item => item.taskItemList[0].status === 10).map(item => item.taskItemList[0])
      } catch (error) {
        return []
      }
    },
    // 汇总去重后的数据
    summaryList () {
      try {
        // status = 10 已完成退药入库
        return this.successList.reduce((pre, cur) => {
          // cur = Object.create(cur)
          cur = Object.assign({}, cur)
          const { localMaterialId, num } = cur
          let find

          if ((find = pre.find(item => item.localMaterialId === localMaterialId))) {
            find.num += num
            return [...pre]
          } else {
            return pre.concat(cur)
          }
        }, [])
      } catch (error) {
        return []
      }
    }
  },
  methods: {
    clickBtn (type) {
      // type: 1: 审核 2：驳回 3：入库 4：拒收
      this.btnloading = true
      this.$emit('back-action-btn', type)
    },
    hanlderShowSummary () {
      this.miniDialog = true
    }
  },
}
</script>

<style>

</style>
