import { warehouse as axios } from './api'

const url = 'area/'
function getById (id) {
  return axios.post(url + 'getAreaInfo/', {
    id
  }).then(result => {
    result.category = []
    result.category.push(result.provinceCode)
    result.category.push(result.cityCode)
    result.category.push(result.areaCode)
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateArea' : 'createArea'
  // 地址格式化成 addr：{省：XXX，市：XXX，县：XXX}
  obj.provinceCode = obj.category[0]
  obj.cityCode = obj.category[1]
  obj.areaCode = obj.category[2]
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateArea/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getAreaList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
