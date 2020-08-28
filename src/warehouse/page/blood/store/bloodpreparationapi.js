import { warehouse as axios } from '@/warehouse/store/api'
const url = 'bloodPreparation/'

function getById (params) {
  let path = 'getPreparationInfo'
  return axios.post(url + path + '/', params)
}

function updatePreparation (params) {
  let path = 'updatePreparation'
  return axios.post(url + path + '/', params)
}
function getBloodPaitentCodeByPreparation (params) {
  let path = 'getBloodPaitentCodeByPreparation'
  return axios.post('bloodPaitent/' + path + '/', params)
}

async function list (params) {
  let path = 'getPreparationList'
  return await axios.post(url + path + '/', params)
}

export default {
  list,
  getById,
  updatePreparation,
  getBloodPaitentCodeByPreparation
}
