import axios from './api'
const url = 'pub/rules/'

var module = [
  {id: 1, name: '收入'},
  {id: 2, name: '支出'},
  {id: 3, name: '成本'}
]

var relaWithOther = [
  {id: 0, name: '合并'},
  {id: 1, name: '不合并'}
]

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}
function importAccountRule (params) {
  return axios.post(url + 'importAccountRule', params).then(result => {
    return result.data
  })
}
function exportAccountRule (params) {
  return axios.post(url + 'exportAccountRule', params).then(result => {
    return result.data
  })
}
function createOrUpdate (obj) {
  return axios.post(url + 'update/', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  if (params.clinicid && params.id) {
    return axios.post(url + 'getList1/', params).then((response) => {
      response.data.forEach(function (item) {
        item.selectRadio = false
      })
      return response
    }, (response) => {
      return response
    })
  } else {
    return Promise.resolve([])
  }
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  module,
  relaWithOther,
  importAccountRule,
  exportAccountRule
}
