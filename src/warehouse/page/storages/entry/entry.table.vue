<template>
  <!-- 查询添加商品 -->
  <div>
    <div class="invoice" v-if="description && description.purchaseSaleType === 1 && (status !== 10 || (status === 10 && !list.more))" style="margin-top: 0px">
      <el-form :inline="true" class="demo-form-inline" onsubmit="return false;" size="small">
        <el-form-item label="发票号：" ref="invoiceTitle">
          <el-input
            v-if="list.invoiceStatus === 0"
            placeholder="请输入发票号"
            v-model="list.invoiceNo"
            size="small"
            clearable
          ></el-input>
          <span v-if="list.invoiceStatus === 1">发票未到</span>
          <span v-if="list.invoiceStatus === 3">{{list.invoiceNo}}</span>
        </el-form-item>
        <el-form-item style="width: 200px">
          <div>
            <el-button
              type="text"
              v-if="list.invoiceStatus === 0"
              @click="handleSaveInvoice(list)"
            >保存</el-button>
            <el-button
              type="text"
              v-if="((list.invoiceStatus === 1 || list.invoiceStatus === 3) && status !== 11) || (status === 11 && list.invoiceStatus === 3 && (itemKey || switchInow) && list.edit)"
              @click="handleEditInvoice()"
            >修改</el-button>
            <el-button
              type="text"
              v-if="list.invoiceStatus === 1 && status === 11 && !list.edit"
              @click="handleEditInvoice()"
            >补录发票</el-button>
            <el-button
              type="text"
              v-if="status !== 11 && list.invoiceStatus === 0 && !parentData.some(item => item.invoiceStatus === 1)"
              @click="handleNoInvoice(1)"
            >发票未到</el-button>
          </div>
        </el-form-item>
        <el-form-item label="发票金额：">
          <span class="yellow">¥{{fpPrice | formatToFinacial(4)}}</span>
        </el-form-item>
        <el-button
          v-if="(status === 9 && ((itemKey || (!itemKey && list.item.length > 1)) || list.invoiceStatus !== 0)) || (status == 10 && !list.more)"
          @click="deleteListItem"
          type="text" class="fr">删除发票及物资</el-button>
      </el-form>
    </div>
    <div class="table">
      <!-- 查询添加商品 -->
      <div>
        <el-table
          border
          ref="additem"
          :data="list.item"
          class="tableClass"
          v-ever-bind-enter="{resetHead: 2}"
          :span-method="arraySpanMethod"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName">
          <el-table-column
            v-if="objId && (status === 10 || list.edit || status === 13)"
            type="selection"
            width="35">
          </el-table-column>
          <el-table-column
            v-if="objId && (status === 10 || list.edit || status === 13)"
            label="操作"
            width="50"
            align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="operatingClick(scope.$index, $event)">•••</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="物资名称">
            <template slot-scope="scope">
              <material-select
                v-if="(scope.$index === list.item.length - 1 && (!objId || status === 9) && !scope.row.add) || (objId && !scope.row.localMaterialId && (status === 10 || status === 13))"
                ref="remoteselect"
                :params="queryParams"
                :needObjFlag="true"
                @change="handleSelect"
              ></material-select>
              <span v-else>
                <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            label="规格">
            <template slot-scope="scope">
              <span>{{scope.row.spec || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            label="货位号">
            <template slot-scope="scope">
              {{scope.row.freightCode || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            label="采购数量"
            align="center"
            width="80"
            v-if="billCode">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                {{scope.row.expectNum}}{{scope.row.packagUnitName}}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop label="生产批号" align="center" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                <el-input
                  v-if="status !== 11"
                  style="width: 80px"
                  size="small"
                  placeholder="生产批号"
                  v-model="scope.row.batchNum"
                  @blur="handlerBatchBlur(scope.row, scope.$index)"
                  @input="handlerBatchNum(scope.row, scope.$index)">
                </el-input>
                <span v-else>
                  {{scope.row.batchNum}}
                </span>
                <span v-if="status === 9" style="width:25px;display:inline-block; vertical-align: middle;">
                  <i v-if="scope.row.mark"
                    @click="addBatchNum(scope.row, scope.$index)"
                    class="iconfont icon-tianjiabingli fr"></i>
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop width="140" align="center" label="生产日期">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                <date-picker
                  v-if="status !== 11"
                  size="small"
                  v-model="scope.row.produceDate"
                  align="right"
                  type="date"
                  :disabled="scope.row.isbatch && scope.row.isbatch ? true : false"
                  placeholder="选择日期"
                  @change="handlerDate(scope.row, 'produceDate', '生产日期不能大于有效期，请重新选择')"
                  :outformat="'yyyy-MM-dd'"
                ></date-picker>
                <span v-else>
                  {{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop width="140" align="center" label="有效期">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                <date-picker
                  v-if="status !== 11"
                  size="small"
                  v-model="scope.row.validityDate"
                  align="right"
                  :disabled="scope.row.isbatch && scope.row.isbatch ? true : false"
                  type="date"
                  @change="handlerDate(scope.row, 'validityDate', '有效期不能小于生产日期，请重新选择')"
                  placeholder="选择日期"
                  :outformat="'yyyy-MM-dd'"
                ></date-picker>
                <span v-else>
                  {{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="入库数量" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <span v-if="status !== 11">
                  <el-input
                    placeholder="入库数量"
                    v-model="scope.row.num"
                    type="number"
                    size="small"
                    style="width:70px"
                    @blur="calcInboundNum(scope.row)"
                  ></el-input>
                </span>
                <span v-else>
                  {{scope.row.num}}
                </span>
                <span style="width:25px;display:inline-block; vertical-align: middle;" >
                  {{scope.row.packagUnitName}}
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="采购单价" align="center" width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <el-input-number
                  class="tablenumber"
                  v-if="status !== 11"
                  placeholder="采购单价"
                  v-model="scope.row.price"
                  type="number"
                  size="small"
                  :precision="4"
                  :controls="false"
                  :disabled="(description && description.purchaseSaleType === 2 && scope.row.localMaterialId && (scope.row.unitPrice || status === 10)) ? true : false"
                  @blur="handlePrice(scope.row)"
                ></el-input-number>
                <span v-else>
                  {{scope.row.price | formatToFinacial(4)}}
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="90"
            align="center"
            label="入库金额">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <span v-if="scope.row.price !== undefined">
                  {{scope.row.showTotalPrice | formatToFinacial(4)}}
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!objId || status === 9"
            prop="id" width="90" label="操作" align="center">
            <template slot-scope="scope">
              <span
                @click="handleDeleteRow(list.item, scope.$index, scope.row)"
                v-if="list.item.length > 1">
                <i class="iconfont icon-bingli-shanchu"
                  :class="{'blue': !btnGray, 'cGray': btnGray}">
                </i>
              </span>
              <el-button type="text"
                v-if="scope.$index === list.item.length - 1"
                @click="handleAddRow(scope.row)">
                <i
                  class="iconfont icon-tianjiabingli"
                  :class="{ 'blue': !btnGray, 'cGray': btnGray }"
                  >
                </i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右键操作按钮列表 -->
    <contextmenu
      v-if="objId && (status === 10 || list.edit || status === 13)"
      ref="rightClick"
      :class-name="rowClass"
      :menu="contextList"
      @menu="getMenuList"
      @select="contextSelect">
    </contextmenu>
  </div>
</template>

<script>
import { floatTool, patch, SPEC_CODE, CHINESE_MEDICINE_TYPE, PACKAGE_CODE } from '@/util/common'
import api from '../store/enterapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import remoteSelect from '../../joinstorage/remoteselect'
import contextmenu from '@/workspace/components/contextmenu'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
import entryCheck from './entrycheck.js'
const menuList = [
  { id: '1', name: '添加到发票号', disabled: false, methodName: 'addInvoiceList' },
  { id: '2', name: '归为发票未到', disabled: false, methodName: 'addInvoiceList' },
  { id: '3', name: '+ 加物资', disabled: false, methodName: 'addRowData' },
  { id: '4', name: '- 删物资', disabled: false, methodName: 'handleDeleteRow' },
  { id: '5', name: '+ 加批号', disabled: false, methodName: 'addBatchNum' },
  { id: '6', name: '- 删批号', disabled: false, methodName: 'handleDeleteRowBatchNum' },
]
export default {
  mixins: [entryCheck],
  props: {
    parentData: {
      type: Array,
      default: () => ({})
    },
    billCode: {
      type: String
    },
    list: {
      type: Object,
      default: () => ({})
    },
    itemKey: Number,
    queryParams: {
      type: Object,
      default: () => { }
    },
    tableCode: {
      type: Object,
      default: () => { }
    },
    description: {
      type: Object,
      default: () => { }
    },
    invoiceNos: {
      type: Array,
      default: () => []
    },
    status: Number
  },
  created () {
    this.contextList = JSON.parse(JSON.stringify(menuList))
    this.rowClass = this.rowClass + this.itemKey
    if (this.description && this.description.purchaseSaleType === 2) {
      this.contextList = this.contextList.filter(item => !['1', '2'].includes(item.id))
    } else {
      if (this.status === 11) {
        this.contextList = this.contextList.filter(item => ['1', '2'].includes(item.id))
      }
    }
  },
  data () {
    return {
      objId: this.$route.params.id,
      api,
      isRight: false, // 是否是右键弹窗操作
      SPEC_CODE,
      PACKAGE_CODE,
      CHINESE_MEDICINE_TYPE,
      getMaterialInfoApi,
      cachePrice: '',
      fpPrice: 0,
      switchInow: false,
      rowClass: 'sendContextRow',
      selectLists: [],
      contextList: [],
      REMOTE_METHODS_PLACEHOLDER,
    }
  },
  computed: {
    btnGray () {
      if (this.list.item && this.list.item.length && this.list.item.length === 1) {
        const data = this.list.item[0]
        let { localMaterialId, num, price } = data
        if (localMaterialId && num && (price === 0 || price)) {
          return false
        } else {
          return true
        }
      }
    },
    newRowClass () {
      if (this.list.item.length) {
        return this.rowClass + this.itemKey
      } else {
        return 'el-table__empty-block'
      }
    }
  },
  methods: {
    handlerBatchBlur (row, index) { // 校验同一物资是否有相同批次
      const batchList = this.list.item.filter(item => { return row.localMaterialId === item.localMaterialId })
      let mater = []
      if (batchList) {
        batchList.forEach(batch => {
          if (batch.batchNum === row.batchNum) {
            mater.push(batch.batchNum)
          }
        })
        if (mater.length > 1) {
          row.batchNum = ''
          return this.$messageTips(this, 'warning', '该物资已有相同的生产批次，请重新输入')
        }
      }
    },
    tableRowClassName ({ row, rowIndex }) { // 动态显示背景颜色
      if (this.list.invoiceStatus === 0 && this.objId && this.status !== 11) {
        if (!this.selectLists.length) return `sendContextRow${this.itemKey} noCheck_color`
        const data = this.selectLists.find(item => { return item.id === row.id })
        if (data) {
          return `sendContextRow${this.itemKey} check_color`
        } else {
          return `sendContextRow${this.itemKey} noCheck_color`
        }
      } else {
        return `sendContextRow${this.itemKey}`
      }
    },
    handlerDate (row, key, msg) { // 生产日期&&有效期校验
      if (row.produceDate && row.validityDate && row.validityDate < row.produceDate) {
        row[key] = ''
        // 有效期不能小于生产日期，请重新选择
        return this.$messageTips(this, 'warning', msg)
      }
    },
    deleteListItem () {
      this.$emit('deleteListItem', this.itemKey)
    },
    // table勾选框选中数据
    handleSelectionChange (val) {
      this.selectLists = val
    },
    handleEditInvoice () {
      if (this.status === 11 && this.itemKey === 0 && this.list.invoiceStatus === 1) {
        this.list.edit = 1
        this.contextList = this.contextList.filter(item => ['1', '2'].includes(item.id))
        this.contextList[1].disabled = true
        this.switchInow = true
      } else {
        if (this.list.invoiceStatus === 1 || this.list.invoiceStatus === 2) {
          this.list.invoiceNo = ''
        }
        this.list.invoiceStatus = 0
      }
    },
    handleNoInvoice (status) {
      this.list.invoiceStatus = status
      this.list.invoiceNo = ''
    },
    // 保存发票 检查发票是否存在
    handleSaveInvoice (data) {
      if (data.invoiceNo === '') {
        return this.$messageTips(this, 'warning', '发票号不能为空，请重新输入')
      }
      if (this.invoiceNos.includes(data.invoiceNo)) return this.$messageTips(this, 'warning', '您提交的发票号已经在本入库单中填写过，请检查后重新录入')
      this.list.invoiceStatus = 3
    },
    // 点击table某一行前面的操作按钮 弹出操作按钮列表 左键操作菜单
    operatingClick (index, event) {
      this.getMenuList(index)
      this.isRight = false
      this.$refs.rightClick.indexItem = index
      this.$refs.rightClick.style.top = event.y + 1 + 'px'   // 鼠标点击时给div定位Y轴
      this.$refs.rightClick.style.left = event.x + 3 + 'px'  // 鼠标点击时给div定位X轴
      this.$refs.rightClick.style.visibility = 'visible'    // 显示div盒子
    },
    // 右键点击添加到发票号/归为发票未到
    addInvoiceList (data, index, btn) {
      // 判断是选的多行还是只操作当前行
      let selectData = JSON.parse(JSON.stringify(this.list.item)).filter(item => {
        return this.selectLists.length ? this.selectLists.find(check => check.localMaterialId === item.localMaterialId) : item.localMaterialId === data.localMaterialId
      })
      if ((selectData && selectData.length === this.list.item.length) && this.list.invoiceStatus !== 0) {
        this.$emit('deleteListItem', this.itemKey, true, JSON.parse(JSON.stringify(selectData)), btn)
        return
      }
      this.$emit('updataInvoice', JSON.parse(JSON.stringify(selectData)), btn, this.itemKey)
    },
    // 右键点击添加新的物资
    addRowData (data, index, btn) {
      // const flag = this.list.item.every(item => { return item.localMaterialId && item['batchNum'] && item['produceDate'] && item['validityDate'] && item['num'] })
      if (this.cheListItemData(this.list.item)) return this.$messageTips(this, 'warning', '入库单中还有未完善的信息，请先完善信息再添加')
      let temCode = JSON.parse(JSON.stringify(this.tableCode))
      for (let key in temCode) {
        if (key === 'price') {
          temCode[key] = undefined
        } else {
          temCode[key] = ''
        }
      }
      temCode.addData = '' // 有新的物资行就需要操作的...
      this.list.item.push(JSON.parse(JSON.stringify(temCode)))
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      // this.list = JSON.parse(JSON.stringify(this.parentData[this.itemKey]))
      this[item.methodName](this.list.item[index], index, item)
    },
    getMenuList (index) { // 右键呼出操作菜单
      this.isRight = true
      const check = this.selectLists.find(check => { return check.localMaterialId === this.list.item[index].localMaterialId })
      // 复选框选中两个物资并且以上，加减批次号禁用
      if (this.contextList.length > 2) {
        this.setSelectListsDisabled(['5', '6'], (check && this.selectLists.length > 1 || (this.list.item[index].localMaterialId && !this.list.item[index].isExpiryDate)))
        // 当前行未添加物资 添加发票号和归为发票未到禁用
        this.setSelectListsDisabled(['1', '2'], !this.list.item[index].localMaterialId)
        // 当前为发票未到禁用发票未到
        if (this.list.item[index].localMaterialId) this.setSelectListsDisabled(['2'], this.list.invoiceStatus === 1)
      } else {
        // 入库完成 补录发票的第0条新增的发票号，需要把右键发票未到放开
        if (this.status === 11 && this.itemKey === 0 && this.list.invoiceNo && this.list.invoiceStatus === 3) {
          let findObj = this.contextList.find(item => item.id === '2' && item.disabled === true)
          if (findObj) findObj.disabled = false
        }
        this.setSelectListsDisabled(['2'], this.list.invoiceStatus === 1)
      }
    },
    setSelectListsDisabled (arr, swit) {
      this.contextList.forEach(item => {
        if (arr.includes(item.id)) item.disabled = swit
      })
    },
    // 合并单元格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let len
      let thisCont
      let thisIndex
      let columnIndes = (this.objId && (this.status === 10)) ? [6, 7, 8, 9] : [3, 4, 5, 6, 9]
      if (this.status === 11) {
        columnIndes = this.list.showBtn ? [5, 6, 7, 8] : [3, 4, 5, 6, 9]
      } else if (this.status === 13) {
        columnIndes = this.billCode ? [4, 6, 7, 8, 9] : [5, 6, 7, 8]
      }
      const list = this.list
      const index = list.item.findIndex(item => item.localMaterialId === row.localMaterialId)
      if (index > -1) {
        var count = 0
        list.item.forEach((item, keys) => {
          if (item.localMaterialId === row.localMaterialId) {
            count = count + 1
          }
        })
        thisCont = count
        thisIndex = index
        len = list.item.length
      }
      let length = len >= 2
      if (!columnIndes.includes(columnIndex) && length) {
        if (((rowIndex - (thisIndex + thisCont)) % thisCont) === 0) {
          return {
            rowspan: thisCont,
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
    // 添加新的批次号
    addBatchNum (row, i) {
      let find = this.list.item.find(item => (item.localMaterialId === row.localMaterialId && (!item.batchNum || !item.produceDate || !item.num || !item.validityDate)))
      if (find) return this.$messageTips(this, 'warning', '当前物资有未完成的信息，请先完善信息')
      let newRow = Object.assign({}, JSON.parse(JSON.stringify(row)), { batchNum: '', produceDate: '', validityDate: '', num: '', mark: 1, isbatch: false, showTotalPrice: '' })
      if (this.status === 10) newRow.expectNum = 0
      if (newRow.id) delete newRow.id
      let thisListIds = []
      this.list.item.forEach((item, index) => {
        if (item.localMaterialId === newRow.localMaterialId) {
          thisListIds.push(index)
          if (item.mark) delete item.mark
        }
      })
      this.list.item.splice(thisListIds[thisListIds.length - 1] + 1, 0, newRow)
    },
    // 输入生产批号自动带出生产日期和有效期
    async handlerBatchNum (v, index) {
      if (v && v.batchNum && v.localMaterialId) {
        await api.getStockBatchNum({ localMaterialId: v.localMaterialId, batchNum: v.batchNum }).then(res => {
          if (res && res.length) {
            this.$set(v, 'validityDate', res[0].validityDate)
            this.$set(v, 'produceDate', res[0].produceDate)
            v.isbatch = true
          } else {
            this.$set(v, 'validityDate', '')
            this.$set(v, 'produceDate', '')
            v.isbatch = false
          }
        })
      }
    },
    // 计算发票总金额
    calcTotalPrice (data, price) {
      let totalPrice = 0
      let ids = []
      for (let i = 0; i < data.length; i++) {
        if (!ids.includes(data[i].localMaterialId) && data[i][price]) {
          totalPrice = floatTool.add(data[i][price] || 0, totalPrice)
          ids.push(data[i].localMaterialId)
        }
      }
      this.fpPrice = !isNaN(totalPrice) ? totalPrice : 0.00
    },
    // 修改价格 同步相同物资
    handlePrice (data) {
      if (data.price < 0 || data.price === '') {
        this.$messageTips(this, 'warning', '采购单价不能小于0或未输入，请重新录入')
        data.price = this.cachePrice
      }
      this.list.item.forEach(item => {
        if (item.localMaterialId === data.localMaterialId) {
          item.price = data.price
        }
      })
      this.rowCountPrice(data)
    },
    // 计算 单行物资入库金额
    calcInboundNum (data) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (data.num === undefined || data.num <= 0) {
        data.num = undefined
        return this.$messageTips(this, 'warning', '入库数量为0或未输入，请重新录入')
      }
      let dataType = data.classifyId || ''
      if (this.CHINESE_MEDICINE_TYPE.includes(dataType)) {
        if (!float.test(data.num)) {
          data.num = undefined
          return this.$messageTips(this, 'warning', '入库数量不能小于0，请重新录入')
        }
        let num = String(data.num).split('.')
        if (num[1] && num[1].length > 4) {
          data.num = data.num.toFixed(4)
        }
      } else {
        if (!parse.test(data.num)) {
          data.num = undefined
          return this.$messageTips(this, 'warning', '入库数量不能有小数，请重新录入')
        }
      }
      // 4月27日 应于鹏飞要求，新添加物资赋值给上expectNum materialType
      if ((data.expectNum !== 0 && (this.status === 9 || !data.expectNum)) || (this.billCode && !data.purchaseOrderFlag)) data.expectNum = data.num || ''
      data.materialType = data.classifyId || ''
      this.rowCountPrice(data)
    },
    // 计算单行物资总金额 显示
    rowCountPrice (data) {
      if (!data.localMaterialId) return
      let nums = 0
      let findObj = null
      let indexs = []
      this.list.item.forEach(item => {
        if (item.localMaterialId === data.localMaterialId) {
          if (!findObj) findObj = item
          indexs.push(item)
          if (item.num) nums = nums + parseFloat(item.num)
        }
      })
      // 当前物资只有一个批次的时候，当必填信息填满，自动展示添加批次按钮
      if (indexs.length === 1) {
        if (data.batchNum && data.produceDate && data.validityDate && data.num && data.price) data.mark = 1
      }
      this.$set(findObj, 'showTotalPrice', floatTool.multiply(findObj.price, nums))
    },
    // 选择搜索出来的物资
    handleSelect (datas) {
      let sumList = []
      this.parentData.forEach(parent => {
        if (parent.item) sumList.push(...parent.item)
      })
      let checkIndex = sumList.find(item => item.localMaterialId === datas.localMaterialId)
      if (checkIndex) return this.$messageTips(this, 'warning', '该商品已经存在当前列表中')
      let data = Object.assign({}, { price: datas.unitPrice || undefined }, datas)
      let lenIndex = this.list.item.length - 1
      this.$set(this.list.item, lenIndex, Object.assign({ price: datas.unitPrice || undefined }, datas))
      for (let key in this.list.item[lenIndex]) {
        let item = this.list.item[lenIndex]
        if (data.localMaterialId) {
          if (key === 'produceDate' || key === 'num') {
            item[key] = ''
          } else {
            item[key] = data[key] || ''
          }
        } else {
          item[key] = ''
        }
        if (key === 'price' && !data.price) item[key] = undefined
        if (key === 'addData') item[key] = 1
        if (key === 'isExpiryDate') item[key] = data.isExpiryDate
        // 给每个商品添加存储一下修改之前的价格
        if (key === 'oldPrice') item[key] = data.price || ''
      }
    },
    // 删除当前批号
    handleDeleteRowBatchNum (thisData, index, data) {
      if (thisData.localMaterialId && this.list.item.length === 1 && this.description && this.description.purchaseSaleType === 1) {
        this.$emit('deleteListItem', this.itemKey, '发票中物资全部移除后，发票将被删除，是否确认操作。')
        return
      }
      this.list.item.splice(index, 1)
      if (this.list.item[this.list.item.length - 1].localMaterialId) this.list.item[this.list.item.length - 1].add = 1
    },
    // 删除当前行物资
    handleDeleteRow (thisData, index, data) {
      if (this.status === 10 || this.status === 13) {
        if (this.selectLists && this.selectLists.length && this.isRight) { // 有选中并且是右键开启的菜单为批量操作
          this.batchDeleteRow()
        } else { // 为当前行操作
          let len = this.list.item.filter(item => { return item.localMaterialId !== thisData.localMaterialId })
          if (len && !len.length && this.description && this.description.purchaseSaleType === 1) {
            this.$emit('deleteListItem', this.itemKey, '发票中物资全部移除后，发票将被删除，是否确认操作。')
            return
          }
          this.list.item = len
        }
      } else { // 新建页面点击删除按钮删除
        let deleteData = JSON.parse(JSON.stringify(data))
        this.list.item.splice(index, 1)
        if (this.list.item[this.list.item.length - 1].localMaterialId) this.list.item[this.list.item.length - 1].add = 1
        if (deleteData.mark) {
          let indexs = []
          this.list.item.forEach((item, index) => {
            if (item.localMaterialId === deleteData.localMaterialId) {
              indexs.push(index)
            }
          })
          if (indexs.length) this.list.item[indexs[indexs.length - 1]].mark = 1
        }
      }
    },
    // 批量删除
    batchDeleteRow () {
      let newList = [...this.list.item]
      this.selectLists.forEach(check => {
        newList = newList.filter(item => { return item.localMaterialId !== check.localMaterialId })
      })
      if (newList && !newList.length) {
        this.$emit('deleteListItem', this.itemKey, '发票中物资全部移除后，发票将被删除，是否确认操作。')
      } else {
        this.list.item = newList
      }
    },
    //  添加物资进列表
    handleAddRow (data) {
      if (this.btnGray) return
      if (data.localMaterialId && data.isExpiryDate && (!data['batchNum'] || !data['produceDate'] || !data['validityDate'] || !data['num'] || data.price === undefined)) {
        return this.$messageTips(this, 'warning', '该商品生产批次、生产日期和有效期信息未完成，请完成后再添加')
      }
      if (data.localMaterialId && !data.isExpiryDate && (!data['num'] || data.price === undefined)) {
        return this.$messageTips(this, 'warning', '该商品入库数量未填写完成，请完成后再添加')
      }
      // let list = JSON.parse(JSON.stringify(this.list.item))
      // list.pop()
      // let checkIndex = this.list.item.findIndex(item => item.localMaterialId === data.localMaterialId)
      // if (~checkIndex) return this.$messageTips(this, 'warning', '该商品已经添加，如想修改，请删除后再添加')
      if (data.localMaterialId) {
        let newData = JSON.parse(JSON.stringify(Object.assign(data, { addData: 1, mark: 1, add: true })))
        const lenIndex = this.list.item.length - 1
        this.list.item.splice(lenIndex, 0, newData)
        this.handlerLastAdd()
      }
    },
    handlerLastAdd () {
      this.$nextTick(function () {
        let temCode = JSON.parse(JSON.stringify(this.tableCode))
        for (let key in temCode) {
          temCode[key] = ''
        }
        const lenIndex = this.list.item.length - 1
        this.$set(this.list.item, lenIndex, temCode)
        setTimeout(_ => {
          if (this.$refs.remoteselect && this.$refs.remoteselect.$el.querySelectorAll('input')) {
            this.$refs.remoteselect.$el.querySelectorAll('input')[0].focus()
          }
        }, 100)
      })
    },
    ...patch
  },
  components: {
    remoteSelect,
    contextmenu
  },
  watch: {
    'list': {
      handler (v) {
        v.item.forEach(item => {
          this.rowCountPrice(item, v.item)
        })
        this.calcTotalPrice(v.item, 'showTotalPrice')
        this.$emit('updataList', v, this.itemKey)
      },
      deep: true,
      immediate: true
    }
  },
}
</script>

<style scoped lang="scss">
.tablenumber{
  width: 80px;
  /deep/ .el-input__inner{
    padding: 0;
  }
}
.tableClass {
  /deep/ .noCheck_color {
    background-color: #FFF5B7;
  }
  /deep/ .check_color {
    background-color: #E2ECF9;
  }
}
</style>
