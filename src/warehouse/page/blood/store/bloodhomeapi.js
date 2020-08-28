// 血液入库api
import {warehouse as axios} from '@/warehouse/store/api'
const url = 'bloodBank/'

function getBloodHomeInfo (params) {
  let path = 'getBloodBankReport'
  return axios.post(url + path + '/', params)
}

export default {
  getBloodHomeInfo
}
