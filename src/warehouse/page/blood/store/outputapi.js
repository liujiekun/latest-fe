import { warehouse as axios } from '@/warehouse/store/api'
const url = 'bloodTake/'

function getById (params) {
  let path = 'getBloodTakeInfo'
  return axios.post(url + path + '/', params)
}

async function list (params) {
  let path = 'getBloodTakeList'
  return await axios.post(url + path + '/', params)
}

function updateBloodTake (params) {
  let path = 'updateBloodTake'
  return axios.post(url + path + '/', params)
}

function cancelBloodMatching (params) {
  let path = 'cancelBloodMatching'
  return axios.post(url + path + '/', params)
}

function updateCloseTimeForBloodMatching (params) {
  let path = 'updateCloseTimeForBloodMatching'
  return axios.post(url + path + '/', params)
}

function getBloodTakeLogList (params) {
  let path = 'getBloodTakeLogList'
  return axios.post(url + path + '/', params)
}

function QuickExitBloodTake (params) {
  let path = 'QuickExitBloodTake'
  return axios.post(url + path + '/', params)
}

export default {
  list,
  getById,
  updateBloodTake,
  cancelBloodMatching,
  updateCloseTimeForBloodMatching,
  getBloodTakeLogList,
  QuickExitBloodTake
}
