import axios from './api'
const url = 'pub/account/'
const importUrl = 'pub/account/'

function getById (params) {
  return axios.post(url + 'getAccountDetailList', params).then(result => {
    return result
  })
}
function importAccountSheet (params) {
  return axios.post(url + 'importAccountSheet', params).then(result => {
    return result.data
  })
}
function exportAccountSheet (params) {
  return axios.post(url + 'exportAccountSheet', params).then(result => {
    return result.data
  })
}

function create (obj) {
  return axios.post(url + 'create/', obj)
}
function update (obj) {
  return axios.post(url + 'update/', obj)
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

function getAccountList (id) {
  return axios.post(url + 'getAccountList/', {id: id}).then((response) => {
    return response
  })
}

function getAccSheetByIsHost (params) {
  return axios.post(url + 'getAccSheetByIsHost/', params).then((response) => {
    return response
  })
}
function importPart (params) {
  return axios.post(importUrl + 'importAccountSubject/', params).then((response) => {
    return response
  })
}
function importEditPart (params) {
  return axios.post(importUrl + 'modifyAccountSubject/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  create,
  update,
  del,
  list,
  getAccountList,
  getAccSheetByIsHost,
  importAccountSheet,
  exportAccountSheet,
  importPart,
  importEditPart
}
