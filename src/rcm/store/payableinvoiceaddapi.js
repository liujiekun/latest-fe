import axios from './api'
const url = 'ap/purInvoice/'

function list (params) {
  if (params.supplierId) {
    return axios.post(url + 'getAcceptanceList/', params).then((response) => {
      response.data.forEach(function (item) {
        item.verifyAmount = item.verifyAmount || 0
        item.fee = item.acceptancePrice - item.verifyAmount
      })
      return response
    }, (response) => {
      return response
    })
  } else {
    return Promise.resolve([])
  }
}

export default {
  list
}
