import { warehouse as axios } from '@/warehouse/store/api'
const url = 'bloodMatching/'

function getById (params) {
  let path = 'getBloodMatchingInfo'
  return axios.post(url + path + '/', params)
}

async function list (params) {
  let path = 'getBloodMatchingList'
  return await axios.post(url + path + '/', params)
}

function updateMatching (params) {
  let path = 'updateBloodMatching'
  return axios.post(url + path + '/', params)
}

function cancelBloodMatching (params) {
  let path = 'cancelBloodMatching'
  return axios.post(url + path + '/', params)
}

function getBloodMatchingLogList (params) {
  let path = 'getBloodMatchingLogList'
  return axios.post(url + path + '/', params)
}

function updateCloseTimeForBloodMatching (params) {
  let path = 'updateCloseTimeForBloodMatching'
  return axios.post(url + path + '/', params)
}

function updateBloodBank (params) {
  let path = 'bloodBank/updateBloodBank'
  return axios.post(path + '/', params)
}

export default {
  list,
  getById,
  updateMatching,
  cancelBloodMatching,
  updateCloseTimeForBloodMatching,
  getBloodMatchingLogList,
  updateBloodBank
}
