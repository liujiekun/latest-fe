/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-15 16:20:01
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-20 18:32:35
 */
<template>
  <div class="main10">
    <slot></slot>
    <div class="f14" v-if="isUddPackage">
      <template v-if="sourceCode !== 'noPrintCode'">
        <span :class="{red: resetUddPackage}"><label class="cGray">UDD：</label><strong >{{sourceCode}}</strong></span>
        <el-button
          type="text"
          class="ml10"
          v-if="resetUddPackage"
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint"
          @click="updateReprintUdd">重新生成UDD</el-button>
        <el-button
          type="text"
          size="small"
          v-else
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint"
          @click="makeUpPrint">
          <i class="iconfont icon-menzhen-dayin ml10" title="打印"></i></el-button>
          <span class="ml10" v-if="pageType == 4"><label class="cGray">发药完成时间：</label>{{finishTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
        </template>
    </div>
    <ever-table
      ref="table"
      border
      table-class="no-margin-table small-padding"
      class="design_table"
      v-if="newTableData[0]"
      :key="newTableData[0].id"
      :table-default-cell-value="tableDefaultCellValue"
      :columns="tableColumns"
      :data="newTableData"
      :checkbox-width="checkboxWidth"
      :span-method="objectSpanMethod"
      :is-drag-table="true"
      :is-record-url-params="false"
      :not-select-checkbox="true"
      :selectable="selectable"
      :show-checkbox="showCheckbox"
      :row-class-name="rowClassName"
      @eventChange="eventChange"
      @selection-change="handleSelectionChange">
      <template v-for="column in renderColumns" :slot="column.slotName">
        <el-table-column
          :key="column.prop"
          :slot="column.prop"
          :label="column.label"
          :width="column.width"
          :prop="column.prop">
          <template slot="header" slot-scope="scope">
            {{column.label}}
          </template>
          <template slot-scope="scope">
            <coltd-functional
              :row="scope.row"
              :index="scope.$index"
              :pageType="pageType"
              :render="column.render"
              :td-key="column.prop">
            </coltd-functional>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <!-- 修改 编辑表格数据弹框 -->
    <modify-table-dialog
      ref="modifyDialog"
      v-if="dialogVisibleTable"
      :is-udd-package="modifyIsUddPackage"
      :current-index="currentIndex"
      :current-row="currentRow"
      @close-dialog="handlerCloseDialog">
    </modify-table-dialog>
    <!-- 无法到货弹框 -->
    <unreachable
      v-if="unReachableBoolean"
      :visible.sync="unReachableBoolean"
      :row="unReachableRow">
    </unreachable>
  </div>
</template>

<script>
import HospitalParameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import { omit, size } from 'lodash'
import ModifyTableDialog from './modify.table.dialog'
import { UDD_OPTIONS, FATHER_SON_OPTIONS, ZH_MEDICINE_TYPE, CHINESE_DRUG_OPTIONS, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant.js'
import Unreachable from './unreachable'
import { everprint } from '@/util/print'
export default {
  props: {
    columns: { // 表格展示列配置项
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    isUddPackage: { // 是否是udd药包
      type: Boolean,
      default: false
    },
    pageType: { // 页面标识 1、任务打印 2、发药列表 3、缺货任务 4、发药记录
      type: Number,
      default: 1
    }
  },
  mixins: [HospitalParameters],
  data () {
    return {
      currentIndex: 0, // 当前点击这一个明细的下标数值 => 给（编辑）异常使用
      currentRow: {},
      disabledPrint: false,
      dialogVisibleTable: false,
      modifyIsUddPackage: false,
      unReachableBoolean: false, // 无法到货组件显示隐藏字段
      unReachableRow: {}, // 无法到货数据明细
    }
  },
  mounted () {
    this.$bus.$on('notify-chinese-medicine-edit', (row) => { // 接收中药组件派发的修改事件
      this.handlerTableEdit(row)
    })
  },
  beforeDestroy () {
    this.$bus.$off('notify-chinese-medicine-edit')
  },
  methods: {
    unReachableHandler (row) { // 无法到货
      this.unReachableRow = row
      this.unReachableBoolean = true
    },
    makeUpPrint () { // 补打udd药包
      // mainFlag：父子医嘱标识 taskType: 物资类型 sourceCode: udd code
      const { mainFlag, sourceCode } = this.tableData[0]
      let code
      this.uddApi.createUdd({ sourceCode, storageRoomId: this.currentStorageRoomId }).then(res => {
        if (size(res)) {
          if (ZH_MEDICINE_TYPE.includes(`${Object.keys(res)[0]}`)) { // 中药 (中药打印处方)
            code = this.getProcessCode(CHINESE_DRUG_OPTIONS, 'processItemChinDispensePrintObject')
          } else {
            if (mainFlag > 0 && this.dispensePatient) { // 父子医嘱, 并且需要按照父子医嘱模板打印
              code = this.getProcessCode(FATHER_SON_OPTIONS, 'processItemPatientObject')
            } else {
              code = this.getProcessCode(UDD_OPTIONS, 'processItemPasteObject')
            }
          }
          if (code) {
            everprint(code, { sourceCodeList: [sourceCode] })
            console.log(code, { sourceCodeList: [sourceCode] }, '补打udd')
          } else {
            this.$messageTips(this, '', '请联系系统管理员设置库房打印信息')
          }
        }
      })
    },
    getProcessCode (list, name) {
      const configObj = this.currentProcessConfig.processItemObject
      return configObj[name] ? list.find(row => +configObj[name].value === row.id).code : ''
    },
    updateReprintUdd () { // 重新生成udd药包
      this.$confirm('原UDD药包内的全部未取消药品会生成新的UDD药包，所有取消的药品将不会再显示', '重新生成', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uddApi.updateReprintUdd({ sourceCode: this.sourceCode }).then(res => {
          if (size(res)) {
            this.$messageTips(this, 'success', '重新生成UDD成功')
            this.$bus.$emit('hospital:notify-recreate-reprintUdd', res) // 派发给公共methods.mixin执行打印udd包
          }
        })
      }).catch(_ => { })
    },
    rowClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.status === 5) return 'cGray'
    },
    handlerTableEdit (row) { // table 修改操作 （标记异常、删除异常、补打等）
      // 表格列 “改” 事件 src/warehouse/views/drug/columnpool/hospital.column.js
      // beforeHtmlEvent: 'handlerTableEdit'
      // 需要获取当前明细下标
      this.currentIndex = this.tableData.findIndex(item => item.id === row.id)
      this.currentRow = row
      this.dialogVisibleTable = true
      this.$nextTick(_ => {
        this.$refs.modifyDialog.dialogVisible = true
        this.modifyIsUddPackage = this.isUddPackage
      })
    },
    handlerCloseDialog () {
      this.dialogVisibleTable = false
    },
    handleSelectionChange (selection) {
      // 1:患者列表选择项 2:发药明细选择项noPrintCode
      this.$emit('selection-change', selection, 2)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.isUddPackage) { // udd包，合并第一列(标题选择)
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: this.tdLen,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else {
        // 非udd包任务
        const { mainFlag, mainGroupId } = row
        // 父子医嘱id + 创建时间
        const mapMainGroup = this.getMainGroupIds.get(mainGroupId)
        if (
          columnIndex === 0 &&
          mapMainGroup &&
          mainFlag > 0
        ) { // 住院发药任务
          const { len: adviceLength, prev } = mapMainGroup
          if (adviceLength === 1) return
          if (((rowIndex - prev) % adviceLength) === 0) {
            return {
              rowspan: adviceLength,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    selectable (row) {
      const { mainFlag, mainGroupId, identification, shortage, status, _sourceData } = row
      // 父子医嘱id mainFlag > 0
      const disabled = this.newTableData.filter(item => (item.mainGroupId === mainGroupId && mainFlag > 0)).some(item => (item.identification || item.shortage === 23 || item.status === 4))
      const hasCancel = _sourceData.some(task => { // 中药中存在无法到货数据
        return task.status === 4
      })
      return mainFlag > 0 ? !disabled : !(identification || shortage === 23 || status === 4 || hasCancel)
    },
    filterColumns () {
      return this.columns.filter(column => {
        // 没有定义pageType 代表所有页面都需要展示该表格列
        // isUddPackage, 并且有uddchecked字段：如果是udd包表格列表 展示自定义checkbox按钮
        return !column.pageType || (
          this.isUddPackage ? column.pageType.includes(this.pageType) : !column.uddChecked && column.pageType.includes(this.pageType)
        )
      })
    },
    addCustomFieldForTableData (list) { // 自定义表格udd数据选择框字段: customSelectionValue
      if (!this.isUddPackage) {
        return list.map(item => {
          const { mainFlag, mainGroupId } = item
          if (mainFlag > 0) { // 父子医嘱
            return {
              ...item,
              _sourceData: list.filter(row => row.mainGroupId === mainGroupId && mainFlag > 0)
            }
          } else {
            return {
              ...item,
              _sourceData: [item]
            }
          }
        })
      }
      return list.map(item => ({ ...item, customSelectionValue: true, _sourceData: JSON.parse(JSON.stringify(list)) }))
    },
    groupingChineseMedicine () { // 组合中药数据，this.tableData[0]._sourceData 整包中药数据集
      if (this.pageType === 3) {
        return this.tableData.map(row => ({
          ...row,
          _sourceData: [row]
        }))
      }
      let _arr = []
      this.tableData.forEach(row => { // 数据中的 _sourceData 是中药所有数据集合
        const { taskType, adviceExecuteId } = row
        if (CHINESE_MEDICINE_TYPE.includes(String(taskType))) {
          const index = _arr.findIndex(item => item.adviceExecuteId === adviceExecuteId)
          if (index > -1) {
            _arr[index]._sourceData.push(row)
          } else {
            _arr.push(Object.assign({}, row, { _sourceData: [row] }))
          }
        } else {
          _arr.push(row)
        }
      })
      return _arr
    }
  },
  computed: {
    chineseMedicinePackage () { // 中药包
      return this.tableData.some(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType)))
    },
    newTableData () {
      const hasCancel = this.tableData.find(item => item.status === 5) // 存在已取消数据
      // 表格 选择列 如果存在已取消数据，在每第一个条明上添加 自定义字段 isCustomCancel , 提供给hospital.column.js中处理是否渲染checkbox
      if (hasCancel) this.tableData[0].isCustomCancel = 1
      // 中药并且是中药包， 把整个药包所有明细数据放入第一条的tableData中
      return ((
        this.chineseMedicinePackage &&
        this.isUddPackage
      ) ? [Object.assign({}, omit(this.tableData[0], ['localSettingObject']), { _sourceData: this.tableData, customSelectionValue: true })] : (
        this.chineseMedicinePackage &&
        !this.isUddPackage
      ) ? this.groupingChineseMedicine() : this.addCustomFieldForTableData(this.tableData))
    },
    sourceCode () {
      return this.tableData[0].sourceCode
    },
    tableColumns () {
      return this.filterColumns()
    },
    renderColumns () {
      return this.tableColumns.filter(column => this.chineseMedicinePackage ? (column.render && !column.noChineseMedicine) : (!column.isChineseMedicine && column.render))
    },
    tdLen () {
      return this.newTableData.length
    },
    resetUddPackage () {
      const cancelSize = this.newTableData.filter(item => item.status === 5).length
      return this.isUddPackage && cancelSize && cancelSize < this.tdLen
    },
    getMainGroupIds () {
      const obj = new Map()
      if (!this.isUddPackage) {
        let prev = 0 // 上一条父子医嘱数据数量
        let prevGroupId = '' // 上一条父子医嘱数据id
        this.newTableData.forEach(task => {
          const { mainGroupId, mainFlag } = task
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId
          if (mainFlag > 0) {
            if (!obj.has(compose)) {
              const map = obj.get(prevGroupId)
              obj.set(compose, {
                list: [task],
                prev: map ? map.prev + prev : prev,
                len: 1
              })
            } else {
              const map = obj.get(compose)
              map.list.push(task)
              map.len = prev = map.list.length
              prevGroupId = compose
            }
          } else {
            // 非父子医嘱下，给prev++ 以保证下一个父子医嘱合并单元格能以正确的开始数开始
            prev++
          }
        })
        return obj
      }
      return obj
    },
    finishTime () { // 发药完成时间
      return this.tableData[0].finishTime
    }
  },
  watch: {
    newTableData: {
      handler (data) {
        this.$nextTick(_ => {
          if (!this.isUddPackage) {
            const nData = data.filter(row => {
              const { mainFlag } = row
              return mainFlag === 0 || mainFlag === 1
            })
            nData.forEach(row => {
              // canSelected: src/warehouse/views/drug/mixin/hospital.parameters.js
              if (this.canSelected(row._sourceData)) {
                this.$refs.table.$refs.everTable.toggleRowSelection(row, true)
              }
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    ColtdFunctional,
    ModifyTableDialog,
    Unreachable
  }
}
</script>
