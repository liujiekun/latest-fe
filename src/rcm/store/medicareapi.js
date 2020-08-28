import rcm from './api'
import {diction} from '@/store/common'
const url = diction.api
const printInvoiceUrl = '/insurance/medicare/'

function printInvoice (params) {
  return rcm.post(url + printInvoiceUrl + 'printInvoice', params)
}

export default {
  printInvoice
}
