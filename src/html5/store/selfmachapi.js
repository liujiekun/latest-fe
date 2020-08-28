import { html5 as axios } from './selfapi'
// import { diction } from '@/store/common'
const url = 'thc-queue/doctor/'
const userUrl = 'thc-queue/user/'

// 获取机构列表
function getOriginList () {
  return axios.get(url + 'appConfig/getAllOrg')
}

// 获取自助机列表
function getSelfMach (params) {
  return axios.post(url + 'selfMachine/queryAllSelfMachine', params)
}

// 获取抽血室列表
function getDrawBloodRoomList (params) {
  return axios.post(url + 'selfMachine/getDrawBloodRoomWaitingInfo', params)
}

// 检查患者是否有未检查的抽血项
function checkPatient (params) {
  return axios.post(url + 'selfMachine/getServiceOrderItemCountByPatientId', params)
}

// 取号
function queuNumber (params) {
  return axios.post(userUrl + 'selfMachine/createQueueNum', params)
}

// 获取患者信息
function getPatientInfo (params) {
  return axios.post(userUrl + 'selfMachine/queryPatientInfo', params)
}

// 获取报告列表
function getReportList (params) {
  return axios.post(userUrl + 'selfMachine/getReportList', params)
}

// 更改打印报告状态
function printReport (params) {
  return axios.post(userUrl + 'selfMachine/updateReportStatus', params)
}

export default {
  getOriginList,
  getSelfMach,
  getDrawBloodRoomList,
  checkPatient,
  queuNumber,
  getPatientInfo,
  getReportList,
  printReport
}
