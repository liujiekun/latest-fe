import {workspace as axios} from './api'
const url = '/sob/task/'
import {diction} from '@/store/common'
const url1 = diction.api + '/phr/'
const url2 = '/sob/'

function list (params) {
  if (params.liststatus === 1) {
    return axios.post(url + 'toDo', params)
      .then(result => {
        return result
      }).catch(err => {
        console.log(err)
        return null
      })
  } else {
    return axios.post(url + 'history', params)
      .then(result => {
        return result
      }).catch(err => {
        console.log(err)
        return null
      })
  }
}

function taskInfo (taskId) {
  return axios.post('/process/task/taskInfo', {
    taskId
  }).then(result => {
    return result.data
  })
}

// 查询医嘱项目
function queryName (params) {
  return axios.post(url + 'service/queryName', params)
  .then(result => {
    return result
  })
}

// 退药查询信息 中药
function getChiDragByVisitSn (visitSn) {
  return axios.get(url1 + 'doctor/chiRecipeRecord/getByVisitSn', {
    params: {
      visitSn: visitSn
    }
  }).then(result => {
    return result
  })
}

// 退药退号获取执行日志列表
function getLogList (params) {
  return axios.post(url + '/getLog', params)
  .then(result => {
    return result
  })
}

// 退药 退号
function returnOrder (params) {
  return axios.post(url + 'order/returnOrder', params)
  .then(result => {
    return result
  })
}

// 退号查询患者医生信息
function getAppointList (params) {
  return axios.post('/arrange/appoint/getAppointByOrder', params)
  .then(result => {
    return result
  })
}

function doTask (taskId, params, taskParams) {
  let data = {
    processData: Object.assign({
      'taskId': taskId
    }, taskParams),
    businessData: Object.assign({
      'taskId': taskId
    }, params)
  }
  return axios.post('/process/task/finish', data)
}

function getFormInf (orderId, orderItemId) {
  return axios.post('arrange/appoint/getFormInfo', {
    orderId: orderId,
    orderItemId: orderItemId
  })
}

function getMedicalOrderItem (orderItemId) {
  return axios.post('/sob/order/getMedicalOrderItem', {
    orderItemId: orderItemId
  })
}

// 检验是否收费(废弃)
function checkOrderIsPay (orderId) {
  return axios.post(url2 + 'order/getOrderInfo', {
    orderId
  })
}
// 获取今日最后一次预检信息
function getToDayLastCheck (params) {
  return axios.get(url1 + 'doctor/bodyCheck/getByPatientIdAndTime', {params: params})
}
// 获取眼科信息
function getByPatientIdAndTimeEye (params) {
  return axios.get(url1 + 'doctor/bodyCheck/getByPatientIdAndTimeEye', {params: params})
}
// 检查是否收费
function isNeedPayWarning (params) {
  return axios.post('/sob/sobconfig/isNeedPayWarning', params)
}

function getInstore (params) {
  return axios.post('/sob/checkprescription/getInstore', params)
}

function queryDrugStockNum (params) {
  return axios.post('/sob/stockCompensation/queryDrugStockNum', params)
}
function getRuleConfigByKey (params) {
  return axios.post('/arrange/ruleConfig/getRuleConfigByKey', params)
}

export default {
  list,
  queryName,
  getChiDragByVisitSn,
  getLogList,
  returnOrder,
  getAppointList,
  doTask,
  getFormInf,
  getMedicalOrderItem,
  diction,
  taskInfo,
  checkOrderIsPay,
  isNeedPayWarning,
  getToDayLastCheck,
  getInstore,
  queryDrugStockNum,
  getByPatientIdAndTimeEye,
  getRuleConfigByKey
}
