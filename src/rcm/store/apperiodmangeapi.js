import axios from './api'
const url = 'ap/apPeriodManage/'
const clinicUrl = '/pub/setofbook/'
const yearUrl = '/pub/control/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}
function create (obj) {
  return axios.post(url + 'updateApPeriodStatus/', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function getListByClinicId (params) {
  return axios.post(clinicUrl + 'getListByClinicId/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getPeriodYear (params) {
  return axios.post(yearUrl + 'getPeriodYear/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function list (params) {
  if (params.setOfBooksId && params.year) {
    return axios.post(url + 'getApPeriodList/', params).then((response) => {
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
  create,
  del,
  list,
  getListByClinicId,
  getPeriodYear
}
