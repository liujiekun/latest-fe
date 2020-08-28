import {warehouse as axios} from './api'
const url = 'assetTransfer/'

function createOrUpdate (obj) {
  return axios.post(url + 'createAssetTransfer/', obj)
}

function apply (obj) {
  return axios.post(url + 'createAssetTransferForApply/', obj)
}
function allotBound (obj) {
  return axios.post(url + 'createAssetTransferForAllotBound/', obj)
}
function outBound (obj) {
  return axios.post(url + 'createAssetTransferForInOutStock/', obj)
}

export default {
  createOrUpdate,
  apply,
  allotBound,
  outBound
}
