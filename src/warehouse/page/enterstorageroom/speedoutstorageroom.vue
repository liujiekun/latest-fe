<template>
  <div id="speedout">
    <el-dialog
      title="快捷出库"
      :visible.sync="dialogVisible"
      class="ui_dialog_02 spe">
      <div style="height: 320px; padding: 20px; font-size: 16px; line-height: 22px">
        <div v-if="status == 1">
          <p>快速出库是由系统辅助完成出库和入库的操作，将整批入库的商品出库到指定库房。</p>
          <p class="top">请选择接收的库房：</p>
          <ever-remote-method :filter="data.storageRoomId" :params="{ materialType: (materialType && materialType.length) ? JSON.stringify(materialType) : materialType, storageRoomId: data.storageRoomId, isInvented: 0, userType: null, pagesize: 999 }" :api="storageroomApi" v-model="storageRoomId" placeholder="请选择接收的库房" :isSilentQuery="true"></ever-remote-method>
        </div>
        <div v-if="status == 2">
          <p>出库完成！已为接收仓自动生成申领单。您可以到接收库房查询到商品库存。</p>
          <p class="top">申领单号：<span class="blue" @click="handleJump">{{billCode}}</span></p>
          <!-- 2019-12-05 test 刘笑语 让去掉快捷出库打印出库单 -->
          <!-- <p class="alg_c" style="margin-top: 100px;"><el-button type="default" @click="printTable">打印出库单</el-button></p> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="status == 1" @click="submit(2)" type="primary" :loading="unRepeatedBtn"><i class="iconfont icon-tijiao"></i>确认</el-button>
        <el-button v-if="status == 2" @click="submitClose()" type="primary"><i class="iconfont icon-tijiao"></i>确认</el-button>
      </span>
    </el-dialog>
    <div style="width: 700px;height:0;overflow: hidden">
      <print-header id="print_header" :recordData="recordData.head" :printHeader="pHeader" title="出库单" :tableHead="tableHead"></print-header>
      <print-body id="record_print" v-model="printData" :tableHead="tableHead"></print-body>
      <print-footer id="print_footer" v-model="printFooterData" :footerArr="printFooter"></print-footer>
    </div>
  </div>
</template>
<script>
import storageroomApi from '../../store/storageroomapi'
import instockApi from './getinstockapi'
import { debounce, patch, SPEC_CODE, PACKAGE_CODE, parserComplex, parserJSON, GOLBAL_VAL_MATERIL_NAME } from '@/util/common'
import { doPrint } from '@/util/print'
import printHeader from '../print/printheader'
import printFooter from '../print/printfooter'
import printBody from '../print/printbody'
import printFormat from '../../schema/printConfig'

