import axios from './api'
const url = 'ar/arPeriodMange/'
const clinicUrl = 'pub/setofbook/'
const yearUrl = 'pub/control/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}
function create (obj) {
  return axios.post(url + 'updateArPeriodStatus/', obj)
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
  return axios.post(url + 'getArPeriodList/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getArPeriodList (params) {
  return axios.post(url + 'getArPeriodList/', params).then((response) => {
    response.data.forEach(function (item) {
      item.name = item.periodName
    })
    return response
  }, (response) => {
    return response
  })
}
function getPeriodSEDate (id) {
  return axios.post(url + 'getPeriodSEDate/', {id: id}).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  getById,
  create,
  del,
  list,
  getListByClinicId,
  getPeriodYear,
  getArPeriodList,
  getPeriodSEDate
}
