/*
 * @Author: renpengfei
 * @Date: 2018-04-23 15:00:50
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-07-11 11:11:43
 */
import fetch from '../../api'
const summarylUrl = '/ar/summary'
const vouchUrl = '/pub/rules'
const searchVouchUrl = '/pub/tempAccVoucher'
/**
 * 创建核算汇总单
 *
 * @param {any} data
 * @returns
 */
export const summaryData = (data) => {
  return fetch({
    url: summarylUrl + '/summaryData',
    method: 'post',
    data: data
  })
}
/**
 * 获取核算汇总单列表
 *
 * @param {any} data
 * @returns
 */
export const getTitleList = (data) => {
  for (let key in data) {
    if (data[key] === '') {
      delete data[key]
    }
  }
  return fetch({
    url: summarylUrl + '/getTitleList',
    method: 'post',
    data: data
  })
}
/**
 * 核算汇总单详细信息
 *
 * @param {any} data
 * @returns
 */
export const gettest = (data) => {
  return fetch({
    url: summarylUrl + '/get',
    method: 'post',
    data: data
  })
}
/**
 * 交易类型值集
 *
 * @param {any} data
 * @returns
 */
export const getTradeTypeEnum = (data) => {
  return fetch({
    url: summarylUrl + '/getTradeTypeEnum',
    method: 'post',
    data: data
  })
}
/**
 * 交易类型
 *
 * @param {any} data
 * @returns
 */
export const getModuleAndTrade = (data) => {
  return fetch({
    url: summarylUrl + '/getModuleAndTrade',
    method: 'post',
    data: data
  })
}
/**
 * 模块值集
 *
 * @param {any} data
 * @returns
 */
export const getModuleTypeEnum = (data) => {
  return fetch({
    url: summarylUrl + '/getModuleTypeEnum',
    method: 'post',
    data: data
  })
}
/**
 * 生成临时凭证单条
 *
 * @param {any} data
 * @returns
 */
export const createTempVoucher = (data) => {
  return fetch({
    url: vouchUrl + '/createTempVoucher',
    method: 'post',
    data: data
  })
}
/**
 * 查询临时凭证
 *
 * @param {any} data
 * @returns
 */
export const getTempVoucherDetail = (data) => {
  return fetch({
    url: searchVouchUrl + '/getTempVoucherDetail',
    method: 'post',
    data: data
  })
}
/**
 * 删除临时凭证
 *
 * @param {any} data
 * @returns
 */
export const deleteTempVoucher = (data) => {
  return fetch({
    url: searchVouchUrl + '/deleteTempVoucher',
    method: 'post',
    data: data
  })
}
/**
 * 临时凭证审核
 *
 * @param {any} data
 * @returns
 */
export const verify = (data) => {
  return fetch({
    url: searchVouchUrl + '/verify',
    method: 'post',
    data: data
  })
}
/**
 * 临时凭证生成财务凭证
 *
 * @param {any} data
 * @returns
 */
export const createFinacialVoucher = (data) => {
  return fetch({
    url: searchVouchUrl + '/createFinacialVoucher',
    method: 'post',
    data: data
  })
}
/**
 * 临时凭证冲销
 *
 * @param {any} data
 * @returns
 */
export const writeOff = (data) => {
  return fetch({
    url: searchVouchUrl + '/writeOff',
    method: 'post',
    data: data
  })
}
/**
 * 删除汇总单
 *
 * @param {any} data
 * @returns
 */
export const deleteSum = (data) => {
  return fetch({
    url: summarylUrl + '/delete',
    method: 'post',
    data: data
  })
}
/**
 * 删除汇总单
 *
 * @param {any} data
 * @returns
 */
export const batchDelete = (data) => {
  return fetch({
    url: summarylUrl + '/batchDelete',
    method: 'post',
    data: data
  })
}
