import {workspace as axios} from '@/workspace/store/api.js'

function getPriceByOrg (param) {
  return axios.post('/pricemanage/pricing/query/show/tenant', param).then(res => {
    if (res.data) {
      return res.data
    }
    return []
  }).catch(() => [])
}

function getPriceByItem (param) {
  return axios.post('/pricemanage/pricing/query/show/org', param).then(res => {
    if (res.data) {
      return res.data
    }
    return []
  }).catch(() => [])
}

function getPriceColumns () {
  return axios.get('/pricemanage/pricing/scene/show/tenant/query').then(res => {
    if (res.data) {
      return res.data
    }
    return []
  }).catch(() => [])
}

function createPriceToService (param) {
  return axios.post('/pricemanage/pricing/set/adjust', param).then(res => {
    if (res.data) {
      return true
    }
    return false
  }).catch(() => false)
}
function initPriceToService (param, orgId) {
  return axios.post(`/pricemanage/pricing/set/base/init/batch/`, param).then(res => {
    if (res.data) {
      return true
    }
    return false
  }).catch(() => false)
}

export default {
  getPriceByOrg, // 价格查询-展示 - 集团
  getPriceByItem, // 价格查询-展示 - 机构
  getPriceColumns, // 价格配置维度表头信息
  createPriceToService, // 创建调价内容
  initPriceToService // 初始化基础价
}
