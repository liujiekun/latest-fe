import api from '../api'

function getPatientList (params) {
  return api.post('ar/accountbill/getHomePagePatientList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function gethospitalList (params) {
  return api.post('ip/accountbill/getPatientList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getmarkList (params) {
  return api.post('mall/account/getList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getCurrentDaySettleInfo () {
  return api.post('ar/settlement/getCurrentDaySettleInfo').then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getCurrentDayIpInfo () {
  return api.post('ip/settlement/getCurrentDayIpInfo').then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getMallFeeOverall () {
  return api.post('mall/close/getMallFeeOverall').then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function created (params) {
  return api.post('mall/settlement/create', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getListInfo (params) {
  return api.post('mall/account/getListInfo', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  getPatientList,
  gethospitalList,
  getmarkList,
  getCurrentDaySettleInfo,
  getCurrentDayIpInfo,
  getMallFeeOverall,
  created,
  getListInfo
}
