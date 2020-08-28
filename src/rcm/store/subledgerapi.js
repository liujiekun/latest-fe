import axios from './api'
const url = 'pub/setofbook/'
const calUrl = 'pub/calcu/'
const diUrl = '/pub/dimension/'
function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}

function getAccount (id) {
  return axios.post(url + 'getAccount', {
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

function list (params) {
  return axios.post(url + 'getName/', params).then((response) => {
    return response
  })
}

function getSobASListBySetId (params) {
  return axios.post(calUrl + 'getSobASListBySetId/', params).then((response) => {
    return response
  })
}

function updateSob (params) {
  return axios.post(calUrl + 'updateSob/', params).then((response) => {
    return response
  })
}
function getDimensionList (params) {
  return axios.post(diUrl + 'getDimensionList/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  getSobASListBySetId,
  updateSob,
  getAccount,
  getDimensionList
}
