import { phr as axios, purl } from '../api'
// 药物临嘱 简略信息
function getDrugBriefInfo (params) {
  return axios.post('t04drug/v3.2/getTheTempDrugBriefInfo', params)
}
// 药物长嘱
function getLongDrug (params) {
  return axios.post('t04drug/v3.2/getTheLongDrugInfo', params)
}
// 诊断信息 简略信息
function getDiagBriefInfo (params) {
  return axios.post('t03diagnosis/v3.2/getTheDiagBriefInfo', params)
}
// 其他医嘱
function getdocOrder (params) {
  return axios.post('t22OtherAdvice/v3.2/getByVisitSn', params)
}
// 检查
function getCurExamItem (params) {
  return axios.post('t11ExamineAppForm/v3.2/getCurExamItemByVisitSn', params)
}
// 检验
function getCurInspItem (params) {
  return axios.post('t12InspectAppForm/v3.2/getCurInspItemByVisitSn', params)
}
// 临嘱dialog
function getDialogdrugInfo (params) {
  return axios.post('t04drug/v3.2/getTheTempDrugInfo', params)
}
// 诊断diglog
function getDialogdiagInfo (params) {
  return axios.post('t03diagnosis/v3.2/getTheDiagInfo', params)
}
// 其他医嘱 dialog
function getDialogOrder (params) {
  return axios.post('t22OtherAdvice/v3.2/getByVisitSnAndCreateTime', params)
}
// 费用
function getAllcost (params) {
  return axios.post('ipSettlement/v3.2/getWeekInfoByVisitSn', params)
}
// 手术
function getOperation (params) {
  return axios.post('t09SurgeryNotice/v3.2/getWeekInfoByVisitSn', params)
}
// 病历文书
function getMedical (params) {
  return axios.post(purl + 'medicalRecord/getCurMedicalRecordByTime', params)
}
// 长嘱查询详情
function getTheExecute (params) {
  return axios.post('t04drug/v3.2/getTheExecuteInfo', params)
}
export default {
  getDrugBriefInfo,
  getLongDrug,
  getDiagBriefInfo,
  getdocOrder,
  getCurExamItem,
  getCurInspItem,
  getDialogdrugInfo,
  getDialogdiagInfo,
  getDialogOrder,
  getAllcost,
  getMedical,
  getOperation,
  getTheExecute
}
