import { warehouse as axios } from './api'
const url = 'treatArea/'

function list (params) {
  return axios.post(url + 'getTreatAreaList/', params)
}

async function del (id) {
  return await axios.post(url + 'deleteTreatArea/', {id})
}

function add (params) {
  return axios.post(url + 'createTreatArea/', params)
}

function info (id) {
  return axios.post(url + 'getTreatAreaInfo/', {id})
}

function update (params) {
  return axios.post(url + 'updateTreatArea/', params)
}

export default {
  list,
  del,
  add,
  info,
  update
}
