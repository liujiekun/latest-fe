import { warehouse as axios } from '@/warehouse/store/api'
const url = 'outpatientDispense/'
const mailUrl = 'expressInformation/'
const backUrl = 'backStocks/'

// 根据条件查询发药列表-区分自备/邮寄/自取
function list (params) {
  return axios.post(url + 'list/', params)
}
// 列表查询查询患者维度任务列表
function taskVisitSnList (params) {
  return axios.post(url + 'taskVisitSnList/', params)
}
// 任务列表-任务明细
function getTaskInfo (params) {
  return axios.post(url + 'getTaskInfo/', params)
}
// 任务列表-患者维度
function getTaskVisitSn (params) {
  return axios.post(url + 'getTaskVisitSn/', params)
}
// 审核列表-患者维度
function getAuditVisitSn (params) {
  return axios.post(url + 'getAuditVisitSn/', params)
}
// 发药记录-患者列表
function getNotesVisitSn (params) {
  return axios.post(url + 'getNotesVisitSn/', params)
}
// 发药记录-明细任务
function getNotesInfo (params) {
  return axios.post(url + 'getNotesInfo/', params)
}
// 任务审核-右侧查询该患者名下的任务
function getTaskAuditInfo (params) {
  return axios.post(url + 'getTaskAuditInfo/', params)
}
// 修改发药方式/ 修改发货库房/ 标记异常
function updateChange (params) {
  return axios.post(url + 'updateChange/', params)
}
// 异常取消 / 取消审核驳回
function cancel (params) {
  return axios.post(url + 'cancel/', params)
}
// 通知 / 取消 / 发药完成 / 修改cpoe缴费 / 撤销异常 / 撤销驳回异常 发药任务
function updateOutpatientDispenseType (params) {
  return axios.post(url + 'updateOutpatientDispenseType/', params)
}
// 审核通过 / 审核驳回 (参数中没有recipeCommentDetailList通过，有recipeCommentDetailList驳回)
function comment (params) {
  return axios.post(url + 'comment/', params)
}
// 任务打印 / 重新打印
function printTask (params) {
  return axios.post(url + 'printTask/', params)
}
// 标记异常 / 审核驳回
function receive (params) {
  return axios.post(url + 'receive/', params)
}
// 邮寄发药完成
function address (params) {
  return axios.post(url + 'address/', params)
}
// 获取邮寄地址
function getMailAddress (params) {
  return axios.post(mailUrl + 'getMailAddress/', params)
}
// 创建/更新地址信息
function mailAddress (params) {
  return axios.post(mailUrl + 'mailAddress/', params)
}
// 查询快递信息
function getExpressInformationList (params) {
  return axios.post(mailUrl + 'getExpressInformationList/', params)
}
export { updateChange, cancel }
// 查询退药患者列表
function getOrderBy (params) {
  return axios.post(backUrl + 'getOrderBy/', params)
}
// 查询退药当前患者详细数据
function getBackStocksList (params) {
  return axios.post(backUrl + 'getBackStocksList/', params)
}
// 更新退药任务
function updateBackStocks (params) {
  return axios.post(backUrl + 'updateBackStocks/', params)
}

/**
 * 统一发药 接口
*/

// 门诊审核-患者维度
function getBatchAuditVisitSn (params) {
  return axios.post(url + 'getBatchAuditVisitSn/', params)
}
// 门诊审核-任务明细维度
function getBatchTaskAuditInfo (params) {
  return axios.post(url + 'getBatchTaskAuditInfo/', params)
}
// 门诊任务/门诊缺货-患者维度
function getBatchTaskVisitSn (params) {
  return axios.post(url + 'getBatchTaskVisitSn/', params)
}
// 门诊任务/门诊缺货-患者维度
function getBatchTaskInfo (params) {
  return axios.post(url + 'getBatchTaskInfo/', params)
}
// 门诊发药记录-患者维度
function getBatchNotesVisitSn (params) {
  return axios.post(url + 'getBatchNotesVisitSn/', params)
}
// 门诊发药记录-任务明细维度
function getBatchNotesInfo (params) {
  return axios.post(url + 'getBatchNotesInfo/', params)
}
// 门诊统一发药按处方打印全部处方单
function recipePrint (params) {
  return axios.post(url + 'recipePrint/', params)
}

export default {
  list,
  taskVisitSnList,
  getAuditVisitSn,
  getTaskVisitSn,
  getTaskAuditInfo,
  getTaskInfo,
  getNotesVisitSn,
  getNotesInfo,
  getOrderBy,
  getBackStocksList,
  updateChange,
  updateOutpatientDispenseType,
  updateBackStocks,
  comment,
  printTask,
  cancel,
  receive,
  address,
  getMailAddress,
  mailAddress,
  getExpressInformationList,
  // 统一发药接口
  getBatchAuditVisitSn,
  getBatchTaskAuditInfo,
  getBatchTaskVisitSn,
  getBatchTaskInfo,
  getBatchNotesVisitSn,
  getBatchNotesInfo,
  recipePrint
}
