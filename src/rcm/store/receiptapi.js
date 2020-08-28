import axios from './api'
import {diction} from '@/store/common'
const comUrl = diction.api
const url = 'ar/insuranceRcv/'
const createUrl = 'ar/receipt/'
const verifactionUrl = 'ar/verifaction/'
const insuranceOrgUrl = comUrl + '/insurance/insuranceOrg/'

var corpTypeStr = [
  {id: '0', name: '基本医疗保险'},
  {id: '1', name: '商业医疗保险'}
]

function getInsuranceOrgById (id) {
  return axios.post(insuranceOrgUrl + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}
function createOrUpdate (obj) {
  return axios.post(createUrl + 'createBySettlements', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id
  })
}

function verifaction (id) {
  return axios.post(verifactionUrl + 'createByReceiptId/', {
    id: id
  })
}

function list (params) {
  return axios.post(url + 'getListForReceiptBySids/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  getById,
  createOrUpdate,
  del,
  list,
  verifaction,
  getInsuranceOrgById,
  corpTypeStr
}
