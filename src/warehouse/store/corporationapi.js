import { warehouse as axios } from './api'
const url = 'corporation/'

function getById (id) {
  return axios.post(url + 'getCorporationInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateCorporation' : 'createCorporation'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateCorporation/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getCorporationList/', params).then((response) => {
    return response
  })
}

function validation (params) {
  return axios.post(url + 'getNumByCorporationOnly/', params).then((response) => {
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
  validation
}
