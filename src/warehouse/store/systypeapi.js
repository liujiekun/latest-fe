import { warehouse as axios } from './api'
const url = 'sysType/'
function getById (id) {
  return axios.post(url + 'getSysType/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (id, systype) {
  var path = id ? 'updateSysType' : 'createSysType'
  return axios.post(url + path + '/', systype)
}

function del (id) {
  return axios.post(url + 'updateSysType/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getSysTypeList/', params)
}

function validation (params) {
  return axios.post(url + 'getNumBySysTypeOnly/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  validation,
  list
}
