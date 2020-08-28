import axios from './api'
const url = 'ar/accountbill/'

var confirmType = [
  {id: 0, name: '门诊预收'},
  {id: 1, name: '门诊预收--收入确认'},
  {id: 2, name: '门诊收入确认'},
  {id: 3, name: '住院预售'},
  {id: 4, name: '住院预售--收入确认'},
  {id: 5, name: '住院收入确认'}
]

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
  console.log(id)
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getListForConfirm/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  confirmType
}
