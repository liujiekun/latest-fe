// 预警提醒api
import {warehouse as axios} from '@/warehouse/store/api'
const url = 'bloodBankConfig/'
const mangeurl = 'bloodVarietyConfig/'
const bloodtypeurl = 'bloodTypeConfig/'

function updateBloodBankConfig (params) {
  let path = 'updateBloodBankConfig'
  return axios.post(url + path + '/', params)
}

function getBloodBankConfigList (params) {
  let path = 'getBloodBankConfigList'
  return axios.post(url + path + '/', params)
}
function getBloodVarietyConfigList (params) {
  let path = 'getBloodVarietyConfigList'
  return axios.post(mangeurl + path + '/', params)
}

function createBloodVarietyConfig (params) {
  let path = 'createBloodVarietyConfig'
  return axios.post(mangeurl + path + '/', params)
}
// 更新血液品种编码
function updateBloodVarietyConfig (params) {
  let path = 'updateBloodVarietyConfig'
  return axios.post(mangeurl + path + '/', params)
}
// 查询血型编码
function getBloodTypeConfigList () {
  let path = 'getBloodTypeConfigList'
  return axios.post(bloodtypeurl + path + '/')
}
// 更新血型编码
function updateBloodTypeConfig (params) {
  let path = 'updateBloodTypeConfig'
  return axios.post(bloodtypeurl + path + '/', params)
}
export default {
  getBloodBankConfigList,
  updateBloodBankConfig,
  getBloodTypeConfigList,
  updateBloodTypeConfig,
  updateBloodVarietyConfig,
  getBloodVarietyConfigList,
  createBloodVarietyConfig
}
