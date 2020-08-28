import invoiceApi from '@/rcm/store/invoicemanage/invoicemanageapi.js'
import { frPrint } from '@/util/common'
var invoice = {
  data () {
    return {
      invoiceApi,
      isJinShui: false,
      invoiceArr: [] // 发票号集合
    }
  },
  methods: {
    // 地税发票打印
    printLocalTaxInvoice (id, rate) {
      // 打印一张发票
      try {
        frPrint(
          'thc_rcm_dishui_invoice_print',
          { settlementId: id, rate: String(rate).replace(/^[0]{1,}/, '') },
          { preview: false }
        )
        this.printSuccessBack([{ id }])
      } catch (err) {}
    },
    cancelInvoices (row) { // 发票作废
      this.$confirm('你确定要作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelInvoicesTwo(row)
      })
    },
    async cancelInvoicesTwo (row) { // 发票作废
      let ips = await invoiceApi.findInvoiceByIds({ids: [row.id]}) // 获取发票所对应结算单下的所有发票
      if (ips.head.errCode === 0 && ips.data.length > 0) { // 该订单已经开过发票，可以作废
        let params = []
        ips.data.forEach(item => params.push(item.infoNumber))
        this.cancelInvoicesTh(params)
      } else {
        this.$messageTips(this, 'error', '本订单还未开发票')
      }
    },
    async cancelInvoicesTh (params) { // 发票作废
      let cancelInvoice = await invoiceApi.cancelInvoice({infoTypeCode: 4600171320, infoNumber: params})
      if (cancelInvoice.head.errCode === 0) {
        this.$messageTips(this, 'success', '作废成功')
        invoiceApi.invalidInvoice({invoiceNos: params}).then(result => {
          this.cancelSuccessCall && this.cancelSuccessCall()
        })
      }
    },
    findInvoiceByIds (row) { // 获取结算单所对应的发票号
      this.printInfo.code = 'thc_rcm_wuhu_yibao_luo'
      let clinicType = this.$ever.getClinicConfig().clinicType
      if (clinicType === 'hcjk') { // 海创要判断需要打印几张
        this.hcjkPrint(row.id)
        return
      }
      if (row.invoiceNo && row.invalidStatusChn !== '已作废') {
        this.invoiceArr = [{infoNumber: row.invoiceNo}]
        this.printInvoice(0)
        return
      }
      invoiceApi.findInvoiceByIds({ids: [row.id]}).then(result => {
        if (result.head.errCode === 0 && result.data.length > 0) { // 假如已经开过了，直接调打印
          this.invoiceArr = result.data
          this.printInvoice(0)
        } else {
          this.printInvoices(row)
        }
      })
    },
    initData (data) {
      data.items = [
        {
          'goodsNoVer': '1.0',
          'goodsTaxNo': '3070202',
          'taxPre': '1',
          'taxPreCon': '免税',
          'zeroTax': '1',
          'cropGoodsNo': '022',
          'taxDeduction': '',
          'listGoodsName': '化验费',
          'listTaxItem': '',
          'listStandard': '',
          'listUnit': '',
          'listPriceKind': 0,
          'listAmount': 200,
          'listTaxAmount': 0
        }, {
          'goodsNoVer': '1.0',
          'goodsTaxNo': '3070202',
          'taxPre': '1',
          'taxPreCon': '免税',
          'zeroTax': '1',
          'cropGoodsNo': '005',
          'taxDeduction': '',
          'listGoodsName': '检查费',
          'listTaxItem': '',
          'listStandard': '',
          'listUnit': '',
          'listPriceKind': 0,
          'listAmount': 100,
          'listTaxAmount': 0
        }
      ]
      console.log(data)
      return data
    },
    async printInvoices (row) { // 发票打印
      let res = await invoiceApi.getInvData({ids: [row.id], type: row.type ? row.type : 1}) // 获取结算单详情
      let fpIds = await invoiceApi.createInvoice(res.data[0]) // 获取发票号
      if (!fpIds.data[0]['success']) {
        this.$messageTips(this, 'error', '开票失败')
        return
      }
      this.loading = true
      this.invoiceArr = this.saveInvoices(fpIds.data, row)
      let save = await invoiceApi.save(this.invoiceArr)
      if (save.head.errCode === 0) {
        this.printInvoice(0)
      } else {
        this.loading = false
      }
    },
    saveInvoices (data, row) { // 将发票信息储存到后台
      let arr = []
      data.forEach(item => {
        arr.push({
          settlementId: row.id,
          settlementType: 1,
          invoiceNo: item.infoNumber,
          invoiceAmount: item.infoAmount,
          invoiceTaxAmount: item.infoTaxAmount,
          invoiceDate: item.infoDate
        })
      })
      return arr
    },
    printInvoice (len) { // 发票依次打印，打印完第一张后才能打印第二张
      try {
        if (this.invoiceArr.length === len) { // 打印完所有发票的回调
          this.$messageTips(this, 'success', '打印成功')
          this.loading = false
          this.printSuccessCall && this.printSuccessCall()
          return
        }
        let curInfo = this.invoiceArr[len]
        let params = {
          infoTypeCode: 4600171320,
          infoNumber: curInfo.infoNumber || curInfo.invoiceNo,
          createGoodsList: false,
          showPrePrintDialog: true
        }
        let val = `请插入号码是[${params.infoNumber}]的增值税发票`
        this.$alert(val, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'cancel') return
            invoiceApi.printInvoice(params).then(result => {
              if (result.data.success) {
                this.updatePrintStatus(curInfo.infoNumber ? curInfo.infoNumber : curInfo.invoiceNo)
                this.printInvoice(len + 1)
                this.loading = false
              } else {
                this.$messageTips(this, 'error', '打印失败')
                console.log('第' + len + '个发票号打印失败')
                this.loading = false
              }
            })
          }
        })
      } catch (e) {
        this.$messageTips(this, 'error', '打印失败')
        console.log('第' + len + '个发票号打印失败')
      }
    },
    updatePrintStatus (invoiceNos) { // 修改发票状态为已打印
      invoiceApi.updatePrintStatus({invoiceNos: [invoiceNos]}).then(result => {
      })
    },
    updateInvoice (row) {
      this.invoiceDialog.infos = [row]
      this.invoiceDialog.visibile = true
    },
    updateInvoiceConfirm () {
      if (!this.invoiceDialog.value) {
        this.$messageTips(this, 'error', '发票号不能为空')
        return
      }
      let params = {
        invoiceNo: this.invoiceDialog.value,
        settlementType: 1,
        infos: []
      }
      this.invoiceDialog.infos.forEach(item => {
        let obj = {
          id: item.id,
          realTotalFee: item.realTotalFee
        }
        if (item.invoiceId) {
          obj['invoiceId'] = item.invoiceId
        }
        params.infos.push(obj)
      })
      invoiceApi.saveInvoice(params).then(result => {
        this.$messageTips(this, 'success', '保存成功')
        this.invoiceDialog.visibile = false
        this.query()
      })
    },
    localTaxInvoice ({ id }) { // 地税发票打印
      // let params = {
      //   settlementId: id,
      //   ver: 'master',
      //   code: 'rcm_dishui',
      //   requestType: '1',
      //   lang: '01',
      //   orgId: '5000'
      // }
      // invoiceApi.printByTemplate(params).then(rs => {
      //   let val = `请插入号码是[${rs.data.join(',')}]的发票`
      //   this.$alert(val, '提示', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       if (action === 'cancel') return
      //       everprint('rcm_dishui', params, {
      //         preview: true
      //       })
      //     }
      //   })
      // })
      this.printLocalTaxInvoice(id, 100)
    },
    printSuccessBack (data) { // 地税发票打印状态修改
      invoiceApi.printSave({ settlementIds: data }).then(result => {})
    }
  },
  async created () {
    invoiceApi.getValueByCode().then(result => {
      this.isJinShui = result === '1'
    })
  }
}

export default invoice
