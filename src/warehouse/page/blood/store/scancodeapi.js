import {warehouse as axios} from '@/warehouse/store/api'
const url = 'bloodBank/'

function scancode (params) {
  let path = 'scanBloodBankCode'
  return axios.post(url + path + '/', params)
}

function scanBloodBankCode (params) {
  let path = 'scanBloodBankCode'
  return axios.post(url + path + '/', params)
}

export default {
  scancode,
  scanBloodBankCode
}
