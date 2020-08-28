<template>
  <div :class="{'dis-plist-item': pageType === 2, 'send': pageType === 2, 'table-content': true}" >
<!--    <el-tabs value="first" @tab-click="tabClick"></el-tabs>-->
    <div :class="{'tab-btns': true, 'has-height':pageType === 1 && !isChinese() }" v-if="pageType !== 3">
      <el-radio-group v-show="isChinese()"  v-model="tabActive" @change="tabClick">
        <el-radio-button label="first">发药明细</el-radio-button>
        <el-radio-button label="second">发药汇总</el-radio-button>
      </el-radio-group>
    </div>
    <div class="dis-title-info" v-if=" pageType === 2 || pageType === 4">
      <div class="dis-title-item">摆药单：<span :class="{ 'danger': pageType === 2 && showCheckbox }">{{currentData.code}}</span>
        <el-button
          type="text"
          class="ml10 print-btn"
          v-if="!(pageType === 2 && showCheckbox)"
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint"
          @click="printCenter(pageType, currentData.id, true)" >
          <i class="iconfont icon-menzhen-dayin ml10" title="打印"></i>
        </el-button>
      </div>
      <div v-if="pageType === 2 && showCheckbox" class="dis-title-item re-dis-btn" >
        <el-button
          type="text"
          class="ml10"
          v-if="!(totalObj.errTotal.length === tableData.length&&tableData.length === 1)"
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint || totalObj.errTotal.length === tableData.length"
          @click="goDispensing" >
          重新生成摆药单
        </el-button>
        </div>
      <div class="dis-title-item">{{pageType === 4 ? '发药时间' : '打印时间'}}：{{currentData[pageType === 4 ? 'sendTime' : 'dispensingTime']}}</div>
      <div class="dis-title-item">病区：{{currentData.areaName}}</div>
      <div class="dis-title-item">药房：{{currentData.storageRoomName}}</div>
    </div>
    <div v-show="tabActive === 'first'" label="发药明细" name="first">
      <div class="table-box">
        <ever-table
          ref="table"
          border
          table-class="no-margin-table small-padding"
          v-if="newTableData[0]"
          :key="currentComponentKey"
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
          @select-all="handleSelectionChange"
          @select="handleSelectionChange"
          @selection-change="getCheckRes"
        >
          <!--          :max-height="handelMaxHeight()"-->
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

      </div>
    </div>
    <div v-show="tabActive === 'second'" label="发药汇总" name="second">
      <div class="table-box">
        <!--          <el-table-->
        <!--            ref="totalTable"-->
        <!--            :data="totalTableData || []"-->
        <!--            @select="handleTotalSelectionChange"-->
        <!--            @select-all="handleTotalSelectionChange"-->
        <!--          >-->
        <!--            <el-table-column type="selection" width="55"></el-table-column>-->
        <!--            <el-table-column  prop="name" label="物资名称" >-->
        <!--              <template slot-scope="scope">-->
        <!--                <span>{{scope.row.name}}</span>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
        <!--            <el-table-column  prop="creator" label="规格" ></el-table-column>-->
        <!--            <el-table-column  prop="creator" label="数量" >-->
        <!--              <template slot-scope="scope">-->
        <!--                <span>{{scope.row.num}}</span>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
        <!--          </el-table>-->
        <ever-table
          ref="totalTable"
          border
          table-class="no-margin-table small-padding"
          :table-default-cell-value="tableDefaultCellValue"
          :columns="totalcolumns"
          :data="totalTableData"
          :checkbox-width="checkboxWidth"
          :span-method="objectSpanMethod"
          :is-drag-table="true"
          :is-record-url-params="false"
          :not-select-checkbox="true"
          :selectable="selectable"
          :show-checkbox="showCheckbox"
          :row-class-name="rowClassName"
          @select="handleTotalSelectionChange"
          @select-all="handleTotalSelectionChange"
        >
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
      </div>
    </div>
    <div class="dis-btn-box">
      <el-button type="primary" size="medium" @click="goDispensing" v-if="pageType === 1" :loading="sendDisable"  :disabled="sendDisable">
        摆药
      </el-button>
      <el-button type="primary" size="medium" @click="goSend"  v-if="pageType === 2 && !showCheckbox" :loading="sendDisable"  :disabled="sendDisable">
        发药
      </el-button>
    </div>
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
import checkCdssApi from '@/warehouse/views/drug/api/processapi.js'
import { size, get } from 'lodash' // uniqBy
import ModifyTableDialog from './modify.table.dialog'
import { UDD_OPTIONS, FATHER_SON_OPTIONS, ZH_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant.js'
import Unreachable from './unreachable'
import { everprint } from '@/util/print'
import { floatTool } from '@/util/common'
// 打印预览
const preview = { preview: true, }

export default {
  props: {
    columns: { // 表格展示列配置项
      type: Array,
      required: true
    },
    listData: {
      type: [Object, Array],
      default: () => []
    },
    totalcolumns: { // 表格展示列配置项
      type: Array,
      required: true
    },
    currentData: {
      type: [Object, Array],
      default: () => { }
    },
    totalObj: {
      type: [Object, Array],
      default: () => { return { errTotal: [], cancelTotal: [] } }
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
    storageRoomId: String, // 当前库房id 或者 摆药单code
    pageType: { // 页面标识 1、任务打印 2、发药列表 3、缺货任务 4、发药记录
      type: Number,
      default: 1
    }
  },
  mixins: [HospitalParameters],
  data () {
    return {
      sendDisable: false,
      zhongyaotype: ['303', '304'],
      tabActive: 'first',
      currentIndex: 0, // 当前点击这一个明细的下标数值 => 给（编辑）异常使用
      currentRow: {},
      disabledPrint: false,
      dialogVisibleTable: false,
      modifyIsUddPackage: false,
      unReachableBoolean: false, // 无法到货组件显示隐藏字段
      unReachableRow: {}, // 无法到货数据明细
      totalTableData: [], // 汇总表格数据
      unCheckTotal: [], // 汇总表格没被选中数据
      totalCheckArr: [], // 汇总中表格被选中数据
      tableChecked: [],
      tableCacheArr: [], // 缓存的一份明细table数据
      openDialogStorageRoomId: '', // 当前打开库房id
      formateTableData: [],
      floatTool
    }
  },
  mounted () {
    this.onBus()
  },
  updated () {
    this.onBus()
  },
  beforeDestroy () {
    this.$bus.$off('notify-chinese-medicine-edit')
    this.$bus.$off('focus-dispensing-close-modify-dialog')
  },
  methods: {
    onBus () {
      this.$bus.$off('notify-chinese-medicine-edit')
      this.$bus.$off('focus-dispensing-close-modify-dialog')
      this.$bus.$on('notify-chinese-medicine-edit', (row) => { // 接收中药组件派发的修改事件
        this.$nextTick(_ => {
          this.handlerTableEdit(row)
        })
      })
      this.$bus.$on('focus-dispensing-close-modify-dialog', (row) => { // 接收中药组件派发的修改事件
        if (this.$refs.modifyDialog) {
          this.$refs.modifyDialog.handlerCloseDialog()
        }
        this.dialogVisibleTable = false
      })
    },
    formateNewTableData () {
      const hasCancel = this.tableData.find(item => item.status === 5) // 存在已取消数据
      // 表格 选择列 如果存在已取消数据，在每第一个条明上添加 自定义字段 isCustomCancel , 提供给hospital.column.js中处理是否渲染checkbox
      if (hasCancel) this.tableData[0].isCustomCancel = 1
      // if (this.pageType === 3) {
      //   return this.tableData
      // }
      // 中药并且是中药包， 把整个药包所有明细数据放入第一条的tableData中
      return this.chineseMedicinePackage && this.isUddPackage ? [Object.assign({}, this.tableData[0], { tableData: this.tableData })] : this.chineseMedicinePackage && !this.isUddPackage ? this.groupingChineseMedicine() : this.addCustomFieldForTableData(this.tableData)
    },
    handelMaxHeight () {
      if (this.listData.length === 1) return 1000000
      let clientHeight = document.body.clientHeight
      let listHeight = (clientHeight - 130) / 2 - 130 - (this.pageType === 2 ? 10 : 0)
      return listHeight > 150 ? listHeight : 150
    },
    isChinese () {
      if (this.tableData.length !== 0 && this.zhongyaotype.includes(this.tableData[0].taskType)) {
        return false
      } else {
        return true
      }
    },
    unReachableHandler (row) { // 无法到货
      this.unReachableRow = row
      this.unReachableBoolean = true
    },
    makeUpPrint () { // 补打udd药包
      // mainFlag：父子医嘱标识 taskType: 物资类型 sourceCode: udd code
      const { mainFlag, taskType, sourceCode } = this.tableData[0]
      let code
      this.uddApi.createUdd({ sourceCode }).then(res => {
        if (size(res)) {
          if (ZH_MEDICINE_TYPE.includes(`${taskType}`)) { // 中药 (中药打印处方)
            code = this.getProcessCode(UDD_OPTIONS, 'processItemPasteObject', 'code_zh')
          } else {
            if (mainFlag > 0 && this.dispensePatient) { // 父子医嘱, 并且需要按照父子医嘱模板打印
              code = this.getProcessCode(FATHER_SON_OPTIONS, 'processItemPatientObject', 'code')
            } else {
              code = this.getProcessCode(UDD_OPTIONS, 'processItemPasteObject', 'code')
            }
          }
          if (code) {
            everprint(code, [sourceCode])
          } else {
            this.$messageTips(this, '', '请联系系统管理员设置库房打印信息')
          }
        }
      })
    },
    getProcessCode (list, name, key) {
      const configObj = this.currentProcessConfig.processItemObject
      return configObj[name] ? list.find(row => +configObj[name].value === row.id)[key] : ''
    },
    updateReprintUdd () { // 重新生成udd药包
      this.uddApi.updateReprintUdd({ sourceCode: this.sourceCode }).then(res => {
        this.$bus.$emit('hospital:notify-reprintUdd', res) // 派发给公共methods.mixin执行打印udd包
      })
    },
    rowClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.status === 5) return 'cGray'
    },
    handlerTableEdit (row) { // table 修改操作 （标记异常、删除异常、补打等）
      const { storageRoomId, dispensingDrugBillsCode } = row
      // 集中摆药情况下， 可能存在多个库房 或 多个摆药单，每次编辑会把当前页面所有的编辑框都打开导致需要点击多次才能关闭（每次只打开一个当前操作库房的弹框）
      // if ((this.pageType === 1 && storageRoomId !== this.storageRoomId) || (this.pageType === 2 && dispensingDrugBillsCode !== this.storageRoomId)) return
      // 表格列 “改” 事件 src/warehouse/views/drug/columnpool/hospital.column.js
      // beforeHtmlEvent: 'handlerTableEdit'
      // 需要获取当前明细下标
      this.currentIndex = this.tableData.findIndex(item => item.id === row.id)
      this.currentRow = row
      this.dialogVisibleTable = true
      this.openDialogStorageRoomId = this.pageType === 1 ? storageRoomId : dispensingDrugBillsCode
      this.$nextTick(_ => {
        this.$refs.modifyDialog && (this.$refs.modifyDialog.dialogVisible = true)
        this.modifyIsUddPackage = this.isUddPackage
      })
    },
    handlerCloseDialog () {
      this.dialogVisibleTable = false
    },
    // handleSelectionChange (selection) {
    //   // 1:患者列表选择项 2:发药明细选择项noPrintCode
    //   this.$emit('selection-change', selection, 2)
    // },
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
        const { mainFlag, mainGroupId, createTime } = row
        // 父子医嘱id + 创建时间
        const mapMainGroup = this.getMainGroupIds.get(mainGroupId + createTime)
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
      const { mainFlag, mainGroupId, createTime, identification, shortage, status } = row
      // 父子医嘱id + 创建时间
      // const mapMainGroup = this.getMainGroupIds.get(mainGroupId + createTime)
      const disabled = this.newTableData.filter(item => (item.mainGroupId + item.createTime === mainGroupId + createTime)).some(item => (item.identification || item.shortage === 23))
      return mainFlag ? !disabled : !(identification || shortage === 23 || status === 5)
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
      let tempData = list.map(item => ({ ...item, _sourceData: [item] }))
      this.formateTableData = [...tempData]
      return tempData
    },
    groupingChineseMedicine () {
      let _arr = []
      this.tableData.forEach(row => {
        const { taskType, adviceExecuteId } = row
        if (CHINESE_MEDICINE_TYPE.includes(String(taskType))) {
          const index = _arr.findIndex(item => item.adviceExecuteId === adviceExecuteId)
          if (index > -1 && this.pageType !== 3) {
            _arr[index].tableData.push(row)
            _arr[index]._sourceData.push(row)
          } else {
            _arr.push(Object.assign({}, row, { tableData: [row], _sourceData: [row] }))
          }
        } else {
          _arr.push(row)
        }
      })
      return _arr
    },
    /************************************************
     * 住院集中摆药 新加方法
     */
    // 调用父组件 传已选数据
    getCheckRes (data) {
      if (data.length === 0) {
        this.totalTableData = []
      }
      this.tableCacheArr = data
      this.tableChecked = data
    },
    // 明细表 手动选择处理数据
    handleSelectionChange (data) {
      let tempdata = this.handelTotalList(data)
      this.totalTableData = tempdata
      this.totalCheckArr = [...tempdata]
      this.checkAllTotal()
    },
    // 选中 所有汇总表格
    checkAllTotal () {
      this.$nextTick(() => {
        this.$refs.totalTable.$refs.everTable.toggleAllSelection(true)
      })
    },
    // 明细表 手动选择具体处理数据
    handelTotalList (data) {
      let tempTotalCount = {}
      let tempTotalCountArr = []
      data.forEach((item, index) => {
        let key = item.materialsCode
        if (tempTotalCount[key]) {
          tempTotalCount[key].num = floatTool.add(tempTotalCount[key].num, item.num)
          tempTotalCount[key].children.push({ ...item })
        } else {
          tempTotalCount[key] = { ...item }
          tempTotalCount[key].num = item.num
          tempTotalCount[key].children = [{ ...item }]
        }
      })
      for (let key in tempTotalCount) {
        tempTotalCountArr.push(tempTotalCount[key])
      }
      return tempTotalCountArr
    },
    // 汇总表格 选中处理数据
    handleTotalSelectionChange (data) {
      this.tempTotalCheck = data
      this.unCheckTotal = this.getUnCheckTotal(data)
      if (this.tabActive === 'second') {
        this.tableChecked = this.newTableData.filter(item => {
          return data.some(child => child.localMaterialId === item.localMaterialId)
        })
      }
    },
    // 获取汇总没选中数据
    getUnCheckTotal (data) {
      let tempTotal = []
      this.totalCheckArr = data
      this.totalTableData.forEach((item, index) => {
        let findres = data.find((subitem, subindex) => {
          return subitem.id === item.id
        })
        if (!findres) {
          tempTotal.push(item)
        }
      })
      return tempTotal
    },
    // tab切换
    tabClick (data) {
      if (this.tabActive === 'first') {
        if (this.showCheckbox) {
          this.unCheckTotal.forEach((item, index) => {
            item.children.forEach((sitem, sindex) => {
              this.formateTableData.forEach((timem, tindex) => {
                if (timem.id === sitem.id) {
                  this.$refs.table.$refs.everTable.toggleRowSelection(timem, false)
                }
              })
            })
          })
          this.totalTableData = this.totalCheckArr
          this.checkAllTotal()
        }
      }
    },
    /**
     * @param tabActive 发药明细数据全部摆药完成恢复tab 到first
     */
    printCenter (type = false, id = false, tips = false, resetDisable = false, tabActive = false) {
      if (tabActive) this.tabActive = tabActive
      // 摆药完成恢复到发药明细
      this.sendDisable = false
      if (resetDisable) return
      let nowProcessConfig = this.$store.state.processConfig.thisStorageroomProcessConfig
      /** code分三种打印   中药汇总 JZ_ZYBY_HZ   西药汇总 JZ_XYBY_HZ  西药明细 JZ_XYBY_MX  **
       * nowProcessConfig.processItemObject.dispense_prepare_print 打印汇总
       * nowProcessConfig.processItemObject.dispense_paste 打印明细
       * */
      /** type 分三种 1.正常打印  2.补打   4.补打已发 和 pageType 对应除了重新生成 **/
      let nowTaskType = this.tableData[0].taskType
      let params = { frontMess: type || this.pageType } // 分三种 1.正常打印  2.补打   3.补打已发
      params.id = id || this.currentData.id // 当前摆药单id  还是  重新生成（第一次摆药）后的 id
      let isZy = this.zhongyaotype.includes(nowTaskType)
      let code = isZy ? 'JZ_ZYBY_HZ' : 'JZ_XYBY_HZ'
      if (!nowProcessConfig.processItemObject) return
      if (nowProcessConfig.processItemObject.dispensePreparePrint === 1 || nowProcessConfig.processItemObject.dispensePaste === 1) {
        if (isZy) {
          everprint(code, params, preview)
        } else {
          const runPrint = function runPrint () {
            if (nowProcessConfig.processItemObject.dispensePaste === 1) {
              everprint('JZ_XYBY_MX', params, preview)
            }
          }
          if (nowProcessConfig.processItemObject.dispensePreparePrint === 1) {
            everprint('JZ_XYBY_HZ', params, Object.assign({}, preview, {
              eventCb: (type) => {
                // 打印回调队列
                // 打印成功 或者 其他事件操作 会执行cb
                if (type === 'window-close') {
                  runPrint()
                }
              },
              cb: () => {
                runPrint()
              }
            }))
          }
        }
      }
      if (tips) {
        this.$messageTips(this, 'success', '打印成功')
      }
    },
    /**
     * 摆药 或者 重新摆药  注：摆药后 进行打印
     * http://jira.everjiankang.com/browse/WAR-263?filter=-1
     * 住院集中摆药摆药单打印（包含明细和汇总），增加打印预览功能
     */
    goDispensing () {
      if (this.tableChecked.length !== 0) {
        this.$confirm(this.pageType === 2 ? '重新生成摆药单？' : '确认摆药？', '请确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendDisable = true
          // 增加十八反、十九畏 用药提醒
          let localMaterialIds = this.tableChecked.filter(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType))).map(item => {
            return item.tableData.map(child => child.localMaterialId)
          }).flat()
          if (localMaterialIds.length) {
            checkCdssApi.checkCdssRule({ bizCode: 'THC_RULE_MZCFSH', localMaterialIds }).then(res => {
              if (res && res.length) {
                let message = res.map(item => item.message).join('<br>')
                return this.$confirm(message + '<br>"确认执行"将为您继续执行，"取消"则可返回修改。', '用药提示', {
                  confirmButtonText: '确认执行',
                  customClass: 'w_500',
                  dangerouslyUseHTMLString: true,
                }).then(() => {
                  this.$emit('goDispensing', { checkData: this.tableChecked, currentData: this.currentData, tableCacheArr: this.tableCacheArr.length, newTableData: this.newTableData.length }, this.printCenter)
                }).catch(() => {
                  this.sendDisable = false
                })
              } else {
                this.$emit('goDispensing', { checkData: this.tableChecked, currentData: this.currentData, tableCacheArr: this.tableCacheArr.length, newTableData: this.newTableData.length }, this.printCenter)
              }
            })
          } else {
            this.$emit('goDispensing', { checkData: this.tableChecked, currentData: this.currentData, tableCacheArr: this.tableCacheArr.length, newTableData: this.newTableData.length }, this.printCenter)
          }
        }).catch(() => { })
      } else {
        this.$messageTips(this, 'warning', '请选择药品')
      }
    },
    /**
     *  发药
     */
    goSend () {
      this.$confirm('确认发药？', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendDisable = true
        // 增加十八反、十九畏 用药提醒
        let localMaterialIds = this.tableData.filter(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType))).map(item => item.localMaterialId)
        if (localMaterialIds.length) {
          checkCdssApi.checkCdssRule({ bizCode: 'THC_RULE_MZCFSH', localMaterialIds }).then(res => {
            if (res && res.length) {
              let message = res.map(item => item.message).join('<br>')
              return this.$confirm(message + '<br>"确认执行"将为您继续执行，"取消"则可返回修改。', '用药提示', {
                confirmButtonText: '确认执行',
                customClass: 'w_500',
                dangerouslyUseHTMLString: true,
              }).then(() => {
                this.$emit('goSend', { tableData: this.tableData, currentData: this.currentData }, this.changeDisable)
              }).catch(() => {
                this.sendDisable = false
              })
            } else {
              this.$emit('goSend', { tableData: this.tableData, currentData: this.currentData }, this.changeDisable)
            }
          })
        } else {
          this.$emit('goSend', { tableData: this.tableData, currentData: this.currentData }, this.changeDisable)
        }
      }).catch(() => { })
    },
    changeDisable () {
      this.sendDisable = false
    },
  },
  computed: {
    chineseMedicinePackage () { // 中药包
      return this.tableData.some(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType)))
    },
    currentComponentKey () {
      return this.newTableData[0] ? get(this.newTableData[0], 'id', '') : ''
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
          const { mainGroupId, mainFlag, createTime } = task
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId + createTime
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
    }
  },
  watch: {
    // newTableData: {
    //   handler (data) {
    //     this.$nextTick(_ => {
    //       if (!this.isUddPackage) {
    //         uniqBy(data, 'mainGroupId').forEach(row => {
    //           // canSelected src/warehouse/views/drug/mixin/hospital.parameters.js
    //           if (this.canSelected(row._sourceData)) {
    //             // this.$refs.table.$refs.everTable.toggleRowSelection(row, true)
    //           }
    //         })
    //       } else {
    //         if (this.canSelected(data[0]._sourceData)) {
    //           // this.$refs.table.$refs.everTable.toggleRowSelection(data[0], true)
    //         }
    //       }
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // }
    tableData: {
      handler (data) {
        if (data && data.length !== 0) {
          let unCheckCol = false
          if (this.pageType === 2) {
            unCheckCol = data.find((item, index) => {
              return (item.identification || item.shortage === 23)
            })
          }
          if (!unCheckCol && this.pageType !== 1 && this.pageType !== 3) {
            this.totalTableData = this.handelTotalList(data)
          } else {
            this.totalCheckArr = []
            this.totalTableData = []
          }
        }
        this.newTableData = this.formateNewTableData(data)
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
<style lang="less" scoped>
  .table-content{
    padding: 5px;
  }
  .table-content /deep/ .el-header.flex_scroll{
    overflow: auto;
  }
  .table-content /deep/ .el-main.border-main ,
  .table-content /deep/ .el-main.flex_column_full_hidden,
  .table-content /deep/ .el-main.flex_scroll{
    padding: 0 !important;
  }
  .table-content /deep/ .el-container .flex_column_full_hidden{
    padding: 10px;
  }
  .table-content /deep/  .common-tree-box .el-tree{
    border-top: none;
  }
  .table-content /deep/ .el-checkbox__inner{
    transition: none;
  }
  .table-content /deep/ .el-checkbox__inner:after{
    transition: none;
  }
  .table-content.send /deep/.el-tabs__header {
    margin: 0 0 44px;
  }
  .dis-btn-box{
    text-align: center;
    margin-top: 15px;
  }
  .dis-title-info{
    /*position: absolute;*/
    /*top: 55px;*/
    margin-bottom: 10px;
    .dis-title-item{
      display: inline-block;
      color: #333;
      margin-right: 20px;
      font-size: 14px;
      &.re-dis-btn{
        color: #1c7bef;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
  .tab-btns{
    margin-bottom: 10px;
  }
  .has-height{
    height: 35px;
  }
  .print-btn{
    margin-left: 0px;
  }
  .dis-plist-item{
    background: #fff;
    padding: 10px;
    border-bottom: solid 1px #ededed;
  }
</style>
