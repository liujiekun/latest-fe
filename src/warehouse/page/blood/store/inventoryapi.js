import { warehouse as axios } from '@/warehouse/store/api'
const url = 'bloodBank/'

function getById (params) {
  let path = 'getBloodMatchingInfo'
  return axios.post(url + path + '/', params)
}

async function list (params) {
  let path = 'getBloodBankStockList'
  return await axios.post(url + path + '/', params)
}

function editBloodBank (params) {
  let path = 'editBloodBank'
  return axios.post(url + path + '/', params)
}

function getBloodBankLogList (params) {
  let path = 'getBloodBankLogList'
  return axios.post(url + path + '/', params)
}

function getBloodBankStockParentList (params) {
  let path = 'getBloodBankStockParentList'
  return axios.post(url + path + '/', params)
}

function getBloodBankStockList (params) {
  let path = 'getBloodBankStockList'
  return axios.post(url + path + '/', params)
}

export default {
  list,
  getById,
  editBloodBank,
  getBloodBankLogList,
  getBloodBankStockParentList,
  getBloodBankStockList
}
