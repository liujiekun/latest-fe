// 业务申领api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'requisition/'
const urlSwitch = 'switchConfig/'
const defaultUrl = 'apply/'

function createOrUpdate (params) {
  let path = params.id ? 'rollBackRequistion' : 'createRequisition'
  return axios.post(url + path + '/', params)
}

function getById (id) {
  return axios.post(url + 'getRequisitionInfo/', id).then((result) => {
    return result
  })
}

function getMoreById (id) {
  return axios.post(url + 'getRequisitionInfoAndUsableNum/', id).then((result) => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getRequisitionList/', params)
}

function updateSwitch (params) {
  return axios.post(urlSwitch + 'updateSwitchConfig/', params).then((response) => {
    return response
  })
}

function defaultStorageRoom (params) {
  return axios.post(defaultUrl + 'defaultParentRoom/', params).then(result => {
    return result
  })
}

function createApplyOrder (params) {
  return axios.post(defaultUrl + 'createApplyOrder/', params).then(result => {
    return result
  })
}

export default {
  updateSwitch,
  list,
  getMoreById,
  getById,
  createOrUpdate,
  defaultStorageRoom,
  createApplyOrder
}
