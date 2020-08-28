import {medcenter as axios} from './api'
import {diction} from '@/store/common'
let url = '/phr/'

// 体检首页列表
function list (params) {
  return axios.post(url + 'doctor/physicalExam/v3.3/search', params)
}

// 体检详情页列表
function getBySetMealCatalogId (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/getBySetMealCatalogId', params)
}

// 体检详情页-目录列表
function finByMealCatalogId (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/finById', params)
}

// 体检 Item 创建
function createAppoint (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/create', params)
}

// 删除体检 Item
function deletePhysical (params) {
  return axios.post(url + 'doctor/physicalExamItem/v3.3/delete', params)
}

// 获取排班过的资源
function getArrangeResource (params) {
  return axios.post('arrange/resourceArrange/getArrangeResource', params)
}

// 查询医生某天某服务的号源列表
function getServiceTimeslieList (params) {
  return axios.post('arrange/resourceArrange/getServiceTimeslieList', params)
}

// 提交检验信息备注
function submitSetMealDesc (params) {
  return axios.post(url + 'doctor/physicalExam/v3.3/updateRemark', params)
}

// 下处方接口(西药)
function createRecipeInfo (params) {
  return axios.post('sob/OrderController/createRecipeInfo', params)
}

// 支付
function savePay (params) {
  return axios.post('market/doctor/setmealOrder/save', params)
}

// 下处方
function createPhysicalInfo (params) {
  return axios.post('sob/physicalOrderController/createPhysicalInfo', params)
}
// 下处方
function cancleBillRecipe (params) {
  return axios.post('sob/physicalOrderController/cancleBillRecipe', params)
}
// 打印报告之后更新发报告状态
function updateIssue (params) {
  return axios.post(url + 'doctor/physicalExam/v3.3/updateIssue', params)
}
// 体检绑定未建档用户
function bindAppointmentRecord (params) {
  return axios.post('arrange/appointment/bindAppointmentRecord', params)
}
// ______________________
// 体检套餐外项目的支付
function createMealOutItemOrder (params) {
  return axios.post(url + 'doctor/physicalExam/v3.3/createMealOutItemOrder', params)
}

export default {
  diction,
  list,
  getBySetMealCatalogId,
  createAppoint,
  deletePhysical,
  getArrangeResource,
  getServiceTimeslieList,
  finByMealCatalogId,
  submitSetMealDesc,
  createRecipeInfo,
  savePay,
  createPhysicalInfo,
  cancleBillRecipe,
  updateIssue,
  bindAppointmentRecord,
  createMealOutItemOrder
}
