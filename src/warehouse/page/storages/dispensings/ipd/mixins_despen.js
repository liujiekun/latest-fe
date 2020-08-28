/* eslint-disable */
import api from '../store/hospitalapi'
import { _findIndex } from '@/util/formcustom'
import dispenseApi from '../store/dispenseapi'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixinsnew'
// num = 1 住院发药页面 num = 2 摆药单页面
export default {
  mixins: [hospitalPrintMixins, getStorage],
  data () {
    return {
      centerLoading: false,
      fullscreenLoading: false
    }
  },
  methods: {
    _findArray (arr) {
      //  获取到的数组中区分 正常处方和异常处方  arr原数组  str要区分的匹配值
      let newArr = []
      let errArr = []
      arr.forEach(item => {
        if (item.identification || item.status === 7) {
          errArr.push(item)
        } else {
          newArr.push(item)
        }
      })
      //  输出一个对象 newArr为正常处方  errArr为异常处方
      return {
        newArr: newArr,
        errArr: errArr
      }
    },
    // 批量发药和单个发药
    handleBatchDrug (flag, num) {
      if (!flag && !this.checkMultipleLength(this.multipleSelection, num === 1 ? '请选择处方单' : '请选择药包')) return
      this.fullscreenLoading = true
      api.updateEndUddList(this._mergeParams(flag)).then(res => {
        // 更改药包状态为发药完成 num = 1 住院发药页面 num = 2 摆药单页面
        if (res.flag) {
          this.$messageTips(this, 'success', '发药完成')
          num === 1 ? this.getRightList() : this.getDispenseList()
          // !flag ? this.getRightList() : num === 1 ? this.getRightList() : this.getDispenseList()
        }
        this.fullscreenLoading = false
      })
    },
    // 检测是否选择处方数据
    checkMultipleLength (data = this.multipleSelection, title = '请选择处方单') {
      if (!data.length) {
        this.$messageTips(this, 'warning', title)
        return false
      }
      return true
    },
    // 传递参数
    _mergeParams (flag) {
      let params = []
      if (flag) {
        params.push({
          id: this.drugPackInfo.id || this.obj.id,
          status: this.drugStatus,
          code: this.drugPackInfo.code || this.obj.code,
          storageRoomId: this.drugPackInfo.storageRoomId || this.obj.storageRoomId,
          spaceId: this.drugPackInfo.spaceId || this.obj.spaceId
        })
      } else {
        this.multipleSelection.forEach(item => {
          params.push({
            id: item.id,
            status: this.drugStatus,
            storageRoomId: item.storageRoomId,
            code: item.code,
            spaceId: this.drugPackInfo.spaceId
          })
        })
      }
      return params
    },
    // 备药完成
    handleFinish (flag, num) {
      if (!flag && !this.checkMultipleLength(this.multipleSelection, num === 1 ? '请选择处方单' : '请选择药包')) return
      this.fullscreenLoading = true
      api.updateUddList(this._mergeParams(flag)).then(res => {
        // 更改药包状态为待发药
        if (res.flag) {
          this.$messageTips(this, 'success', '备药完成')
          // !flag ? this.getRightList() : this.getUddDispenseList()
          this.getRightList()
        }
        this.fullscreenLoading = false
      })
    },
    setLeftDataCount (index, termType) {
      let countArr = this.leftTableData[index].counts.split('/')
      termType === 0 ? countArr[0] = +countArr[0] - 1 : countArr[1] = +countArr[1] - 1
      this.$set(this.leftTableData[index], 'counts', countArr.join('/'))
      if (this.leftTableData[index].counts === '0/0') this.leftTableData.splice(index, 1)
    },
    printSinge ({ type, data }) {
      let tempArr = []
      data.uddDispenseItemList && data.uddDispenseItemList.map(v => {
        tempArr.push(`'${v.localMaterialId}'`)
      })
      let localmaterialIds = tempArr.join(',')
      if (CHINESE_MEDICINE_TYPE.includes(type)) {
        frPrint('thc_wh_hospitial_send_chinese_medchin', { id: data.id, localmaterialIds })
      } else {
        frPrint('ZHU_YUAN_FA_YAO_UDD', { id: data.id, localmaterialIds })
      }
    },
    // 批量打印/打印
    handleBatchPrint (flag, num) {
      if (!flag && !this.checkMultipleLength(this.multipleSelection, num === 1 ? '请选择处方单' : '请选择药包')) return
      const params = this._mergeParams(flag)
      this.fullscreenLoading = true
      dispenseApi.createUddPrint(params).then(res => {
        // 更改药包状态为待摆药
        if (res && res.flag) {
          // this.getRightList()
          this.jcpKey = this.jcpCount++
          this._initPrint()
          res.uddDispenseList.forEach(item => {
            // 避免患者信息被覆盖为null
            if (!this.inpatientArea.patientObject) delete this.inpatientArea.patientObject
            item = Object.assign(item, this.inpatientArea)
            this.resetGatherPrintData(item)
          })
          this.liveTableData = {
            tableData: res.uddDispenseList,
            barCode: res.codes
          }
          // 批量打印按科室维度展示药品数量总计单据
          this.liveTableDataSummary = {
            tableData: [].concat(res.collectDispense),
            barCode: res.codes
          }
          const printModel = this.$ever.getClinicConfig().printModel
          if (printModel === 2) { // gx打印
            this.printSinge({ type: res.uddDispenseList[0].adviceType, data: res.uddDispenseList[0] })
          } else { // 其他打印
            this.$nextTick(_ => {
              this.handlerPrint()
            })
          }
          if (Array.isArray(params)) { // 完成操作后，删除对应条件无数据的条件
            let num = 0
            let termType // 长期／临时医嘱
            params.forEach(ite => {
              num = num++
              let rightIndex = _findIndex(this.rightTableData, ite.id)
              if (this.rightTableData[0]) termType = this.rightTableData[0].termType
              if (rightIndex > -1) this.rightTableData.splice(rightIndex, 1) // 删除右侧药包列表
              let leftIndex = _findIndex(this.leftTableData, ite.spaceId, 'spaceId')
              if (leftIndex > -1) this.setLeftDataCount(leftIndex, termType) // 删除左侧病区列表和更新左侧病区药包数量
              if (!this.rightTableData.length) { // 药包列表为空时，删除当前给药途径
                let employIndex = _findIndex(this.employList, this.employCheck, 'employ')
                if (employIndex > -1) this.employList.splice(employIndex, 1)
              }
              if (!this.employList.length) { // 当前给药途径为空时，删除执行时间
                let implementTimeIndex = _findIndex(this.implementTimeList, this.implementTimeCheck, 'implementTime')
                if (implementTimeIndex > -1) this.implementTimeList.splice(implementTimeIndex, 1)
              }
              if (!this.implementTimeList.length) this.checked = true
            })
          }
          this.drugPackInfo = {}
          this.$messageTips(this, 'success', `${Array.isArray(params) && params.length > 1 ? '批量' : ''}打印成功`)
        }
        this.fullscreenLoading = false
      })
    },
    handleSinglePrint (data) {
      let ids = this.handleIds(data, true)
      if (!ids.length) return this.$messageTips(this, 'warning', '请先选择药包')
      let params = {
        ids: ids,
        type: 2,
        storageRoomId: this.storageId
      }
      this.fullscreenLoading = true
      dispenseApi.printDispenseAndUddDispense(params).then(res => {
        if (res) {
          this.jcpKey = this.jcpCount++
          this._initPrint()
          res.forEach(item => {
            item = Object.assign({}, item)
            this.resetGatherPrintData(item)
          })
          const printModel = this.$ever.getClinicConfig().printModel
          if (printModel === 2) { // gx打印
            this.printSinge({
              type: res[0].adviceType,
              data: res
            })
          } else { // 其他打印
            this.$nextTick(_ => {
              this.handlerPrint()
            })
          }
          if (data.status === 6) {
            data.isAllPrint = true
          } else {
            ids.map(item => {
              let index = data.newArr.findIndex(child => {
                return child.id === item
              })
              if (index > -1) data.newArr[index].isPrint = 2
            })
            let count = 0
            data.newArr.map(item => {
              if (item.isPrint === 2) {
                count++
              }
            })
            if (count === data.newArr.length) data.isAllPrint = true
          }
        }
        this.fullscreenLoading = false
      })
    },
    handleIds (arr, isprint) {
      let ids = []
      arr.newArr.map(item => {
        if (item.checked) {
          if (isprint) {
            if (item.isPrint === 1) ids.push(item.id)
          } else {
            ids.push(item.id)
          }
        }
      })
      return ids
    }
  }
}
