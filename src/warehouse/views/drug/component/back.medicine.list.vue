<template>
  <div class="main10 bWhite">
    <div>
      <div class="nohover">
        <!-- 西药 -->
        <template>
          <ever-table
            :class="addAbnormalCls"
            ref="table"
            border
            :key="metaData.sourceCode"
            :table-default-cell-value="tableDefaultCellValue"
            :columns="tableColumns"
            :data="tableData"
            table-class="no-margin-table small-padding"
            :checkbox-width="40"
            :is-drag-table="true"
            :is-record-url-params="false"
            :not-select-checkbox="true"
            :selectable="selectable"
            :show-checkbox="showCheckbox"
            :span-method="arraySpanMethod"
            @selection-change="handleSelectionChange"
            @eventChange="eventChange">
            <template v-for="column in renderColumns" :slot="column.slotName">
              <el-table-column
                :key="column.prop"
                :slot="column.prop"
                :label="column.label"
                :width="column.width"
                :prop="column.prop">
                <template slot="header" slot-scope="{}">
                  {{column.label}}
                </template>
                <template slot-scope="scope">
                  <coltd-functional :row="scope.row" :index="scope.$index" :render="column.render" :td-key="column.prop"></coltd-functional>
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { tableDefaultCellValue, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant'
// import SpanMethodMixin from '@/warehouse/views/drug/mixin/span.method.mixin.js'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
export default {
  props: {
    source: Number,
    showCheckbox: {
      type: Boolean,
      default: true
    },
    parentIndex: { // 表格 列表index(当前数据的父数据下标)
      type: Number,
      default: 0
    },
    selectable: { // Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
      type: Function,
      default: () => true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    metaData: { // 元数据，完整的一条数据集
      type: Object,
      default: () => ({})
    },
    tableConfigId: { // 动态表格id
      type: String,
      required: true
    },
    type: { // 审核状态 8：待审  9: 待入库
      type: Number
    },
    operateMode: Number, // 操作模式：1、 按处方明细处理  2、按处方批量处理
    columns: {
      type: Array,
      required: true
    }
  },
  // mixins: [SpanMethodMixin],
  created () {
  },
  computed: {
    oriMetaData () {
      // return this.metaData.taskType ? this.metaData : Object.assign(this.metaData, this.metaData.backStocksItemDtoList[0])
      return true
    },
    addAbnormalCls () { // 异常添加间距样式
      // const { identification, taskType } = this.metaData
      const cls = {
        design_table: true,
        flex1: false,
        design_error_table: false
      }
      return cls
    },
    tableColumns () {
      return this.columns.filter(column => (!column.source || column.source === this.source))
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
  },
  data () {
    return {
      tableDefaultCellValue,
      CHINESE_MEDICINE_TYPE,
      selectionTable: [], // table明细选中数据
    }
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if ((columnIndex === 0 || columnIndex === 3) && row.thisCont >= 2) {
        if (((rowIndex - (row.thisIndex + row.thisCont)) % row.thisCont) === 0) {
          return {
            rowspan: row.thisCont,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleSelectionChange (selection) {
      selection = selection.filter(item => {
        return !item.checkBoxId || item.countArr
      })
      this.selectionTable = selection
      this.$emit('selection-change', selection, this.type)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
  },
  components: {
    ColtdFunctional
  }
}
</script>

<style lang="scss" scoped>
.flex_width {
  flex: 0 0 24px
}
.wh20{
  width: 20px
}
.prescription {
  line-height: 28px;
  height: 28px;
}
.information {
  margin: 0;
  padding: 0;
  li {
    label {
      color: #666;
      margin-right: 10px;
    }
    margin-right: 20px;
    display: inline-block;
  }
}
.color1 {
  background-color: rgba(250, 205, 145, 1);
}
.color0 {
  background-color: rgba(236, 128, 141, 1);
}
.color2 {
  background-color: rgba(115, 199, 118, 1);
}

.statusStyle {
  width: 60px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  padding: 0 10px;
  text-align: center;
}
.ui_dialog_02.dialogVisible /deep/ .el-dialog__header {
  display: none
}

.chinese-status {
  font-weight: bold;
  width: 80px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  color: #1c78ef;
  background: #d6e9ff;
  border-radius: 10px
}
.font-size-custom /deep/ svg {
  font-size: 20px;
  position: relative;
  top: 3px;
}
.backgroud {
  background-color: #f1f1f1;
}
.nohover {
  /deep/ .el-table__body /deep/ tr:hover>td{
    background-color: transparent !important;
  }
}
</style>
