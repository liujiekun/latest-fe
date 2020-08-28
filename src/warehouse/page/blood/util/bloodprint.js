/* eslint-disable */
// 打印公共js
const printParams = {
  preview: false,
  settings: {
    printer: null, // 设置选中的打印机
    portrait: true
  }
}

import { frPrint } from '@/util/common'
export default {
  data () {
    return {
      // 打印多个打印机数据整合
      printAll: []
    }
  },
  mounted () {
    // 判断某一个打印机打印完成，启动下一个打印任务
    let _this = this
    window.addEventListener('message', function (e) {
      if (e.data === 'printdone') {
        _this.bloodPrintFn()
      }
    }, false)
  },
  methods: {
    bloodPrintFn () {
      let toPrint = this.printAll.shift()
      let printObj = Object.assign({}, printParams.settings)
      let newPrintObj = Object.assign({}, printParams, {
        settings: printObj
      })
      if (toPrint) frPrint(toPrint.type, toPrint, newPrintObj)
    }
  }
}
