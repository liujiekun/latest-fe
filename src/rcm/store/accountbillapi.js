import rcm from './api'
import axios from 'axios'
const url = 'ar/accountbill/'
var CancelToken = axios.CancelToken
function formatResults (results) {
  var existRoorOrder = []
  let tmp = results.reduce(function (total, curr) {
    curr.fee = curr.amount
    curr.reimRatio = (curr.reimRatio || curr.reimRatio === 0) ? curr.reimRatio : 1
    curr.useInsurance = (curr.useInsurance || curr.useInsurance === 0) ? curr.useInsurance : 1
    if (!total[curr.recipeId + curr.recipeName]) {
      total[curr.recipeId + curr.recipeName] = []
    }
    total[curr.recipeId + curr.recipeName].push(curr)
    return total
  }, {})

  for (let k in tmp) {
    let bill = tmp[k]
    if (bill[0] && existRoorOrder.indexOf(bill[0].rootorderid) === -1) {
      existRoorOrder.push(bill[0].rootorderid)
      bill[0].isNewRoot = true
    }
  }
  return tmp
}

function getListByPatient (params) {
  return rcm.post(url + 'getListByPatient', params).then(results => {
    results.tableData = formatResults(results.mergedData)
    return results
  })
}

function list (params) {
  if (params.rangeDate && params.rangeDate.length) {
    params.beginDate = params.rangeDate[0]
    params.endDate = params.rangeDate[1]
  }
  return rcm.post(url + 'getListByPatient', params).then(results => {
    return formatResults(results.data)
  })
}

function getHelpList (params) {
  return rcm.post(url + 'getHelpList', params)
}

function settlelist (params) {
  if (settlelist.pending === true) {
    settlelist.source.cancel()
  }
  settlelist.pending = true
  settlelist.source = CancelToken.source()
  for (let key in params) {
    if (params[key] === '' || key === 'createdUpdate') {
      delete params[key]
    }
  }
  return rcm.post(url + 'getPatientList', params, {
    cancelToken: settlelist.source.token
  }).then((response) => {
    settlelist.pending = false
    return response
  }, (response) => {
    settlelist.pending = false
    return Promise.reject()
  })
}

export default {
  getHelpList,
  getListByPatient,
  settlelist,
  list
}
