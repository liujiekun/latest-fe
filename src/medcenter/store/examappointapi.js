import {medcenter as axios} from './api'
import {diction} from '@/store/common'
let url = '/phr/'
let url1 = '/sob/'
let url3 = '/rcm/'
// 体检套餐外的项目保存
function createPhysicalExamItem (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/createPhysicalExamItem', params)
}
// 医事服务类项目预约
function addAppointment (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/addAppointment', params)
}
// 医事服务类项目预约
function deleteAppointment (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/deleteAppointment', params)
}
// 检验delete
function deleteProgram (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/delete', params)
}
// 获取未支付的体检项结算单id
function getSettlementId (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/getSettlementId', params)
}
// 退费套餐外的
function cancelPhysicalItem (params) {
  return axios.post(url1 + 'physicalOrderController/cancelPhysicalItem', params)
}
// 取消体检单
function deletephysicalExam (params) {
  return axios.post(url + 'doctor/physicalExam/v3.3/delete', params)
}
// 取消体检单
function getPrint (params) {
  return axios.post(url3 + 'ar/settlement/getPrint', params)
}
// 追加体检项目
// 1、保存追加项目
function addPhysicalExamItem (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/addPhysicalExamItem', params)
}
// 2、获取追加项目
function getAdditionalitems (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/getZJItemListByOrderItemId', params)
}

export default {
  diction,
  createPhysicalExamItem,
  addAppointment,
  deleteAppointment,
  deleteProgram,
  getSettlementId,
  cancelPhysicalItem,
  deletephysicalExam,
  getPrint,
  addPhysicalExamItem,
  getAdditionalitems
}
