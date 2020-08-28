import axios from './api'
const url = 'pub/period/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
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

function getPeriodList (params) {
  return axios.post(url + 'getPeriodList/', params).then((response) => {
    return response
  })
}

function list (params) {
  return axios.post(url + 'getList1/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  getPeriodList
}
