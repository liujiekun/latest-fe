// 血液入库api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'bloodBank/'

function list (params) {
  let path = 'getInStockList'
  return axios.post(url + path + '/', params)
}

function getById (params) {
  let path = 'getBloodInStockInfo'
  return axios.post(url + path + '/', params)
}

export default {
  list,
  getById
}
