// 血液入库api
import {warehouse as axios} from '@/warehouse/store/api'
const url = 'sampleCollection/'
//  根据code查询取样信息
function getSampleInfoByBarcode (params) {
  let path = 'getSampleInfoByBarcode'
  return axios.post(url + path + '/', params)
}

function saveSampleInfo (params) {
  let path = 'saveSampleInfo'
  return axios.post(url + path + '/', params)
}

export default {
  getSampleInfoByBarcode,
  saveSampleInfo
}
