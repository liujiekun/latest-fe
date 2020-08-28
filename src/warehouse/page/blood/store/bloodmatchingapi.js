import { warehouse as axios } from '@/warehouse/store/api'
const url = 'bloodMatching/'
const urlpath = 'bloodBank/'
const urlbloodTake = 'bloodTake/'

function getById (params) {
  let path = 'getBloodMatchingInfo'
  return axios.post(url + path + '/', params)
}

function scanBloodBankCode (params) {
  let path = 'scanBloodBankCode'
  return axios.post(urlpath + path + '/', params)
}

function createBloodMatching (params) {
  let path = 'createBloodMatching'
  return axios.post(url + path + '/', params)
}

function updateBloodMatchingItem (params) {
  let path = 'updateBloodMatchingItem'
  return axios.post(url + path + '/', params)
}
function getBloodTakeInfoByCode (params) {
  let path = 'getBloodTakeInfoByCode'
  return axios.post(urlbloodTake + path + '/', params)
}
function getBloodMatchingItemListByCode (params) {
  let path = 'getBloodMatchingItemListByCode'
  return axios.post(url + path + '/', params)
}

function updateBloodTake (params) {
  let path = 'updateBloodTake'
  return axios.post(urlbloodTake + path + '/', params)
}
function getBloodPaitentCodeByPreparation (params) {
  let path = 'getBloodPaitentCodeByMatching'
  return axios.post('bloodPaitent/' + path + '/', params)
}

async function list (params) {
  let path = 'getBloodMatchingList'
  return await axios.post(url + path + '/', params)
}

export default {
  list,
  getById,
  scanBloodBankCode,
  createBloodMatching,
  updateBloodMatchingItem,
  getBloodTakeInfoByCode,
  getBloodMatchingItemListByCode,
  updateBloodTake,
  getBloodPaitentCodeByPreparation
}