export default {
  props: ['data'],
  data () {
    let printModel = this.$ever.getClinicConfig().printModel
    let format
    if (printModel === 2) {
      format = printFormat.format2
    } else {
      format = printFormat.format1
    }
    return {
      dialogVisible: false,
      storageroomApi,
      storageRoomId: '',
      billCode: '',
      billId: '',
      status: 1,
      source: '',
      SPEC_CODE,
      PACKAGE_CODE,
      materialType: [],
      GOLBAL_VAL_MATERIL_NAME,
      outStockObject: {},
      recordData: format.recordData,
      printData: format.printData,
      tableHead: format.tableHead,
      printFooter: format.printFooter,
      pHeader: format.pHeader,
      printFooterData: format.printFooterData,
      footerSign: format.printFooterSign,
      unRepeatedBtn: false // 控制重复提交
    }
  },
  methods: {
    printTable () {
      this.printFooterData.createDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      // 数组去重
      function unique (arr) {
        if (arr.length === 1) return arr
        let res = []
        for (var i = 0; i < arr.length; i++) {
          for (let name in arr[i]) {
            if (name === 'localMaterialId') {
              if (!unique1(res, arr[i][name])) {
                res.push(arr[i])
              }
            }
          }
        }
        return res
      }
      function unique1 (arr, id) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].localMaterialId === id) {
            return true
          }
        }
        return false
      }
      // 打印数据组合处理
      let printModel = this.$ever.getClinicConfig().printModel
      let print = []
      for (let i = 0; i < this.outStockObject.outStockItemList.length; i++) {
        let item = this.outStockObject.outStockItemList[i]
        print.push(Object.assign({
          name: parserComplex({ data: item.localSettingObject.materialSkuObject.ext, propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE }),
          spec: parserComplex({ propertys: [SPEC_CODE], data: item.localSettingObject.materialSkuObject.ext })
        }, item, { unitId: item.localSettingObject ? parserJSON({ data: item.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE }) : '' }))
      }
      this.printData = []
      this.pHeader[0].data = this.outStockObject.type === '15' && this.outStockObject.supplierObject ? this.outStockObject.supplierObject.name : (this.outStockObject.type === '2' || this.outStockObject.type === '16') && this.outStockObject.inLocalDepartmentObject ? this.outStockObject.inLocalDepartmentObject.name : this.outStockObject.inStorageRoomObject ? this.outStockObject.inStorageRoomObject.name : ''
      if (printModel === 2) {
        this.pHeader[1].data = this.outStockObject.staffObject && this.outStockObject.staffObject ? this.outStockObject.staffObject.name : ''
        this.pHeader[2].data = this.$moment(this.outStockObject.createTime).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.pHeader[1].data = this.$moment(this.outStockObject.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.recordData.head.patientId = this.outStockObject.code
      for (let i = 0; i < this.outStockObject.outStockItemList.length; i++) {
        let item = this.outStockObject.outStockItemList[i]
        item.validityDate = this.$moment(item.validityDate).format('YYYY-MM-DD')
        if (printModel !== 2) {
          this.printData.push(Object.assign({
            name: parserComplex({ data: item.localSettingObject.materialSkuObject.ext, propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE }),
            spec: parserComplex({ propertys: [SPEC_CODE], data: item.localSettingObject.materialSkuObject.ext })
          }, item, { unitId: item.localSettingObject ? parserJSON({ data: item.localSettingObject.materialSkuObject.ext, property: PACKAGE_CODE }) : '' }))
        }
      }
      if (printModel === 2) {
        for (let i = 0; i < print.length; i++) {
          let item = print[i]
          for (let j = i + 1; j < print.length; j++) {
            let items = print[j]
            if (item.localMaterialId === items.localMaterialId) {
              item.num += items.num
            }
          }
        }
        let arr = unique(print)
        this.printData = arr
      }
      let pageObj = {
        pagination: true,
        fixedHeader: true,
        fixedFooter: true,
        size: 'A4',
        margin: [1]
      }
      doPrint(this, 'record_print', pageObj, 'print_header', 'print_footer')
    },
    handleJump () {
      let url = `/storages/${this.source}/${this.billId}`
      this.$router.push(url)
    },
    open (source) {
      this.storageRoomId = ''
      this.source = source
      this.dialogVisible = true
      let materialType = []
      this.data.inStockItemList.forEach(item => {
        item.item.forEach(child => {
          if (!materialType.includes(child.classifyId)) materialType.push(child.classifyId)
        })
      })
      this.materialType = materialType
    },
    submit: debounce(function (status) {
      if (!this.storageRoomId) {
        this.$messageTips(this, 'warning', '请选择接收的库房')
        return
      }
      let params = Object.assign({}, this.data, { toStorageRoomId: this.storageRoomId })
      params.inStockItemList = []
      for (let i = 0; i < this.data.inStockItemList.length; i++) {
        for (let n = 0; n < this.data.inStockItemList[i].item.length; n++) {
          params.inStockItemList.push(Object.assign({
            storageRoomId: this.data.storageRoomId,
            invoiceNo: this.data.inStockItemList[i].invoiceNo
          }, this.data.inStockItemList[i].item[n]))
          this.data.inStockItemList[i].ited && delete this.data.inStockItemList[i].ited
        }
      }
      for (let i = 0; i < params.inStockItemList.length; i++) {
        let item = params.inStockItemList[i]
        item.drugObject && delete item.drugObject
        item.consumptiveMaterialObject && delete item.consumptiveMaterialObject
        item.equipmentObject && delete item.equipmentObject
        item.localSettingObject && delete item.localSettingObject
        item.unitGroupItemObject && delete item.unitGroupItemObject
        item.storageRoomObject && delete item.storageRoomObject
        item.staffObject && delete item.staffObject
      }
      params.drugObject && delete params.drugObject
      params.consumptiveMaterialObject && delete params.consumptiveMaterialObject
      params.equipmentObject && delete params.equipmentObject
      params.localSettingObject && delete params.localSettingObject
      params.unitGroupItemObject && delete params.unitGroupItemObject
      params.storageRoomObject && delete params.storageRoomObject
      params.staffObject && delete params.staffObject
      this.unRepeatedBtn = true
      instockApi.create(params).then(res => {
        if (res && res.billId) {
          this.billCode = res.billCode
          this.billId = res.billId
          this.status = status
          this.outStockObject = res.outStockObject
          this.unRepeatedBtn = false
        } else {
          this.dialogVisible = false
        }
      })
    }),
    submitClose () {
      this.dialogVisible = false
    },
    ...patch
  },
  watch: {
    'dialogVisible' (v) {
      if (!v && this.status.toString() === '2') {
        this.$emit('handleVisible')
      }
    }
  },
  components: {
    printHeader,
    printFooter,
    printBody
  }
}
</script>
<style lang="scss" scoped>
.top { margin-top: 30px;}
.blue:hover { cursor: pointer; text-decoration: underline;}
</style>
