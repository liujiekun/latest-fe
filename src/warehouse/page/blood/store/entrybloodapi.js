// 血液入库api
import {warehouse as axios} from '@/warehouse/store/api'
const url = 'bloodBank/'

function getScancodeInfo (params) {
  let path = 'createBloodBank'
  return axios.post(url + path + '/', params)
}

function create (params) {
  let path = 'submitBloodBankInStock'
  return axios.post(url + path + '/', params)
}

export default {
  getScancodeInfo,
  create
}
