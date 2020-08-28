import { warehouse as axios } from '@/warehouse/store/api'
const url = '/basesource/'
const materialUrl = 'material/'

// 列表
async function list (params) {
  return await axios.post(materialUrl + 'tenantSkuList/', params)
}
// 启用禁用
function updateMaterialSpuMaster (params) {
  return axios.post(materialUrl + 'updateMaterialSpuMaster/', params)
    .then((result) => {
      return result
    })
}
function updateState (params) {
  return axios.post(url + 'getSourceByUpdateLocalSettingState/', params)
    .then((result) => {
      return result
    })
}

export default {
  list,
  updateMaterialSpuMaster,
  updateState
}
