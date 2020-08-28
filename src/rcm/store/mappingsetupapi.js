import axios from './api'
const url = 'pub/mapadmin/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    result.data.input1 = result.data.input1 ? result.data.input1.toString() : ''
    result.data.input2 = result.data.input2 ? result.data.input2.toString() : ''
    result.data.input3 = result.data.input3 ? result.data.input3.toString() : ''
    result.data.input4 = result.data.input4 ? result.data.input4.toString() : ''
    result.data.details.forEach(function (item) {
      item.input4value = item.input4value ? item.input4value : ''
      item.input3value = item.input3value ? item.input3value : ''
      item.input2value = item.input2value ? item.input2value : ''
      item.input1value = item.input1value ? item.input1value : ''
    })
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getList1/', params).then((response) => {
    return response
  })
}

function getMapAdminByAccId (params) {
  return axios.post(url + 'getMapAdminByAccId', params).then(result => {
    return result.data
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  getMapAdminByAccId
}
